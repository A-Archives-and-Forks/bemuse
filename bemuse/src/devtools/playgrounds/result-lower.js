import { Provider } from 'react-redux'
import React from 'react'
import ResultScene from 'bemuse/app/ui/ResultScene'
import { SceneManager } from 'bemuse/scene-manager'
import configureStore from 'bemuse/app/redux/configureStore'

const sceneManager = new SceneManager(React.Fragment)

// A result whose score (400000) is LOWER than the score `tester` already has on
// this chart in the fake scoreboard (543210 on md5 fb3dab…, KB — see
// createFakeScoreboardClient). Submitting it must KEEP the higher existing
// score. Used by the "Keeps highest score" e2e test.
export function main() {
  const props = {
    result: {
      1: 9999,
      2: 999,
      3: 99,
      4: 9,
      missed: 123,
      score: 400000,
      maxCombo: 5555,
      accuracy: 0.9,
      totalCombo: 11106,
      grade: 'A',
      deltas: [0, 0.01, 0.03, -0.03, -0.06],
    },
    chart: {
      info: {
        title: 'Test Song',
        subtitles: ['fl*cknother'],
        artist: 'iaht',
        subartists: ['obj.flicknote'],
        genre: 'Frantic Hardcore',
        level: 17,
      },
      md5: 'fb3dab834591381a5b8188bc2dc9c4b7',
    },
    lr2Timegate: [20, 40],
    onExit: () => alert('Exit!'),
    onReplay: () => alert('Replay!'),
    playMode: 'KB',
  }
  sceneManager.display(
    <Provider store={configureStore()}>
      <ResultScene {...props} />
    </Provider>
  )
}
