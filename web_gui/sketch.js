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
    f0.add(controls, 'randomize');
    f0.add(controls, 'start');
    f0.add(controls, 'stop');
    // f0.add(controls, 'wave');
    // f0.add(controls, 'sweep');
    // f0.add(controls, 'sweepinteract');
    // f0.add(controls, 'noise');
    // f0.add(controls, 'noiseinteract');
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

    var f1 = gui.addFolder("Arduino One");
    // f0.add(colors, 'g', 0, 255);
    // f0.add(texts, 'explode');

    f1.add(controls, 'start' + '_f0');
    f1.add(controls, 'stop' + '_f0');
    f1.add(controls, 'wave' + '_f0');
    f1.add(controls, 'sweep' + '_f0');
    f1.add(controls, 'sweepinteract' + '_f0');
    f1.add(controls, 'noise' + '_f0');
    f1.add(controls, 'noiseinteract' + '_f0');

    var f2 = gui.addFolder("Arduino Two");
    // f2.add(colors, 'g', 0, 255);
    // f2.add(texts, 'explode');

    f2.add(controls, 'start' + '_f1');
    f2.add(controls, 'stop' + '_f1');
    f2.add(controls, 'wave' + '_f1');
    f2.add(controls, 'sweep' + '_f1');
    f2.add(controls, 'sweepinteract' + '_f1');
    f2.add(controls, 'noise' + '_f1');
    f2.add(controls, 'noiseinteract' + '_f1');

    var f3 = gui.addFolder("Arduino Three");
    f3.add(controls, 'start' + '_f2');
    f3.add(controls, 'stop' + '_f2');
    f3.add(controls, 'wave' + '_f2');
    f3.add(controls, 'sweep' + '_f2');
    f3.add(controls, 'sweepinteract' + '_f2');
    f3.add(controls, 'noise' + '_f2');
    f3.add(controls, 'noiseinteract' + '_f2');

    var f4 = gui.addFolder("Arduino Four");
    f4.add(controls, 'start' + '_f3');
    f4.add(controls, 'stop' + '_f3');
    f4.add(controls, 'wave' + '_f3');
    f4.add(controls, 'sweep' + '_f3');
    f4.add(controls, 'sweepinteract' + '_f3');
    f4.add(controls, 'noise' + '_f3');
    f4.add(controls, 'noiseinteract' + '_f3');


    f0.open();
    // f1.open();

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
            message : "start",
            randomize: this.randomize
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
    // ========================
    // ========================
    // ========================
    // ========================
    // ========================

    // need to refactor after here

    this.start_f0 = function(){
        console.log("start_f0");

        publishConfig.message = {
            message : "start_f0"
        };

        this.publish();
    }

    this.start_f1 = function(){

        publishConfig.message = {
            message : "start_f1"
        };

        this.publish();
    }

    this.start_f2 = function(){

        publishConfig.message = {
            message : "start_f2"
        };

        this.publish();
    }

    this.start_f3 = function(){

        publishConfig.message = {
            message : "start_f3"
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

    this.stop_f0 = function(){
        console.log("stop_f0");

        publishConfig.message = {
            message : "stop_f0"
        };

        this.publish();
    }

    this.stop_f1 = function(){

        publishConfig.message = {
            message : "stop_f1"
        };

        this.publish();
    }

    this.stop_f2 = function(){

        publishConfig.message = {
            message : "stop_f2"
        };

        this.publish();
    }

    this.stop_f3 = function(){

        publishConfig.message = {
            message : "stop_f3"
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

    this.wave_f0 = function(){
        console.log("wave_f0");

        publishConfig.message = {
            message : "wave_f0"
        };

        this.publish();
    }

    this.wave_f1 = function(){

        publishConfig.message = {
            message : "wave_f1"
        };

        this.publish();
    }

    this.wave_f2 = function(){

        publishConfig.message = {
            message : "wave_f2"
        };

        this.publish();
    }

    this.wave_f3 = function(){

        publishConfig.message = {
            message : "wave_f3"
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

    this.sweep_f0 = function(){
        console.log("sweep_f0");

        publishConfig.message = {
            message : "sweep_f0"
        };

        this.publish();
    }

    this.sweep_f1 = function(){

        publishConfig.message = {
            message : "sweep_f1"
        };

        this.publish();
    }

    this.sweep_f2 = function(){

        publishConfig.message = {
            message : "sweep_f2"
        };

        this.publish();
    }

    this.sweep_f3 = function(){

        publishConfig.message = {
            message : "sweep_f3"
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

    this.sweepinteract_f0 = function(){
        console.log("sweepinteract_f0");

        publishConfig.message = {
            message : "sweepinteract_f0"
        };

        this.publish();
    }

    this.sweepinteract_f1 = function(){

        publishConfig.message = {
            message : "sweepinteract_f1"
        };

        this.publish();
    }

    this.sweepinteract_f2 = function(){

        publishConfig.message = {
            message : "sweepinteract_f2"
        };

        this.publish();
    }

    this.sweepinteract_f3 = function(){

        publishConfig.message = {
            message : "sweepinteract_f3"
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

    this.noise_f0 = function(){
        console.log("noise_f0");

        publishConfig.message = {
            message : "noise_f0"
        };

        this.publish();
    }
    
    this.noise_f1 = function(){

        publishConfig.message = {
            message : "noise_f1"
        };

        this.publish();
    }

    this.noise_f2 = function(){

        publishConfig.message = {
            message : "noise_f2"
        };

        this.publish();
    }

    this.noise_f3 = function(){

        publishConfig.message = {
            message : "noise_f3"
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

    this.noiseinteract_f0 = function(){
        console.log("noiseinteract");

        publishConfig.message = {
            message : "noiseinteract_f0"
        };

        this.publish();
    }

    this.noiseinteract_f1 = function(){

        publishConfig.message = {
            message : "noiseinteract_f1"
        };

        this.publish();
    }

    this.noiseinteract_f2 = function(){

        publishConfig.message = {
            message : "noiseinteract_f2"
        };

        this.publish();
    }

    this.noiseinteract_f3 = function(){

        publishConfig.message = {
            message : "noiseinteract_f3"
        };

        this.publish();
    }

    this.publish = function(){
        pubnub.publish(publishConfig, function(status, response) {
            console.log(status, response);
        });
    }
}
