path = require 'path-extra'
Promise = require 'bluebird'
fs = Promise.promisifyAll(require 'fs-extra')


callback = (err) ->
  console.log(err) if err?

{APPDATA_PATH} = window
SAVE_PATH = path.join APPDATA_PATH, "response-saver"
fs.ensureDir SAVE_PATH, callback

LOG_PATH = path.join SAVE_PATH, "timeline.log"
fs.ensureFile LOG_PATH, callback

handleResponse = (e) ->
  nowTime = (new Date).getTime().toString()
  savePath = path.join SAVE_PATH, e.detail.path, nowTime + ".json"
  storePath = path.join SAVE_PATH, "poi-store", nowTime + ".json"
  fs.outputJson savePath, e.detail.body, callback
  # fs.outputJson storePath, getStore(), callback
  fs.appendFile LOG_PATH, "#{nowTime} = #{e.detail.path}\n", callback

module.exports =
  show: false
  pluginDidLoad: (e) ->
    dbg.enable()
    dbg.enableExtra 'gameResponse'
    dbg.enableExtra 'moduleRenderCost'
    window.addEventListener 'game.response', handleResponse
  pluginWillUnload: (e) ->
    window.removeEventListener 'game.response', handleResponse
