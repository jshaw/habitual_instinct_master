var colors;
var texts;
var controls;

var pubnub;
var pubnub_config;
var pub;
var sub;

function preload() {

    loadStrings('../pubnub_config.txt', testFunction);
}

function setup() { 
    createCanvas(400, 400);

    colors = new Color();
    texts = new Text();
    controls = new Control();
    var gui = new dat.GUI({width:520});


    // TODO
    // Write this so it's not redundent... 
    // loop through folder and folder items 
    var f = gui.addFolder("Ransomize");
    f.add(controls, 'randomize');

    var f0 = gui.addFolder("Global");
    // f0.add(controls, 'randomize');
    f0.add(controls, 'start');
    f0.add(controls, 'stop');
    f0.add(controls, 'next');
    f0.add(controls, 'previous');
    f0.add(controls, 'configure');
    f0.add(controls, 'sweep');
    f0.add(controls, 'sweep_react');
    f0.add(controls, 'sweep_react_pause');
    f0.add(controls, 'noise');
    f0.add(controls, 'noise_react');
    f0.add(controls, 'pattern_wave_small_v2');
    f0.add(controls, 'reset');
    f0.add(controls, 'reset_with_pause');

    // Commented out for reference
    // perhaps latter
    // f0.add(controls, 'wave');
    // f0.add(controls, 'sweep');
    // f0.add(controls, 'sweepinteract');
    // f0.add(controls, 'noise');
    // f0.add(controls, 'noiseinteract');

    var f1 = gui.addFolder("Arduino One");

    f1.add(controls, 'start' + '__f0');
    f1.add(controls, 'stop' + '__f0');
    f1.add(controls, 'measure' + '__f0');
    f1.add(controls, 'measure_react' + '__f0');
    f1.add(controls, 'sweep' + '__f0');
    f1.add(controls, 'sweep_react' + '__f0');
    f1.add(controls, 'noise' + '__f0');
    f1.add(controls, 'noise_react' + '__f0');
    f1.add(controls, 'pattern_wave_small_v2' + '__f0');
    f1.add(controls, 'reset' + '__f0');
    f1.add(controls, 'reset_with_pause' + '__f0');

    var f2 = gui.addFolder("Arduino Two");
    
    f2.add(controls, 'start' + '__f1');
    f2.add(controls, 'stop' + '__f1');
    f2.add(controls, 'sweep' + '__f1');
    f2.add(controls, 'sweep_react' + '__f1');
    f2.add(controls, 'noise' + '__f1');
    f2.add(controls, 'noise_react' + '__f1');
    f2.add(controls, 'pattern_wave_small_v2' + '__f1');
    f2.add(controls, 'reset' + '__f1');
    f2.add(controls, 'reset_with_pause' + '__f1');

    var f3 = gui.addFolder("Arduino Three");
    
    f3.add(controls, 'start' + '__f2');
    f3.add(controls, 'stop' + '__f2');
    f3.add(controls, 'sweep' + '__f2');
    f3.add(controls, 'sweep_react' + '__f2');
    f3.add(controls, 'noise' + '__f2');
    f3.add(controls, 'noise_react' + '__f2');
    f3.add(controls, 'pattern_wave_small_v2' + '__f2');
    f3.add(controls, 'reset' + '__f2');
    f3.add(controls, 'reset_with_pause' + '__f2');

    var f4 = gui.addFolder("Arduino Four");
    
    f4.add(controls, 'start' + '__f3');
    f4.add(controls, 'stop' + '__f3');
    f4.add(controls, 'sweep' + '__f3');
    f4.add(controls, 'sweep_react' + '__f3');
    f4.add(controls, 'noise' + '__f3');
    f4.add(controls, 'noise_react' + '__f3');
    f3.add(controls, 'pattern_wave_small_v2' + '__f3');
    f4.add(controls, 'reset' + '__f3');
    f4.add(controls, 'reset_with_pause' + '__f3');

    f.open();
    f1.open();

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

var function_control_list = ['sweep', 'sweep_react', 'sweep_react_pause', 'noise', 'noise_react', 'pattern_wave_small_v2'];


function draw() { 
    background(colors.r, colors.g, colors.b);

    random_mode = controls.randomize;
    console.log("random_mode: ", random_mode);

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



    // if ((millis() - lastAutoRest) > randomize_last_autoreset) {
    //     millis_mode_timer = millis();

    //     if(randomize_last_autoreset == randomize_interval){
    //         lastAutoRestDelay = lastAutoRestDelayLong;
    //         // random select some global mode from array
    //         var tmp_random_val = random(1,4);
    //         buttonPushCounter  = tmp_random_val;
    //     } else if(randomize_last_autoreset == randomize_pause_interval){
    //         lastAutoRestDelay = lastAutoRestDelayShort;
    //         // pause the installation
    //         controls.stop();
            

    //     }
    // }

    



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

    this.next = function(){
        console.log("next");
        console.log(arguments);

        publishConfig.message = {
            message : "next"
        };

        this.publish();
    }

    this.previous = function(){
        console.log("previous");
        console.log(arguments);

        publishConfig.message = {
            message : "previous"
        };

        this.publish();
    }

    this.configure = function(){
        console.log("configure");
        console.log(arguments);

        publishConfig.message = {
            message : "configure"
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

    // this.configure = function(){
    //     console.log("configure");
    //     console.log(arguments);

    //     publishConfig.message = {
    //         message : "configure"
    //     };

    //     this.publish();
    // }

    this.sweep__f0 = function(){
        console.log("sweep__f0");
        console.log(arguments);

        publishConfig.message = {
            message : "sweep__f0"
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
