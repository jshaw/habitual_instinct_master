var colors;
var texts;
var controls;

var pubnub;
var pubnub_config;
var pub;
var sub;

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

function preload() {

    loadStrings('../pubnub_config.txt', testFunction);
}

function setup() { 
    createCanvas(400, 400);

    colors = new Color();
    texts = new Text();
    controls = new Control();
    var gui = new dat.GUI({width:520});

    var f = gui.addFolder("Ransomize");
    f.add(controls, 'randomize');
    f.add(controls, 'reset_serial_ports');

    var f0 = gui.addFolder("Global");
    var f1 = gui.addFolder("Arduino One");
    var f2 = gui.addFolder("Arduino Two");
    var f3 = gui.addFolder("Arduino Three");
    var f4 = gui.addFolder("Arduino Four");

    var i;
    for(i = 0; i <= num_of_panels; i++){
        _.forEach(function_control_list, function(value, key){
            var suffix = "__f" + (i - 1);

            if(i == 0){
                console.log(value);
                console.log(key);
                console.log(controls);
                
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


var random_mode = false;

var millis_mode_timer = 0;
var current_millis = 0;
var randomize_last_autoreset = 0;
// var randomize_interval = 10000;
// var randomize_pause_interval = 1000;

// var randomize_interval = 30000;
// var randomize_pause_interval = 10000;


///////
var lastAutoRest = 0;
// var lastAutoRestDelay = 60000;
var lastAutoRestDelay = 30000;

// ideal would be run for 900000 (15 min)
// rest for 30000 (30 seconds)
// var lastAutoRestDelayShort = 60000;
var lastAutoRestDelayShort = 10000;
// 10 mins
// var lastAutoRestDelayLong = 600000;
var lastAutoRestDelayLong = 30000;
// 15 mins
//long lastAutoRestDelayLong = 900000;


function draw() { 
    background(colors.r, colors.g, colors.b);

    random_mode = controls.randomize;

    current_millis = millis();

    if(random_mode ==  true){
        console.log("random mode is active");
        if ((current_millis - lastAutoRest) > lastAutoRestDelay) {
            lastAutoRest = millis();
            console.log("0");
            if(lastAutoRestDelay == lastAutoRestDelayShort){
                console.log("1");
                lastAutoRestDelay = lastAutoRestDelayLong;
                // var tmp_random_val = random(0, function_control_list.length);
                // var method_name = function_control_list[tmp_random_val]
                var method_name = 'sweep';
                // TODO
                // NEED TO EXECUTE A DYNAMICALLY / PROGROMATICALLY FUNCTION NAME
                // http://stackoverflow.com/questions/969743/how-do-i-call-a-dynamically-named-method-in-javascript
                // http://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
                // controls[method_name];
                controls.sweep();
                
                // buttonPushCounter  = tmp_random_val;
            } else if(lastAutoRestDelay == lastAutoRestDelayLong){
                console.log("3");
                lastAutoRestDelay = lastAutoRestDelayShort;
                controls.stop();
            }
        }
    }

}

function testFunction(str) {
    console.log(arguments);
    pubnub_config = str;
    initPubNub();
}

function initPubNub(){

    pubnub = new PubNub({
        publishKey : pubnub_config[0].toString(),
        subscribeKey : pubnub_config[1].toString(),
        ssl: true
    });

}

function Color() {
    this.r = 65;
    this.g = 109;
    this.b = 181;
}

function Text() {
    this.explode = function(){
        console.log("asdfasdf");
    }
}

function Control() {
    var publishConfig = {
        channel : "habitual_instinct_control",
    };

    this.randomize = false;

    this.reset_serial_ports = (function(){
        console.log("reset_serial_ports");
        publishConfig.message = {
            message : "reset_serial_ports"
        };
    });

    // this.close_ports = (function(){
    //     console.log("close_ports");
    // });

    // this.init_ports = (function(){
    //     console.log("init_ports");
    // });

    this.start = function(){
        console.log("start");
        console.log(arguments);

        publishConfig.message = {
            message : "start"
        };

        this.publish();
    }

    this.stop = function(){
        console.log("stop");

        publishConfig.message = {
            message : "stop"
        };

        this.publish();
    }

    this.sweep = function(){
        console.log("sweep");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep"
        };

        this.publish();
    }

    this.sweep_react = function(){
        console.log("sweep_react");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep_react"
        };

        this.publish();
    }

    this.sweep_react_pause = function(){
        console.log("sweep_react_pause");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep_react_pause"
        };

        this.publish();
    }

    this.noise = function(){
        console.log("noise");
        console.log(arguments);

        publishConfig.message = {
            message : "noise"
        };

        this.publish();
    }

    this.noise_react = function(){
        console.log("noise_react");
        console.log(arguments);

        publishConfig.message = {
            message : "noise_react"
        };

        this.publish();
    }

    this.pattern_wave_small_v2 = function(){
        console.log("pattern_wave_small_v2");
        console.log(arguments);

        publishConfig.message = {
            message : "pattern_wave_small_v2"
        };

        this.publish();
    }

    this.measure = function(){
        console.log("measure");
        console.log(arguments);

        publishConfig.message = {
            message : "measure"
        };

        this.publish();
    }

    this.measure_react = function(){
        console.log("measure_react");
        console.log(arguments);

        publishConfig.message = {
            message : "measure_react"
        };

        this.publish();
    }

    this.reset = function(){
        console.log("reset");
        console.log(arguments);

        publishConfig.message = {
            message : "reset"
        };

        this.publish();
    }

    this.reset_with_pause = function(){
        console.log("reset_with_pause");
        console.log(arguments);

        publishConfig.message = {
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

        publishConfig.message = {
            message : "start__f0"
        };

        this.publish();
    }

    this.stop__f0 = function(){
        console.log("stop__f0");

        publishConfig.message = {
            message : "stop__f0"
        };

        this.publish();
    }

    this.sweep__f0 = function(){
        console.log("sweep__f0");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep__f0"
        };

        this.publish();
    }

    this.sweep_react__f0 = function(){
        console.log("sweep_react__f0");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep_react__f0"
        };

        this.publish();
    }

    this.sweep_react_pause__f0 = function(){
        console.log("sweep_react_pause__f0");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep_react_pause__f0"
        };

        this.publish();
    }

    this.noise__f0 = function(){
        console.log("noise__f0");
        console.log(arguments);

        publishConfig.message = {
            message : "noise__f0"
        };

        this.publish();
    }

    this.noise_react__f0 = function(){
        console.log("noise_react__f0");
        console.log(arguments);

        publishConfig.message = {
            message : "noise_react__f0"
        };

        this.publish();
    }

    this.pattern_wave_small_v2__f0 = function(){
        console.log("pattern_wave_small_v2__f0");
        console.log(arguments);

        publishConfig.message = {
            message : "pattern_wave_small_v2__f0"
        };

        this.publish();
    }

    this.measure__f0 = function(){
        console.log("measure__f0");
        console.log(arguments);

        publishConfig.message = {
            message : "measure__f0"
        };

        this.publish();
    }

    this.measure_react__f0 = function(){
        console.log("measure_react");
        console.log(arguments);

        publishConfig.message = {
            message : "measure_react__f0"
        };

        this.publish();
    }

    this.reset__f0 = function(){
        console.log("reset");
        console.log(arguments);

        publishConfig.message = {
            message : "reset__f0"
        };

        this.publish();
    }

    this.reset_with_pause__f0 = function(){
        console.log("reset_with_pause");
        console.log(arguments);

        publishConfig.message = {
            message : "reset_with_pause__f0"
        };

        this.publish();
    }


    // panel 2
    // ============================
    this.start__f1 = function(){
        console.log("start__f1");

        publishConfig.message = {
            message : "start__f1"
        };

        this.publish();
    }

    this.stop__f1 = function(){
        console.log("stop__f1");

        publishConfig.message = {
            message : "stop__f1"
        };

        this.publish();
    }

    this.sweep__f1 = function(){
        console.log("sweep__f1");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep__f1"
        };

        this.publish();
    }

    this.sweep_react__f1 = function(){
        console.log("sweep_react__f1");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep_react__f1"
        };

        this.publish();
    }

    this.sweep_react_pause__f1 = function(){
        console.log("sweep_react_pause__f1");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep_react_pause__f1"
        };

        this.publish();
    }

    this.noise__f1 = function(){
        console.log("noise__f1");
        console.log(arguments);

        publishConfig.message = {
            message : "noise__f1"
        };

        this.publish();
    }

    this.noise_react__f1 = function(){
        console.log("noise_react__f1");
        console.log(arguments);

        publishConfig.message = {
            message : "noise_react__f1"
        };

        this.publish();
    }

    this.pattern_wave_small_v2__f1 = function(){
        console.log("pattern_wave_small_v2__f1");
        console.log(arguments);

        publishConfig.message = {
            message : "pattern_wave_small_v2__f1"
        };

        this.publish();
    }

    this.measure__f1 = function(){
        console.log("measure__f1");
        console.log(arguments);

        publishConfig.message = {
            message : "measure__f1"
        };

        this.publish();
    }

    this.measure_react__f1 = function(){
        console.log("measure_react__f1");
        console.log(arguments);

        publishConfig.message = {
            message : "measure_react__f1"
        };

        this.publish();
    }

    this.reset__f1 = function(){
        console.log("reset");
        console.log(arguments);

        publishConfig.message = {
            message : "reset__f1"
        };

        this.publish();
    }

    this.reset_with_pause__f1 = function(){
        console.log("reset_with_pause");
        console.log(arguments);

        publishConfig.message = {
            message : "reset_with_pause__f1"
        };

        this.publish();
    }


    // panel 3
    // ==================
    this.start__f2 = function(){
        console.log("start__f2");

        publishConfig.message = {
            message : "start__f2"
        };

        this.publish();
    }

    this.stop__f2 = function(){
        console.log("stop__f2");

        publishConfig.message = {
            message : "stop__f2"
        };

        this.publish();
    }

    this.sweep__f2 = function(){
        console.log("sweep__f2");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep__f2"
        };

        this.publish();
    }

    this.sweep_react__f2 = function(){
        console.log("sweep_react__f2");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep_react__f2"
        };

        this.publish();
    }

    this.sweep_react_pause__f2 = function(){
        console.log("sweep_react_pause__f2");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep_react_pause__f2"
        };

        this.publish();
    }

    this.noise__f2 = function(){
        console.log("noise__f2");
        console.log(arguments);

        publishConfig.message = {
            message : "noise__f2"
        };

        this.publish();
    }

    this.noise_react__f2 = function(){
        console.log("noise_react__f2");
        console.log(arguments);

        publishConfig.message = {
            message : "noise_react__f2"
        };

        this.publish();
    }

    this.pattern_wave_small_v2__f2 = function(){
        console.log("pattern_wave_small_v2__f2");
        console.log(arguments);

        publishConfig.message = {
            message : "pattern_wave_small_v2__f2"
        };

        this.publish();
    }

    this.measure__f2 = function(){
        console.log("measure__f2");
        console.log(arguments);

        publishConfig.message = {
            message : "measure__f2"
        };

        this.publish();
    }

    this.measure_react__f2 = function(){
        console.log("measure_react__f2");
        console.log(arguments);

        publishConfig.message = {
            message : "measure_react__f2"
        };

        this.publish();
    }

    this.reset__f2 = function(){
        console.log("reset");
        console.log(arguments);

        publishConfig.message = {
            message : "reset__f2"
        };

        this.publish();
    }

    this.reset_with_pause__f2 = function(){
        console.log("reset_with_pause");
        console.log(arguments);

        publishConfig.message = {
            message : "reset_with_pause__f2"
        };

        this.publish();
    }


    // panel 4
    // ==================
    this.start__f3 = function(){
        console.log("start__f3");

        publishConfig.message = {
            message : "start__f3"
        };

        this.publish();
    }

    this.stop__f3 = function(){
        console.log("stop__f3");

        publishConfig.message = {
            message : "stop__f3"
        };

        this.publish();
    }

    this.sweep__f3 = function(){
        console.log("sweep__f3");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep__f3"
        };

        this.publish();
    }

    this.sweep_react__f3 = function(){
        console.log("sweep_react__f3");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep_react__f3"
        };

        this.publish();
    }

    this.sweep_react_pause__f3 = function(){
        console.log("sweep_react_pause__f3");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep_react_pause__f3"
        };

        this.publish();
    }

    this.noise__f3 = function(){
        console.log("noise__f3");
        console.log(arguments);

        publishConfig.message = {
            message : "noise__f3"
        };

        this.publish();
    }

    this.noise_react__f3 = function(){
        console.log("noise_react__f3");
        console.log(arguments);

        publishConfig.message = {
            message : "noise_react__f3"
        };

        this.publish();
    }

    this.pattern_wave_small_v2__f3 = function(){
        console.log("pattern_wave_small_v2__f3");
        console.log(arguments);

        publishConfig.message = {
            message : "pattern_wave_small_v2__f3"
        };

        this.publish();
    }

    this.measure__f3 = function(){
        console.log("measure__f3");
        console.log(arguments);

        publishConfig.message = {
            message : "measure__f3"
        };

        this.publish();
    }

    this.measure_react__f3 = function(){
        console.log("measure_react__f3");
        console.log(arguments);

        publishConfig.message = {
            message : "measure_react__f3"
        };

        this.publish();
    }

    this.reset__f3 = function(){
        console.log("reset");
        console.log(arguments);

        publishConfig.message = {
            message : "reset__f3"
        };

        this.publish();
    }

    this.reset_with_pause__f3 = function(){
        console.log("reset_with_pause");
        console.log(arguments);

        publishConfig.message = {
            message : "reset_with_pause__f3"
        };

        this.publish();
    }

    this.publish = function(){
        pubnub.publish(publishConfig, function(status, response) {
            console.log(status, response);
        });
    }
}
