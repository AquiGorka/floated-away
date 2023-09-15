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
const network = new EventEmitter()

network.online = false

rli.on("line", function (str) {
  if (RE_SUCCESS.test(str)) {
    if (!network.online) {
      network.online = true
      network.emit("online")
    }
  } else if (network.online) {
    network.online = false
    network.emit("offline")
  }
})

const notify = (status) => {
  // Object
  notifier.notify({
    title: "Network change",
    message: status,
  })
}

// then just listen for the `online` and `offline` events ...
const run = () => {
  network
    .on("online", function () {
      notify("Online")
    })
    .on("offline", function () {
      notify("Offline")
    })
}

run()
