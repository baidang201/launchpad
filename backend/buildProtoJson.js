import pbjs from 'protobufjs/cli/pbjs.js'

pbjs.main(['--target', 'json', '../proto/message.proto', '-o', '../proto/message.json'], function (err) {
    if (err) { throw err }
    // do something with output
})
