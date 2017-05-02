// var colors;
// var texts;
var controls;

var pubnub;
var pubnub_config;
var pub;
var sub;

var pubnub_logging;

// this is a zero index count
var num_of_panels = 3;

var function_control_list = [
    'start',
    'stop', 
    'sweep', 
    'sweep_react', 
    'sweep_react_pause', 
    'noise', 
    'noise_react', 
    'pattern_wave_small_v2',
    'measure',
    'measure_react',
    'reset',
    'reset_with_pause'];

// var randomize_function_list = [
//     'sweep', 
//     'sweep_react', 
//     'sweep_react_pause', 
//     'noise', 
//     'noise_react', 
//     'pattern_wave_small_v2'];

function preload() {

    loadStrings('../pubnub_config.txt', loadPubNubConfig);
}

function setup() { 
    createCanvas(400, 400);

    controls = new Control();
    var gui = new dat.GUI({width:520});
    gui.remember(controls);

    var f = gui.addFolder("Ransomize");
    f.add(controls, 'randomize').onChange(function(value){
        console.log("random val change: ", value);
        controls.publishConfig.message = {
            message : "control_randomize_toggle_" + value
        };

        controls.publish();
    });

    f.add(controls, 'randomize_timer')
        .min(0)
        .max(600000)
        .step(1000)
        .onFinishChange(function(value){
            lastAutoRestDelay = value;
            console.log("lastAutoRestDelay: " + lastAutoRestDelayLong);

            console.log("controls:" + controls.publishConfig);

            controls.publishConfig.message = {
                message : "control_randomize_timer_" + value
            };

            controls.publish();

        });

    f.add(controls, 'pause_timer')
        .min(0)
        .max(60000)
        .step(1000)
        .onFinishChange(function(value){
            lastAutoRestDelayShort = value;
            console.log("lastAutoRestDelayShort: " + lastAutoRestDelayShort);

            controls.publishConfig.message = {
                message : "control_pause_timer_" + value
            };

            controls.publish();

        });

    f.add(controls, 'data_logging');
    f.add(controls, 'reset_serial_ports');

    var f0 = gui.addFolder("Global");
    var f1 = gui.addFolder("Arduino One");
    var f2 = gui.addFolder("Arduino Two");
    var f3 = gui.addFolder("Arduino Three");
    // var f4 = gui.addFolder("Arduino Four");

    var i;
    for(i = 0; i <= num_of_panels; i++){
        _.forEach(function_control_list, function(value, key){
            var suffix = "__f" + (i - 1);

            if(i == 0){
                f0.add(controls, value);
            } else if(i == 1){
                f1.add(controls, value + suffix);
            } else if(i == 2){
                f2.add(controls, value + suffix);
            } else if(i == 3){
                f3.add(controls, value + suffix);
            } else if(i == 4){
                f4.add(controls, value + suffix);
            }
        });
    };

    f.open();
    f0.open();
    // f2.open();

} 

var random_mode = true;
var current_millis = 0;

///////
var lastAutoRest = 0;


// ideal would be run for 900000 (15 min)
// rest for 30000 (30 seconds)

// NOTE TODO:
//////////////
// put in a test thing so that if testing the timer is super tiny... other wise
// its the normal size larger numbers

// 1 minute
var lastAutoRestDelayShort = 60000;
// var lastAutoRestDelayShort = 5000;

// 5 minutes
// var lastAutoRestDelay = 300000;
var lastAutoRestDelay = lastAutoRestDelayShort;

// these two vars need to be the same
var lastAutoRestDelayLong = 300000;
// var lastAutoRestDelayLong = 10000;


var last_active_mode = "noise_react";

function draw() { 

    random_mode = controls.randomize;
    data_logging = controls.data_logging;

    current_millis = millis();
    
    // would be useful to display on the screen what mode is actually active
    // Also to post the last time data was received from serial ports

}

function loadPubNubConfig(str) {
    pubnub_config = str;
    initPubNub();
    pubnubDataLogging();
    pubnubModeLogging();
}

function initPubNub(){

    pubnub = new PubNub({
        publishKey : pubnub_config[0].toString(),
        subscribeKey : pubnub_config[1].toString(),
        ssl: true
    });

}

function pubnubDataLogging(){


    pubnub_logging = new PubNub({
        publishKey : pubnub_config[3].toString(),
        subscribeKey : pubnub_config[4].toString(),
        ssl: true
    });
       
    pubnub_logging.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                // publishSampleMessage();
            }
        },
        message: function(message) {
            if(data_logging == true){
                console.log("Data Logs: ", message);
            }
        },
        presence: function(presenceEvent) {
            // handle presence
        }
    })      
    
    pubnub_logging.subscribe({
        channels: ['habitual_instinct_app'] 

    });
}

function pubnubModeLogging(){
       
    pubnub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                // publishSampleMessage();
            }
        },
        message: function(message) {
            // if(data_logging == true){
                console.log("Mode! : ", message);
                var mode = message.message;
                outputMode(mode);
            // }
        },
        presence: function(presenceEvent) {
            // handle presence
        }
    })      
    
    pubnub.subscribe({
        channels: ['habitual_instinct_control'] 
    });
}

var mode_display = "";
function outputMode(mode){
    background(255);

    console.log(typeof mode);
    console.log(typeof mode.message);

    if(typeof mode == 'string'){
        mode_display = "mode: " + mode;
    } else {
        mode_display = "mode: " + mode.message;
    }
    textSize(32);
    text(mode_display, 10, 30);

}


function Control() {
    this.publishConfig = {
        channel : "habitual_instinct_control",
    };

    console.log("this.publishConfig: " + this.publishConfig);

    this.randomize = true;
    this.randomize_timer = lastAutoRestDelayLong;
    this.pause_timer = lastAutoRestDelayShort;

    this.data_logging = false;

    this.reset_serial_ports = (function(){
        console.log("reset_serial_ports");
        this.publishConfig.message = {
            message : "reset_serial_ports"
        };

        this.publish();
    });

    this.start = function(){
        console.log("start");
        

        this.publishConfig.message = {
            message : "start"
        };

        this.publish();
    }

    this.stop = function(){
        console.log("stop");

        this.publishConfig.message = {
            message : "stop"
        };

        this.publish();
    }

    this.sweep = function(){
        console.log("sweep");
        

        this.publishConfig.message = {
            message : "sweep"
        };

        this.publish();
    }

    this.sweep_react = function(){
        console.log("sweep_react");
        

        this.publishConfig.message = {
            message : "sweep_react"
        };

        this.publish();
    }

    this.sweep_react_pause = function(){
        console.log("sweep_react_pause");
        

        this.publishConfig.message = {
            message : "sweep_react_pause"
        };

        this.publish();
    }

    this.noise = function(){
        console.log("noise");
        

        this.publishConfig.message = {
            message : "noise"
        };

        this.publish();
    }

    this.noise_react = function(){
        console.log("noise_react");

        this.publishConfig.message = {
            message : "noise_react"
        };

        this.publish();
    }

    this.pattern_wave_small_v2 = function(){
        console.log("pattern_wave_small_v2");
        

        this.publishConfig.message = {
            message : "pattern_wave_small_v2"
        };

        this.publish();
    }

    this.measure = function(){
        console.log("measure");
        

        this.publishConfig.message = {
            message : "measure"
        };

        this.publish();
    }

    this.measure_react = function(){
        console.log("measure_react");

        this.publishConfig.message = {
            message : "measure_react"
        };

        this.publish();
    }

    this.reset = function(){
        console.log("reset");

        this.publishConfig.message = {
            message : "reset"
        };

        this.publish();
    }

    this.reset_with_pause = function(){
        console.log("reset_with_pause");

        this.publishConfig.message = {
            message : "reset_with_pause"
        };

        this.publish();
    }

    // ========================
    // ========================

    // need to refactor after here
    // Panel 1
    this.start__f0 = function(){
        console.log("start__f0");

        this.publishConfig.message = {
            message : "start__f0"
        };

        this.publish();
    }

    this.stop__f0 = function(){
        console.log("stop__f0");

        this.publishConfig.message = {
            message : "stop__f0"
        };

        this.publish();
    }

    this.sweep__f0 = function(){
        console.log("sweep__f0");

        this.publishConfig.message = {
            message : "sweep__f0"
        };

        this.publish();
    }

    this.sweep_react__f0 = function(){
        console.log("sweep_react__f0");
        

        this.publishConfig.message = {
            message : "sweep_react__f0"
        };

        this.publish();
    }

    this.sweep_react_pause__f0 = function(){
        console.log("sweep_react_pause__f0");
        

        this.publishConfig.message = {
            message : "sweep_react_pause__f0"
        };

        this.publish();
    }

    this.noise__f0 = function(){
        console.log("noise__f0");
        

        this.publishConfig.message = {
            message : "noise__f0"
        };

        this.publish();
    }

    this.noise_react__f0 = function(){
        console.log("noise_react__f0");
        

        this.publishConfig.message = {
            message : "noise_react__f0"
        };

        this.publish();
    }

    this.pattern_wave_small_v2__f0 = function(){
        console.log("pattern_wave_small_v2__f0");
        

        this.publishConfig.message = {
            message : "pattern_wave_small_v2__f0"
        };

        this.publish();
    }

    this.measure__f0 = function(){
        console.log("measure__f0");
        

        this.publishConfig.message = {
            message : "measure__f0"
        };

        this.publish();
    }

    this.measure_react__f0 = function(){
        console.log("measure_react");
        

        this.publishConfig.message = {
            message : "measure_react__f0"
        };

        this.publish();
    }

    this.reset__f0 = function(){
        console.log("reset");
        

        this.publishConfig.message = {
            message : "reset__f0"
        };

        this.publish();
    }

    this.reset_with_pause__f0 = function(){
        console.log("reset_with_pause");
        

        this.publishConfig.message = {
            message : "reset_with_pause__f0"
        };

        this.publish();
    }


    // panel 2
    // ============================
    this.start__f1 = function(){
        console.log("start__f1");

        this.publishConfig.message = {
            message : "start__f1"
        };

        this.publish();
    }

    this.stop__f1 = function(){
        console.log("stop__f1");

        this.publishConfig.message = {
            message : "stop__f1"
        };

        this.publish();
    }

    this.sweep__f1 = function(){
        console.log("sweep__f1");
        

        this.publishConfig.message = {
            message : "sweep__f1"
        };

        this.publish();
    }

    this.sweep_react__f1 = function(){
        console.log("sweep_react__f1");
        

        this.publishConfig.message = {
            message : "sweep_react__f1"
        };

        this.publish();
    }

    this.sweep_react_pause__f1 = function(){
        console.log("sweep_react_pause__f1");
        

        this.publishConfig.message = {
            message : "sweep_react_pause__f1"
        };

        this.publish();
    }

    this.noise__f1 = function(){
        console.log("noise__f1");
        

        this.publishConfig.message = {
            message : "noise__f1"
        };

        this.publish();
    }

    this.noise_react__f1 = function(){
        console.log("noise_react__f1");
        

        this.publishConfig.message = {
            message : "noise_react__f1"
        };

        this.publish();
    }

    this.pattern_wave_small_v2__f1 = function(){
        console.log("pattern_wave_small_v2__f1");
        

        this.publishConfig.message = {
            message : "pattern_wave_small_v2__f1"
        };

        this.publish();
    }

    this.measure__f1 = function(){
        console.log("measure__f1");
        

        this.publishConfig.message = {
            message : "measure__f1"
        };

        this.publish();
    }

    this.measure_react__f1 = function(){
        console.log("measure_react__f1");
        

        this.publishConfig.message = {
            message : "measure_react__f1"
        };

        this.publish();
    }

    this.reset__f1 = function(){
        console.log("reset");
        

        this.publishConfig.message = {
            message : "reset__f1"
        };

        this.publish();
    }

    this.reset_with_pause__f1 = function(){
        console.log("reset_with_pause");
        

        this.publishConfig.message = {
            message : "reset_with_pause__f1"
        };

        this.publish();
    }


    // panel 3
    // ==================
    this.start__f2 = function(){
        console.log("start__f2");

        this.publishConfig.message = {
            message : "start__f2"
        };

        this.publish();
    }

    this.stop__f2 = function(){
        console.log("stop__f2");

        this.publishConfig.message = {
            message : "stop__f2"
        };

        this.publish();
    }

    this.sweep__f2 = function(){
        console.log("sweep__f2");
        

        this.publishConfig.message = {
            message : "sweep__f2"
        };

        this.publish();
    }

    this.sweep_react__f2 = function(){
        console.log("sweep_react__f2");
        

        this.publishConfig.message = {
            message : "sweep_react__f2"
        };

        this.publish();
    }

    this.sweep_react_pause__f2 = function(){
        console.log("sweep_react_pause__f2");
        

        this.publishConfig.message = {
            message : "sweep_react_pause__f2"
        };

        this.publish();
    }

    this.noise__f2 = function(){
        console.log("noise__f2");
        

        this.publishConfig.message = {
            message : "noise__f2"
        };

        this.publish();
    }

    this.noise_react__f2 = function(){
        console.log("noise_react__f2");
        

        this.publishConfig.message = {
            message : "noise_react__f2"
        };

        this.publish();
    }

    this.pattern_wave_small_v2__f2 = function(){
        console.log("pattern_wave_small_v2__f2");
        

        this.publishConfig.message = {
            message : "pattern_wave_small_v2__f2"
        };

        this.publish();
    }

    this.measure__f2 = function(){
        console.log("measure__f2");
        

        this.publishConfig.message = {
            message : "measure__f2"
        };

        this.publish();
    }

    this.measure_react__f2 = function(){
        console.log("measure_react__f2");
        

        this.publishConfig.message = {
            message : "measure_react__f2"
        };

        this.publish();
    }

    this.reset__f2 = function(){
        console.log("reset");
        

        this.publishConfig.message = {
            message : "reset__f2"
        };

        this.publish();
    }

    this.reset_with_pause__f2 = function(){
        console.log("reset_with_pause");
        

        this.publishConfig.message = {
            message : "reset_with_pause__f2"
        };

        this.publish();
    }


    // panel 4
    // ==================
    this.start__f3 = function(){
        console.log("start__f3");

        this.publishConfig.message = {
            message : "start__f3"
        };

        this.publish();
    }

    this.stop__f3 = function(){
        console.log("stop__f3");

        this.publishConfig.message = {
            message : "stop__f3"
        };

        this.publish();
    }

    this.sweep__f3 = function(){
        console.log("sweep__f3");
        

        this.publishConfig.message = {
            message : "sweep__f3"
        };

        this.publish();
    }

    this.sweep_react__f3 = function(){
        console.log("sweep_react__f3");
        

        this.publishConfig.message = {
            message : "sweep_react__f3"
        };

        this.publish();
    }

    this.sweep_react_pause__f3 = function(){
        console.log("sweep_react_pause__f3");
        

        this.publishConfig.message = {
            message : "sweep_react_pause__f3"
        };

        this.publish();
    }

    this.noise__f3 = function(){
        console.log("noise__f3");
        

        this.publishConfig.message = {
            message : "noise__f3"
        };

        this.publish();
    }

    this.noise_react__f3 = function(){
        console.log("noise_react__f3");
        

        this.publishConfig.message = {
            message : "noise_react__f3"
        };

        this.publish();
    }

    this.pattern_wave_small_v2__f3 = function(){
        console.log("pattern_wave_small_v2__f3");
        

        this.publishConfig.message = {
            message : "pattern_wave_small_v2__f3"
        };

        this.publish();
    }

    this.measure__f3 = function(){
        console.log("measure__f3");
        

        this.publishConfig.message = {
            message : "measure__f3"
        };

        this.publish();
    }

    this.measure_react__f3 = function(){
        console.log("measure_react__f3");
        

        this.publishConfig.message = {
            message : "measure_react__f3"
        };

        this.publish();
    }

    this.reset__f3 = function(){
        console.log("reset");
        

        this.publishConfig.message = {
            message : "reset__f3"
        };

        this.publish();
    }

    this.reset_with_pause__f3 = function(){
        console.log("reset_with_pause");
        

        this.publishConfig.message = {
            message : "reset_with_pause__f3"
        };

        this.publish();
    }

    this.publish = function(){

        console.log("remember to put the publish back into the app");

        // this sets the last / previous mode that was selected
        var tmp_msg = this.publishConfig.message.message;
        if(tmp_msg != 'reset_with_pause' 
            && tmp_msg != 'reset' 
            && tmp_msg != 'measure'
            && tmp_msg != 'stop'
            && tmp_msg != 'measure_react'
            && tmp_msg != 'reset_serial_ports'){
         
                last_active_mode = this.publishConfig.message.message;
                console.log(">>>> " + last_active_mode);
        }

        pubnub.publish(this.publishConfig, function(status, response) {
            console.log(status, response);
        });
    }
}
