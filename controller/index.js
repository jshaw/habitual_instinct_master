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
        subscribeKey: json.controller.subKey,
        publishKey: json.controller.pubKey,
        secretKey: json.controller.secretKey,
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

    // initPorts();

}

// ToDO, get actual port names for the arduinos that are going to be used
// when plugged into port
function initPorts(){
    ports[0] = new SerialPort('/dev/tty-usbserial1', {
        parser: SerialPort.parsers.readline('\n')
    });

    ports[1] = new SerialPort('/dev/tty-usbserial1', {
        parser: SerialPort.parsers.readline('\n')
    });

    ports[2] = new SerialPort('/dev/tty-usbserial1', {
        parser: SerialPort.parsers.readline('\n')
    });

    ports[3] = new SerialPort('/dev/tty-usbserial1', {
        parser: SerialPort.parsers.readline('\n')
    });

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
            
            console.log("------ ", msg_str);
            console.log("------ ", msg_str.indexOf("_"));

            if(msg_str.indexOf("_") == -1){
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
            console.log("New Message", m);
          
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
        channels: ['habitual_instinct_app'],
        withPresence: true // also subscribe to presence instances.
    });
}

function globalControl(msg){
    var control_val;
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
        case 'sweep_interact':
            //Statements executed when the result of expression matches valueN
            control_val = "sweep_interact";
            break;
        case 'noise':
            //Statements executed when the result of expression matches valueN
            control_val = "noise";
            break;
        case 'noise_interact':
            //Statements executed when the result of expression matches valueN
            control_val = "noise_interact";
            break;
        default:
            //Statements executed when none of the values match the value of the expression
            console.log("Default");
            // nothing sends....
            break;
    }

    console.log("control_val", control_val);
    console.log("control_val", ports.length);

    if(ports.length > 0){

        _.forEach(ports, function(value, key){
            ports[key].on('data', function (data) {
                // it is here that the data will be sent from 
                // each microcontroller and it will need to be sent to Pubnub
                console.log('Data: ' + data);
                ports[panel].write(control_val);
            });
        });
    }
}

function panelControl(msg){
    var control_val;
    var split = msg.split("_");
    var behaviour = split[0];
    var panel_str = split[1];

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
        case 'sweep_interact':
            //Statements executed when the result of expression matches valueN
            control_val = "sweep_interact";
            break;
        case 'noise':
            //Statements executed when the result of expression matches valueN
            control_val = "noise";
            break;
        case 'noise_interact':
            //Statements executed when the result of expression matches valueN
            control_val = "noise_interact";
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

    ports[panel].write(control_val);
    // ports[panel].write(new Buffer(control_val));
}

initApp();