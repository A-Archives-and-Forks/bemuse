import { Provider } from 'react-redux'
import React from 'react'
import ResultScene from 'bemuse/app/ui/ResultScene'
import { SceneManager } from 'bemuse/scene-manager'
import configureStore from 'bemuse/app/redux/configureStore'

// Shared renderer for the ResultScene playgrounds (see ./playgrounds/result*.js).
export function showResultPlayground({ score, accuracy, md5, playMode }) {
  const props = {
    result: {
      1: 9999,
      2: 999,
      3: 99,
      4: 9,
      missed: 123,
      score,
      maxCombo: 5555,
      accuracy,
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
      md5,
    },
    lr2Timegate: [20, 40],
    onExit: () => alert('Exit!'),
    onReplay: () => alert('Replay!'),
    playMode,
  }
  const sceneManager = new SceneManager(React.Fragment)
  sceneManager.display(
    <Provider store={configureStore()}>
      <ResultScene {...props} />
    </Provider>
  )
}
