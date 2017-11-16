import path from 'path-extra'
import fs from 'fs-extra'
import _ from 'lodash'

const jsondiffpatch = require('jsondiffpatch').create()

const { APPDATA_PATH, $, dbg } = window
const PLG_NAME = 'response-saver'
const SAVE_PATH = path.join(APPDATA_PATH, PLG_NAME)

const STORE_KEYS = ['battle', 'const', 'info', 'sortie']


const purify = obj => JSON.parse(JSON.stringify(_.pick(obj, STORE_KEYS)))

fs.ensureDirSync(SAVE_PATH)

const LOG_PATH = path.join(SAVE_PATH, 'timeline.log')
const RESOURCE_LOG_PATH = path.join(SAVE_PATH, 'resource_timeline.log')
fs.ensureFileSync(LOG_PATH)
fs.ensureFileSync(RESOURCE_LOG_PATH)

let store

const saveStoreDiff = (storePath, storeDiffPath) => {
  if (!store) {
    store = purify(window.getStore())
    return fs.outputJson(storePath, store)
  }
  const newStore = purify(window.getStore())
  const diff = jsondiffpatch.diff(store, newStore)
  store = newStore
  if (diff) {
    return fs.outputJson(storeDiffPath, diff)
  }
}

const handleGameResponse = async (e) => {
  const nowTime = (new Date()).getTime().toString()
  const savePath = path.join(SAVE_PATH, e.detail.path, `${nowTime}.json`)
  const storePath = path.join(SAVE_PATH, 'poi-store', `${nowTime}.json`)
  const storeDiffPath = path.join(SAVE_PATH, 'poi-store', `${nowTime}.diff.json`)
  try {
    await Promise.all([
      fs.outputJson(savePath, e.detail),
      fs.appendFile(LOG_PATH, `${nowTime} = ${e.detail.path}\n`),
      saveStoreDiff(storePath, storeDiffPath),
    ])
  } catch (err) {
    console.error(err.stack)
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
    window.addEventListener('game.response', handleGameResponse)
    // if (webview != null) webview.addEventListener('did-get-response-details', handleResourceResponse)
  },
  pluginWillUnload: () => {
    window.removeEventListener('game.response', handleGameResponse)
    // if (webview != null) webview.removeEventListener('did-get-response-details', handleResourceResponse)
  },
}
