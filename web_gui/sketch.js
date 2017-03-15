var colors;
var texts;
var controls;

var pubnub;
var pubnub_config;
var pub;
var sub;

function preload() {

    loadStrings('pubnub_config.txt', testFunction);
}

// var FizzyText = function() {
//     this.message = 'dat.gui';
//     this.speed = 0.8;
//     this.displayOutline = false;
//     this.explode = function() { 
//         console.log("something here");
//     };
// };

// var FizzyText = function() {
//   this.message = 'dat.gui';
//   this.speed = 0.8;
//   this.displayOutline = false;
//   this.explode = function() { ... };
//   // Define render logic ...
// };

// window.onload = function() {
//   var text = new FizzyText();
//   var gui = new dat.GUI();
//   gui.add(text, 'message');
//   gui.add(text, 'speed', -5, 5);
//   gui.add(text, 'displayOutline');
//   gui.add(text, 'explode');
// };


function setup() { 
    createCanvas(400, 400);

    colors = new Color();
    texts = new Text();
    controls = new Control();
    var gui = new dat.GUI({width:520});
    // gui.add(colors, 'g', 0, 255);
    // gui.add(texts, 'explode');

    var f0 = gui.addFolder("Global");
    f0.add(controls, 'start');
    f0.add(controls, 'stop');
    f0.add(controls, 'wave');
    f0.add(controls, 'sweep');
    f0.add(controls, 'sweepinteract');
    f0.add(controls, 'noise');
    f0.add(controls, 'noiseinteract');

    var f1 = gui.addFolder("Arduino One");
    f1.add(colors, 'g', 0, 255);
    f1.add(texts, 'explode');

    f1.add(controls, 'start' + '_f1');
    f1.add(controls, 'stop' + '_f1');
    f1.add(controls, 'wave' + '_f1');
    f1.add(controls, 'sweep' + '_f1');
    f1.add(controls, 'sweepinteract' + '_f1');
    f1.add(controls, 'noise' + '_f1');
    f1.add(controls, 'noiseinteract' + '_f1');

    var f2 = gui.addFolder("Arduino Two");
    f2.add(colors, 'g', 0, 255);
    f2.add(texts, 'explode');

    var f3 = gui.addFolder("Arduino Three");
    var f4 = gui.addFolder("Arduino Four");

    f0.open();

} 

function draw() { 
    background(colors.r, colors.g, colors.b);
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
    this.r = 255;
    this.g = 100;
    this.b = 255;
}

function Text() {
    this.explode = function(){
        console.log("asdfasdf");
    }
}

function Control() {
    var publishConfig = {
        channel : "habitual_instinct_control"
    };

    this.start = function(){
        console.log("start");
        console.log(arguments);

        publishConfig.message = {
            message : "start"
        };

        this.publish();
    }

    this.start_f1 = function(){
        console.log("start_f1");

        publishConfig.message = {
            message : "start_f1"
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

    this.stop_f1 = function(){
        console.log("stop_f1");

        publishConfig.message = {
            message : "stop_f1"
        };

        this.publish();
    }

    this.wave = function(){
        console.log("wave");

        publishConfig.message = {
            message : "wave"
        };

        this.publish();
    }

    this.wave_f1 = function(){
        console.log("wave_f1");

        publishConfig.message = {
            message : "wave_f1"
        };

        this.publish();
    }

    this.sweep = function(){
        console.log("sweep");

        publishConfig.message = {
            message : "sweep"
        };

        this.publish();
    }

    this.sweep_f1 = function(){
        console.log("sweep_f1");

        publishConfig.message = {
            message : "sweep_f1"
        };

        this.publish();
    }

    this.sweepinteract = function(){
        console.log("sweepinteract");

        publishConfig.message = {
            message : "sweepinteract"
        };

        this.publish();
    }

    this.sweepinteract_f1 = function(){
        console.log("sweepinteract_f1");

        publishConfig.message = {
            message : "sweepinteract_f1"
        };

        this.publish();
    }

    this.noise = function(){
        console.log("noise");

        publishConfig.message = {
            message : "noise"
        };

        this.publish();
    }

    this.noise_f1 = function(){
        console.log("noise_f1");

        publishConfig.message = {
            message : "noise_f1"
        };

        this.publish();
    }

    this.noiseinteract = function(){
        console.log("noiseinteract");

        publishConfig.message = {
            message : "noiseinteract"
        };

        this.publish();
    }

    this.noiseinteract_f1 = function(){
        console.log("noiseinteract");

        publishConfig.message = {
            message : "noiseinteract_f1"
        };

        this.publish();
    }

    this.publish = function(){
        pubnub.publish(publishConfig, function(status, response) {
            console.log(status, response);
        });
    }
}
