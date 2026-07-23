import { Page, expect, test } from '@playwright/test'

// These tests share a single fake-scoreboard "tester" account and mutate its
// server-side state, so they must run in order on a single worker. Under
// Playwright's non-CI default (fullyParallel), running them concurrently makes
// "Keeps highest score" flake. CI already runs with workers=1; this makes local
// runs safe too.
test.describe.configure({ mode: 'serial' })

test('Can sign up', async ({ page }) => {
  await page.goto('/?flags=fake-scoreboard,skip-to-music-select')
  await page.getByText('Log In / Create an Account').click()
  await page
    .locator('.AuthenticationPanel')
    .getByText('Create an Account')
    .click()

  await page.getByLabel('Username').fill('tester')
  await page.getByLabel('Email').fill('tester@tester.bemuse.ninja')
  await page.getByLabel('Password').first().fill('h@cKm3Bemuse!')
  await page.getByLabel('Confirm Password').first().fill('h@cKm3Bemuse!')
  await page.getByRole('button', { name: 'Sign Me Up' }).click()

  await expect(page.locator('body')).toContainText('Log Out (tester)')
})

test('Cannot sign up if duplicate account', async ({ page }) => {
  await page.goto('/?flags=fake-scoreboard,skip-to-music-select')
  await page.getByText('Log In / Create an Account').click()
  await page
    .locator('.AuthenticationPanel')
    .getByText('Create an Account')
    .click()

  await page.getByLabel('Username').fill('taken')
  await page.getByLabel('Email').fill('taken@tester.bemuse.ninja')
  await page.getByLabel('Password').first().fill('h@cKm3Bemuse!')
  await page.getByLabel('Confirm Password').first().fill('h@cKm3Bemuse!')
  await page.getByRole('button', { name: 'Sign Me Up' }).click()

  await expect(page.locator('.AuthenticationPanel')).toContainText(
    'Username already taken'
  )
})

test('Can log in and out', async ({ page }) => {
  await page.goto('/?flags=fake-scoreboard,skip-to-music-select')
  await logIn(page, 'tester')
  await expect(page.getByText('Log In / Create an Account')).not.toBeVisible()
  await logOut(page)
  await expect(page.getByText('Log In / Create an Account')).toBeVisible()
})

test('Can submit score to improve', async ({ page }) => {
  await page.goto('/?mode=playground&playground=result&flags=fake-scoreboard')
  await expect(page.locator('.Ranking')).toContainText('111111')
  await logInFromRankingTable(page, 'tester')
  await expect(page.locator('.Ranking')).not.toContainText('111111')
  await expect(page.locator('.Ranking')).toContainText('222222')
})

test('Keeps highest score', async ({ page }) => {
  // The `result-lower` playground submits a score (400000) below the score
  // `tester` already has on this chart (543210), so the higher existing score
  // must be kept. Asserting the kept score appears in "Your Ranking" is
  // deterministic — unlike asserting the absence of a value that a legitimate
  // submission would add (the previous version raced the async submit).
  await page.goto(
    '/?mode=playground&playground=result-lower&flags=fake-scoreboard'
  )
  await expect(page.locator('.Rankingのleaderboard')).toContainText('543210')
  await logInFromRankingTable(page, 'tester')
  await expect(page.locator('.Rankingのyours')).toContainText('543210')
})

test('Clears data when switching user', async ({ page }) => {
  await page.goto('/?flags=fake-scoreboard,skip-to-music-select')
  const chart = page.locator(
    '.MusicListItemChart[data-md5="fb3dab834591381a5b8188bc2dc9c4b7"]'
  )
  await chart.click()
  await expect(chart).not.toHaveClass(/is-played/)

  await test.step('Log in as tester - stats should show', async () => {
    await logIn(page, 'tester')
    await expect(chart).toHaveClass(/is-played/)
    await expect(chart).toContainText('S')
    await expect(page.getByTestId('stats-best-score')).toContainText('543210')
    await page.getByText('Ranking').click()
    await expect(page.locator('.Rankingのyours')).toContainText('543210')
  })

  await test.step('Log out - stats should vanish', async () => {
    await logOut(page)
    await expect(chart).not.toHaveClass(/is-played/)
    await expect(page.getByText('Log In / Create an Account')).toBeVisible()
    await expect(page.locator('.Rankingのyours')).not.toContainText('543210')
  })

  await test.step('Log in as tester2 - stats should show', async () => {
    await logIn(page, 'tester2')
    await expect(page.locator('.Rankingのyours')).toContainText('123456')
    await page.getByText('Stats').click()
    await expect(page.getByTestId('stats-best-score')).toContainText('123456')
  })
})

async function logIn(page: Page, username: string) {
  await page.getByText('Log In / Create an Account').click()
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').first().fill('h@cKm3Bemuse!')
  await page.getByRole('button', { name: 'Log In' }).click()
  await expect(page.locator('body')).toContainText('Log Out')
}

async function logInFromRankingTable(page: Page, username: string) {
  await page.getByText('log in or create an account').click()
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').first().fill('h@cKm3Bemuse!')
  await page.getByRole('button', { name: 'Log In' }).click()
  await expect(page.getByText('log in or create an account')).not.toBeVisible()
}

async function logOut(page: Page) {
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByText('Log Out').click()
}
