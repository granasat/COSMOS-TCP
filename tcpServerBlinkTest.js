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

var _ = require('c-struct');

var soh_t = {
    length : 0,
    id : 1,
    delay: 250
};

var _soh_t = new _.Schema({
    length : _.type.uint8,
    id : _.type.uint8,
    delay : _.type.uint8
});

_.register('soh_t', _soh_t);

//Log
var log = require('./utils/logger.js').Logger;

//Config
var config = require('./config.json');

var net = require('net');

//Interval
var interval;

var server = net.createServer(function(socket) {
    socket.on('data', function (input) {
        log("Received data: " + input.toString('utf8'), "info");

        soh_t.delay = input.toString('utf8').charCodeAt(0);

        //Changing delay of interval
        clearInterval(interval);
        createInterval(socket);
    });

    socket.on('end', function () {
        log("Connection terminated", "info");
       clearInterval(interval);
    });

    socket.on('error', function () {
        log("Connection terminated caused by error", "info");
        clearInterval(interval);
    });

    log("New connection", "info");

    createInterval(socket);
});

server.listen(config.web_port, config.web_host);
console.log("Listening on port " + config.web_port + " on " + config.web_host);


function createInterval(socket) {
    interval = setInterval(function () {
        soh_t.length = Object.keys(soh_t).length;

        var buff = _.packSync('soh_t', {
            length : soh_t.length,
            id : soh_t.id,
            delay : soh_t.delay
        });

        console.log(buff);

        socket.write(buff);
    }, 500);
}