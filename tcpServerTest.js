/*

SOURCE: https://gist.github.com/tedmiston/5935757
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp
server, but for some reason omit a client connecting to it.

And connect with a tcp client from the command line using netcat, the *nix
utility for reading and writing across tcp/udp network connections.  I've only
used it for debugging myself.
$ netcat 127.0.0.1 1337


MODIFIED FOR SAVING INPUT DATA TO A FILE
*/

//Log
var log = require('./utils/logger.js').Logger;

//Config
var config = require('./config.json');

var net = require('net');

var server = net.createServer(function(socket) {
    socket.on('data', function (input) {
        log("Received data: " + input.toString('utf8'), "info");
    });
});

server.listen(config.web_port, config.web_host);
console.log("Listening on port " + config.web_port + " on " + config.web_host);


