path = require 'path-extra'
Promise = require 'bluebird'
fs = Promise.promisifyAll(require 'fs-extra')


callback = (err) ->
  console.log(err) if err?

{APPDATA_PATH} = window
SAVE_PATH = path.join APPDATA_PATH, "response-saver"
fs.ensureDir SAVE_PATH, callback

handleResponse = (e) ->
  savePath = path.join SAVE_PATH, (new Date).getTime().toString()+".json"
  fs.outputJson savePath, e.detail, callback

module.exports =
  show: false
  pluginDidLoad: (e) ->
    dbg.enable()
    dbg.enableExtra 'gameResponse'
    window.addEventListener 'game.response', handleResponse
  pluginWillUnload: (e) ->
    window.removeEventListener 'game.response', handleResponse
