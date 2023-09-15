#!/usr/bin/env node

const notifier = require("node-notifier")
const EventEmitter = require("events").EventEmitter
const spawn = require("child_process").spawn
const rl = require("readline")

const RE_SUCCESS = /bytes from/i
const INTERVAL = 2 // in seconds
const IP = "8.8.8.8"

const proc = spawn("ping", ["-v", "-n", "-i", INTERVAL, IP])
const rli = rl.createInterface(proc.stdout, proc.stdin)

let online = false

const notify = (status) => {
  notifier.notify({
    title: "Network change",
    message: status,
  })
}

rli.on("line", function (str) {
  const on = RE_SUCCESS.test(str)

  if (online && !on) {
    online = false
    notify("Offline")
    return
  }

  if (!online && on) {
    online = true
    notify("Online")
    return
  }
})
