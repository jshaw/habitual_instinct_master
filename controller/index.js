var _ = require('lodash');
var SerialPort = require("serialport");
var PubNub = require('pubnub');
var pubnub;
var pubnub_installation;


var jsonfile = require('jsonfile')
var file = './../pubnub_config.json';
var json

var ports = [];

jsonfile.readFile(file, function(err, obj) {
    console.dir(obj);
    json = obj;

    pubnub = new PubNub({
        subscribeKey: json.web_control.subKey,
        publishKey: json.web_control.pubKey,
        secretKey: json.web_control.secretKey,
        ssl: true
    });

    pubnub_installation = new PubNub({
        subscribeKey: json.installation.subKey,
        publishKey: json.installation.pubKey,
        secretKey: json.installation.secretKey,
        ssl: true
    });

    initPubNub();
    initPubNubInstallation();

});

function initApp(){
    listPorts();
}


function listPorts(){
    SerialPort.list(function (err, ports) {
        ports.forEach(function(port) {
            console.log(port.comName);
            console.log(port.pnpId);
            console.log(port.manufacturer);
            console.log("=====");
        });
    });

    initPorts();

}

// ToDO, get actual port names for the arduinos that are going to be used
// when plugged into port
function initPorts(){
    // ports[0] = new SerialPort('/dev/cu.usbmodem1411', {
    ports[0] = new SerialPort('/dev/cu.usbmodem1421', {
        parser: SerialPort.parsers.readline('\n'),
        // parser: SerialPort.parsers.raw,
        baudRate: 115200
    });

    // ==============

    // ports[1] = new SerialPort('/dev/cu.usbmodem14221', {
    //     parser: SerialPort.parsers.readline('\n'),
    //     // parser: SerialPort.parsers.raw,
    //     baudRate: 115200
    // });

    // ports[2] = new SerialPort('/dev/cu.usbmodem14231', {
    //     parser: SerialPort.parsers.readline('\n'),
    //     // parser: SerialPort.parsers.raw,
    //     baudRate: 115200
    // });

    // ==============

    // ports[3] = new SerialPort('/dev/tty-usbserial1', {
    //     parser: SerialPort.parsers.readline('\n')
    // });

    initPortUpdates();

}


// as a reminder, it might make sense to have these ports as another pupnub instance.
// this way there's two listenier for incomming data and ougoing control of the arduinos / microcontrolers
function initPortUpdates(){

    _.forEach(ports, function(value, key){
        ports[key].on('data', function (data) {
            // it is here that the data will be sent from 
            // each microcontroller and it will need to be sent to Pubnub
            console.log('Data: ' + data);
            publishInstallationData(data);
        });
    });
}

function initPubNub(){

    pubnub.addListener({
        
        message: function(m) {
            // handle message
            var channelName = m.channel; // The channel for which the message belongs
            var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
            var pubTT = m.timetoken; // Publish timetoken
            var msg = m.message; // The Payload

            // console.log("New Message", m);
            // console.log("New Message", typeof m);
            // console.log("New Message", msg);
            // console.log("New Message", m.message);
            // console.log("New Message", m.message.indexOf("_"));

            var msg_str = msg.message;
            
            // console.log("------ ", msg_str);
            // console.log("------ ", msg_str.indexOf("_"));

            if(msg_str.indexOf("__") == -1){
                // this means that it is a global control
                // global control
                globalControl(msg_str);
            }else {
                panelControl(msg_str);
            }
        },
        presence: function(p) {
            // handle presence
            var action = p.action; // Can be join, leave, state-change or timeout
            var channelName = p.channel; // The channel for which the message belongs
            var occupancy = p.occupancy; // No. of users connected with the channel
            var state = p.state; // User State
            var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
            var publishTime = p.timestamp; // Publish timetoken
            var timetoken = p.timetoken;  // Current timetoken
            var uuid = p.uuid; // UUIDs of users who are connected with the channel
        },
        status: function(s) {
            // handle status
        }
    });

    pubnub.subscribe({
        channels: ['habitual_instinct_control'],
        withPresence: true // also subscribe to presence instances.
    });
}

function initPubNubInstallation(){

    pubnub_installation.addListener({
        
        message: function(m) {
            // handle message
            var channelName = m.channel; // The channel for which the message belongs
            var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
            var pubTT = m.timetoken; // Publish timetoken
            var msg = m.message; // The Payload
            console.log("New Installation Message", m);
          
        },
        presence: function(p) {
            // handle presence
            var action = p.action; // Can be join, leave, state-change or timeout
            var channelName = p.channel; // The channel for which the message belongs
            var occupancy = p.occupancy; // No. of users connected with the channel
            var state = p.state; // User State
            var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
            var publishTime = p.timestamp; // Publish timetoken
            var timetoken = p.timetoken;  // Current timetoken
            var uuid = p.uuid; // UUIDs of users who are connected with the channel
        },
        status: function(s) {
            // handle status
        }
    });

    pubnub_installation.subscribe({
        channels: ['habitual_instinct_app'],
        withPresence: true // also subscribe to presence instances.
    });
}

function publishInstallationData(data){

    pubnub_installation.publish({
        // message: {
        //     such: data
        // },
        message: data.trim(),
        channel: 'habitual_instinct_app',
        sendByPost: false, // true to send via post
        storeInHistory: false, //override default storage options
        meta: {
            // "cool": "meta"
        } // publish extra meta with the request
    },
    function (status, response) {
        // handle status, response
        console.log("response log: ", arguments);
    });

}

function globalControl(msg){
    var control_val;

    console.log("=================================");
    console.log("control_val: ", control_val);
    // reset_with_pause
    console.log("=================================");

    switch (msg) {
        case 'start':
            //Statements executed when the result of expression matches value1
            control_val = "start";
            break;
        case 'stop':
            //Statements executed when the result of expression matches value2
            control_val = "stop";
            break;
        case 'wave':
            //Statements executed when the result of expression matches valueN
            control_val = "wave";
            break;
        case 'sweep':
            //Statements executed when the result of expression matches valueN
            control_val = "sweep";
            break;
        case 'sweepinteract':
            //Statements executed when the result of expression matches valueN
            control_val = "sweepinteract";
            break;
        case 'noise':
            //Statements executed when the result of expression matches valueN
            control_val = "noise";
            break;
        case 'noiseinteract':
            //Statements executed when the result of expression matches valueN
            control_val = "noiseinteract";
            break;
        default:
            //Statements executed when none of the values match the value of the expression
            console.log("Default");
            // nothing sends....
            control_val = msg;
            break;
    }

    console.log("control_val", control_val);
    console.log("control_val", ports.length);

    if(ports.length > 0){
        console.log("do we get here?");

        _.forEach(ports, function(value, key){
            // ports[key].on('data', function (data) {
            //     // it is here that the data will be sent from 
            //     // each microcontroller and it will need to be sent to Pubnub
            //     console.log('Data: ' + data);
            //     // ports[panel].write(control_val);

            //     // if(control_val == 'start'){
            //     //     ports[key].write(103);
            //     // } else if (control_val == 'stop'){
            //     //     ports[key].write(115);
            //     // }

            // });

            // console.log("value: ", value);
            console.log("key: ", key);

            // TODO, create a key look up table for the term to the single key for 
            // TODO, create a key look up table for the term to the single key for 
            // TODO, create a key look up table for the term to the single key for 
            // TODO, create a key look up table for the term to the single key for 
            // TODO, create a key look up table for the term to the single key for 
            // TODO, create a key look up table for the term to the single key for 
            // =========================================

            if(control_val == 'start'){
                console.log("START");
                // ports[key].write(new Buffer(103), function () {
                ports[key].write(new Buffer('g'), function () {
                    ports[key].drain(function(){
                        console.log("start args: ", arguments);
                    });
                });
            } else if (control_val == 'stop'){
                console.log("Stop");
                // ports[key].write(new Buffer(115), function () {
                // ports[key].write(115, function () {
                ports[key].write(new Buffer('s'), function () {
                    
                    ports[key].drain(function(){
                        console.log("stop args: ", arguments);
                    });
                });
            } else if (control_val == 'next'){
                console.log("Next");
                // ports[key].write(new Buffer(115), function () {
                // ports[key].write(115, function () {
                ports[key].write(new Buffer('n'), function () {
                    
                    ports[key].drain(function(){
                        console.log("next args: ", arguments);
                    });
                });
            } else if (control_val == 'previous'){
                console.log("Previous");
                // ports[key].write(new Buffer(115), function () {
                // ports[key].write(115, function () {
                ports[key].write(new Buffer('p'), function () {
                    
                    ports[key].drain(function(){
                        console.log("stop args: ", arguments);
                    });
                });
            } else if (control_val == 'configure'){
                console.log("Configure");
                // ports[key].write(new Buffer(115), function () {
                // ports[key].write(115, function () {
                ports[key].write(new Buffer('c'), function () {
                    
                    ports[key].drain(function(){
                        console.log("stop args: ", arguments);
                    });
                });
            } else if (control_val == 'sweep'){
                console.log("Sweep");
                // ports[key].write(new Buffer(115), function () {
                // ports[key].write(115, function () {
                ports[key].write(new Buffer('1'), function () {
                    
                    ports[key].drain(function(){
                        console.log("stop args: ", arguments);
                    });
                });
            } else if (control_val == 'sweep_react'){
                console.log("sweep_react");
                // ports[key].write(new Buffer(115), function () {
                // ports[key].write(115, function () {
                ports[key].write(new Buffer('2'), function () {
                    
                    ports[key].drain(function(){
                        console.log("sweep_react args: ", arguments);
                    });
                });
            } else if (control_val == 'sweep_react_pause'){
                console.log("sweep_react_pause");
                // ports[key].write(new Buffer(115), function () {
                // ports[key].write(115, function () {
                ports[key].write(new Buffer('3'), function () {
                    
                    ports[key].drain(function(){
                        console.log("sweep_react_pause args: ", arguments);
                    });
                });
            } else if (control_val == 'noise'){
                console.log("noise");
                // ports[key].write(new Buffer(115), function () {
                // ports[key].write(115, function () {
                ports[key].write(new Buffer('4'), function () {
                    
                    ports[key].drain(function(){
                        console.log("noise args: ", arguments);
                    });
                });
            } else if (control_val == 'noise_react'){
                console.log("Noise React");
                // ports[key].write(new Buffer(115), function () {
                // ports[key].write(115, function () {
                ports[key].write(new Buffer('5'), function () {
                    
                    ports[key].drain(function(){
                        console.log("noise react pause args: ", arguments);
                    });
                });
            // } else if (control_val == 'stop'){
            //     console.log("Stop");
            //     // ports[key].write(new Buffer(115), function () {
            //     // ports[key].write(115, function () {
            //     ports[key].write(new Buffer('s'), function () {
                    
            //         ports[key].drain(function(){
            //             console.log("stop args: ", arguments);
            //         });
            //     });
            } else if (control_val == 'pattern_wave_small_v2'){
                console.log("pattern_wave_small_v2");
                // ports[key].write(new Buffer(115), function () {
                // ports[key].write(115, function () {
                ports[key].write(new Buffer('6'), function () {
                    
                    ports[key].drain(function(){
                        console.log("stop args: ", arguments);
                    });
                });
            } else if (control_val == 'reset'){
                console.log("reset");
                // ports[key].write(new Buffer(115), function () {
                // ports[key].write(115, function () {
                ports[key].write(new Buffer('-'), function () {
                    
                    ports[key].drain(function(){
                        console.log("stop args: ", arguments);
                    });
                });
            } else if (control_val == 'reset_with_pause'){
                console.log("reset_with_pause");
                // ports[key].write(new Buffer(115), function () {
                // ports[key].write(115, function () {
                ports[key].write(new Buffer('='), function () {
                    
                    ports[key].drain(function(){
                        console.log("reset_with_pause args: ", arguments);
                    });
                });
            }

        });
    }
}

function panelControl(msg){
    var control_val;
    var split = msg.split("_");
    var behaviour = split[0];
    var panel_str = split[1];

    switch (behaviour) {
        case 'start':
            //Statements executed when the result of expression matches value1
            control_val = "start";
            break;
        case 'stop':
            //Statements executed when the result of expression matches value2
            control_val = "stop";
            break;
        case 'wave':
            //Statements executed when the result of expression matches valueN
            control_val = "wave";
            break;
        case 'sweep':
            //Statements executed when the result of expression matches valueN
            control_val = "sweep";
            break;
        case 'sweepinteract':
            //Statements executed when the result of expression matches valueN
            control_val = "sweepinteract";
            break;
        case 'noise':
            //Statements executed when the result of expression matches valueN
            control_val = "noise";
            break;
        case 'noiseinteract':
            //Statements executed when the result of expression matches valueN
            control_val = "noiseinteract";
            break;
        default:
            //Statements executed when none of the values match the value of the expression
            console.log("Default");
            // nothing sends....
            break;
    }

    // this resets only a certain panel to a default or mode
    var panel = panel_str.substring(1);

    console.log(panel);

    // ports[panel].write(control_val);

    if(control_val == 'start'){
        console.log("START");
        ports[panel].write(new Buffer("g"), function () {
            ports[panel].drain(function(){
                console.log("start args: ", arguments);
            });
        });
    } else if (control_val == 'stop'){
        console.log("Stop");
        ports[panel].write(new Buffer("s"), function () {
            ports[panel].drain(function(){
                console.log("stop args: ", arguments);
            });
        });
    }
    // ports[panel].write(new Buffer(control_val));
}

initApp();