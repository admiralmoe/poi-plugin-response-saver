import path from 'path-extra'
import { promisifyAll } from 'bluebird'
import _ from 'lodash'

const jsondiffpatch = require('jsondiffpatch').create()
const fs = promisifyAll(require('fs-extra'))

const { APPDATA_PATH, $, dbg } = window
const PLG_NAME = 'response-saver'
const SAVE_PATH = path.join(APPDATA_PATH, PLG_NAME)

const callback = (err) => {
  if (err != null) {
    console.log(err)
  }
}

const purify = obj => JSON.parse(JSON.stringify(obj))

fs.ensureDirSync(SAVE_PATH)

const LOG_PATH = path.join(SAVE_PATH, 'timeline.log')
const RESOURCE_LOG_PATH = path.join(SAVE_PATH, 'resource_timeline.log')
fs.ensureFileSync(LOG_PATH)
fs.ensureFileSync(RESOURCE_LOG_PATH)

let store

const handleGameResponse = (e) => {
  const nowTime = (new Date()).getTime().toString()
  const savePath = path.join(SAVE_PATH, e.detail.path, `${nowTime}.json`)
  const storePath = path.join(SAVE_PATH, 'poi-store', `${nowTime}.json`)
  const storeDiffPath = path.join(SAVE_PATH, 'poi-store', `${nowTime}.diff.json`)
  fs.outputJson(savePath, e.detail, callback)
  fs.appendFile(LOG_PATH, `${nowTime} = ${e.detail.path}\n`, callback)

  if (!store) {
    store = purify(window.getStore())
    fs.outputJson(storePath, store, callback)
  } else {
    const newStore = purify(window.getStore())
    const diff = jsondiffpatch.diff(store, newStore)
    fs.outputJson(storeDiffPath, diff, callback)
    store = newStore
  }
}

// const handleResourceResponse = (e) => {
//   const nowTime = (new Date()).getTime().toString()
//   const { httpResponseCode, newURL, originalURL } = e
//   let text = ''

//   if (newURL == null || originalURL == null) return
//   if (_.includes(newURL, 'ShimakazeGo')) return


//   text = (newURL == originalURL ?
//     `${nowTime}[${httpResponseCode}] = ${decodeURI(newURL)}\n` :
//     `${nowTime}[${httpResponseCode}] = ${decodeURI(originalURL)}, ${decodeURI(newURL)}\n`)

//   fs.appendFile(RESOURCE_LOG_PATH, text, callback)
// }

console.log(`LOGGING BEGINS AT ${SAVE_PATH}`)

export default {
  show: false,
  pluginDidLoad: () => {
    dbg.enable()
    dbg.enableExtra('gameResponse')
    // dbg.enableExtra ('moduleRenderCost')
    window.addEventListener('game.response', handleGameResponse)
    // if (webview != null) webview.addEventListener('did-get-response-details', handleResourceResponse)
  },
  pluginWillUnload: () => {
    window.removeEventListener('game.response', handleGameResponse)
    // if (webview != null) webview.removeEventListener('did-get-response-details', handleResourceResponse)
  },
}
