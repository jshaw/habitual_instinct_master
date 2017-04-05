var _ = require('lodash');
var SerialPort = require("serialport");
var PubNub = require('pubnub');
var pubnub;
var pubnub_installation;

var jsonfile = require('jsonfile')
var file = './../pubnub_config.json';
var json

var ports = [];

var modeToKeyMap = {
    'start': 'g',
    'stop': 's',
    'sweep': '1',
    'sweep_react': '2',
    'sweep_react_pause': '3',
    'noise': '4',
    'noise_react': '5',
    'pattern_wave_small_v2': '6',
    'measure': '7',
    'measure_react': '8',
    'reset': '-',
    'reset_with_pause': '='
};

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
// Todo, create ports via loop of usbmodem port ID
// Todo, create ports via loop of usbmodem port ID
// Todo, create ports via loop of usbmodem port ID
// ==========

var portsLookup = [14111, 14121, 14131];
var globalBaudRate = 115200;
// var portsLookup = [14111, 14121, 14131, 14141];

function initPorts(){

    _.forEach(portsLookup, function(value, key){
        var serialPortConnect = '/dev/cu.usbmodem' + value;
        ports[key] = new SerialPort(serialPortConnect, {
            parser: SerialPort.parsers.readline('\n'),
            baudRate: globalBaudRate
        });
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
            publishInstallationData(data);
        });
    });
}



// Resets the serial ports by closing them, then reopening them
// ==========================
function resetSerialPorts(){
    var closePromise = new Promise((resolve, reject) => { 
        _.forEach(ports, function(value, key){
            ports[key].flush(function(){
                // console.log("close port: " + key);
                // console.log("close port value: " + value);
                // check the arguments that are passed in here
                ports[key].close();

                // on the last loop, resolve the promise,
                // this will cause all the serial ports to re-initiate.
                if(key == (ports.length-1)){
                    resolve("Success!");
                }
            });
        })
    });

    closePromise.then(function(msg){

        // once all of the ports are closed, reopen them
        initPorts();

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
            var msg_str = msg.message;


            if(msg_str == "reset_serial_ports"){
                // console.log('reset_serial_ports');
                resetSerialPorts();

            } else if(msg_str.indexOf("__") == -1){
                // this means that it is a global control
                // global control
                globalControl(msg_str);
            }else {
                console.log("get here?");
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
    console.log("=================================");

    // assign the passed in message to the control val
    // this will use the loopup table to reference correct key control to pass via serial
    control_val = msg;

    console.log("control_val", control_val);
    console.log("ports", ports.length);

    if(ports.length > 0){
        console.log("do we get here?");

        _.forEach(ports, function(value, key){
            
            console.log("key: ", key);

            // TODO, create a key look up table for the term to the single key for 
            // TODO, create a key look up table for the term to the single key for 
            // TODO, create a key look up table for the term to the single key for 
            // TODO, create a key look up table for the term to the single key for 
            // TODO, create a key look up table for the term to the single key for 
            // TODO, create a key look up table for the term to the single key for 
            // =========================================
            // TODO, bind a function to the port write and for the drain functions so it doesn't need 
            // to be duplicated over and over and over... :/
            // TODO, bind a function to the port write and for the drain functions so it doesn't need 
            // to be duplicated over and over and over... :/
            // TODO, bind a function to the port write and for the drain functions so it doesn't need 
            // to be duplicated over and over and over... :/
            // =========================================

            console.log(control_val);

            // used keymap look up table to reference the control key to the control mode
            ports[key].write(new Buffer(modeToKeyMap[control_val]), function () {
                ports[key].drain(function(){
                    console.log("start args: ", arguments);
                });
            });

        });
    }
}

function panelControl(msg){
    var control_val;
    var split = msg.split("__");
    var behaviour = split[0];
    var panel_str = split[1];


    console.log("panel_str", panel_str);
    console.log("behaviour", behaviour);

    // sets the behaviour control mesage to the control val for reference in lookup map
    control_val = behaviour;

    // this resets only a certain panel to a default or mode
    var panel = panel_str.substring(1);
    console.log(panel);

    // used keymap look up table to reference the control key to the control mode
    ports[panel].write(new Buffer(modeToKeyMap[control_val]), function () {
        ports[panel].drain(function(){
            console.log("start args: ", arguments);
        });
    });

}

initApp();