import pbjs from "protobufjs/cli/pbjs.js"

pbjs.main([ "--target", "json", "--keep-case", "true", "../proto/message.proto" , "-o", "../proto/message.json"], function(err, output) {
    if (err)
        throw err;
    // do something with output
});