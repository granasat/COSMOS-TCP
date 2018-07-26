/*

    See CCSDS short explanation here: https://acien101.github.io/BlaBlaBla/Desc_CCSDS/

 */

//REQUIRES
var net = require('net');
var log = require('./utils/logger.js').Logger;
var config = require('./config.json');
var spawn = require('child_process').spawn;
var leftPad = require('left-pad');

//Primary header data
var primHeader = {
    version : 0,
    pType : 0,      //Telemetry
    secHeaderFlag: 0,      //No secondary header present
    seqFlag : 11,        //Unsegmented User Data
    seqCount : 0,       //Not unsegment not necessary a counter
};


// Packet secondary header not needed for now


const direwolf = spawn('direwolf', ['-q', 'hd', '-t', '0']);

var server = net.createServer(function(socket) {            //Callback function called when 'connection' event of net is called
    log("New connection", "info");

    socket.on('end', function () {
        log("Connection terminated", "info");

        direwolf.stdout.removeAllListeners("data");
    });

    socket.on('error', function () {
        log("Connection terminated caused by error", "info");
    });

    direwolf.stdout.on('data', function (data) {
        var header = createHeader(primHeader.version, primHeader.pType, primHeader.secHeaderFlag, 0, primHeader.seqFlag,
            primHeader.seqCount, (data.length - 1).toString(2));      //Length minus 1 see doc

        socket.write(Buffer.concat([header, data], header.length + data.length));     //Write the header first and then the data
    });

});

server.listen(config.web_port, config.web_host);
console.log("Listening on port " + config.web_port + " on " + config.web_host);

function createHeader(version, pType, secHeaderFlag, apid, seqFlag, seqCount, pLength) {
    var header_bin = leftPad(version, 3, 0) +
        leftPad(pType, 1, 0) +
        leftPad(secHeaderFlag, 1, 0) +
        leftPad(apid, 11, 0) +
        leftPad(seqFlag, 2, 0) +
        leftPad(seqCount, 14, 0) +
        leftPad(pLength, 16, 0);

    return Buffer.from(leftPad(parseInt(header_bin, 2).toString(16), 12, 0), 'hex');
}




