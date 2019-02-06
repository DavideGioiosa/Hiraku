/* eslint no-unused-vars: 0 */
/* eslint no-console: 0 */
/* eslint no-undef: 0 */	

//Model
var font_gates = [];
var gates = [];
var font_gates2 = []; //lfo
var gates2 = [];  //lfo
var octave = new Array(24).fill(false);
var c = new AudioContext();
var player = new WebAudioFontPlayer();
var keys = "zsxdcvgbhnjmq2w3er5t6y7u";
var message = [];   //array struct note-freq-time
var tones = [];
var tonesExtended = [];
var keys_length = keys.length;
var pressed = [];
var duration = [];
var rec = false;
var alreadyRec = false;
var isPlaying = false;
var t_zero;
var totalTime;
var noteCount = 0;
var pauseNote = ["Pause"];    //to put always array in the message
var pauseFreq = [0];           //to put always array in the message
var noteClicked = [];
var noteClickedMidi = [];
var availableNote = new Array(24).fill(true);
var availableNoteMidi = new Array(88).fill(true);
var isSearchInputSelected = false;      //boolean to know if the user search is on focus

var noteGradeMap = [];  //map containing Note: Grade for the notes of the scale
var notesOfScale = [];

var blobRiffContainer = []; //array containing the link of all the audio blobs created from the riff received by the Users
var booleanFeedMarkovChain = false; //gives received online riffs to build Markov Chain //TODO: ADD BUTTON

//FIREBASE
var userName = "DavideKaraoko";    //default userName
var userSearched = ""; //TODO: set di te stesso?
var roomVal;  //db value, num of rooms in Firebase
var roomPath; //path of the current room you're in
var sendToGlobalDB = false;

var isLogged = false;

function setUsername(name) {
    //"use strict";
    userName = name;
}

var idUser = 1;
//isFirstFirebaseMessage
// to delate var indexSample = 0;

var previousNote = [];
var previousFreq = [];

var recordedMessage = {};  //bank registered messages
var tweetMessage = ["", "", "", ""]; //bank registered messages ready to be sended to Twitter

//change octave boolean
var octaveUP = false;
var octaveDOWN = false;

//release note when changing octave
var octaveWhereIAm = [];

//hashmap frequency-notes
var map = { 0: "Pause", 261.626: "C", 277.183: "C#", 293.665: "D", 311.127: "Eb", 329.628: "E", 349.228: "F", 369.994: "F#", 391.995: "G", 415.305: "Ab", 440: "A", 466.164: "Bb", 493.883: "B", 523.251: "C", 554.365: "C#", 587.33: "D", 622.254: "Eb", 659.255: "E", 698.456: "F", 739.989: "F#", 783.991: "G", 830.609: "Ab", 880: "A", 932.328: "Bb", 987.767: "B" };


//hashmap notes-index
var numberMap = { "C": 0, "C#": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11 };

//hashmap index-notes
var indexNoteMap = { 0: "C", 1: "C#", 2: "D", 3: "Eb", 4: "E", 5: "F", 6: "F#", 7: "G", 8: "Ab", 9: "A", 10: "Bb", 11: "B"};

//midiMap

var renderMidiMap = {60: "z", 61: "s", 62: "x", 63: "d", 64: "c", 65: "v", 66: "g", 67: "b", 68: "h", 69: "n", 70: "j", 71: "m", 72: "q", 73: "2", 74: "w", 75: "3", 76: "e", 77: "r", 78: "5", 79: "t", 80: "6", 81: "y", 82: "7", 83: "u"};

var renderMidiMap2 = {"z": 60, "s": 61, "x": 62, "d": 63, "c": 64, "v": 65, "g": 66, "b": 67, "h": 68, "n": 69, "j": 70, "m": 71, "q": 72, "2": 73, "w": 74, "3": 75, "e": 76, "r": 77, "5": 78, "t": 79, "6": 80, "y": 81, "7": 82, "u": 83};

var midiMap = {};

var midiMapInvert = {0: 15, 27.5: 21,  29.135: 22, 30.868: 23, 32.703: 24, 34.648: 25, 36.708: 26, 38.891: 27, 41.203: 28, 43.654: 29, 46.249: 30, 48.999: 31, 51.913: 32, 55: 33, 58.27: 34, 61.735: 35, 65.406: 36, 69.296: 37, 73.416: 38, 77.782: 39, 82.407: 40, 87.307: 41, 92.499: 42, 97.999: 43, 103.826: 44, 110: 45, 116.541: 46, 123.471: 47, 130.813: 48, 138.591: 49, 146.832: 50, 155.563: 51, 164.814: 52, 174.614: 53, 184.997: 54, 195.998: 55, 207.652: 56, 220: 57, 233.082: 58, 246.942: 59, 261.626: 60, 277.183: 61, 293.665: 62, 311.127: 63, 329.628: 64, 349.228: 65, 369.994: 66, 391.995: 67, 415.305: 68, 440: 69, 466.164: 70, 493.883: 71, 523.251: 72, 554.365: 73, 587.33: 74, 622.254: 75, 659.255: 76, 698.456: 77, 739.989: 78, 783.991: 79, 830.609: 80, 880: 81, 932.328: 82, 987.767: 83, 1046.502: 84, 1108.731: 85, 1174.659: 86, 1244.508: 87, 1318.51: 88, 1396.913: 89, 1479.978: 90, 1567.982: 91, 1661.219: 92, 1760: 93, 1864.655: 94, 1975.533: 95, 2093.005: 96, 2217.461: 97, 2349.318: 98, 2489.016: 99, 2637.02: 100, 2793.826: 101, 2959.955: 102, 3135.963: 103, 3322.438: 104, 3520: 105, 3729.31: 106, 3951.066: 107, 4186.009: 108};

var midiMap2 = {27.5: "A0", 29.135: "Bb0", 30.868: "B0", 32.703: "C1", 34.648: "C#1", 36.708: "D1", 38.891: "Eb1", 41.203: "E1", 43.654: "F1", 46.249: "F#1", 48.999: "G1", 51.913: "Ab1", 55: "A1", 58.27: "Bb1", 61.735: "B1", 65.406: "C2", 69.296: "C#2", 73.416: "D2", 77.782: "Eb2", 82.407: "E2", 87.307: "F2", 92.499: "F#2", 97.999: "G2", 103.826: "Ab2", 110: "A2", 116.541: "Bb2", 123.471: "B2", 130.813: "C3", 138.591: "C#3", 146.832: "D3", 155.563: "Eb3", 164.814: "E3", 174.614: "F3", 184.997: "F#3", 195.998: "G3", 207.652: "Ab3", 220: "A3", 233.082: "Bb3", 246.942: "B3", 261.626: "C4", 277.183: "C#4", 293.665: "D4", 311.127: "Eb4", 329.628: "E4", 349.228: "F4", 369.994: "F#4", 391.995: "G4", 415.305: "Ab4", 440: "A4", 466.164: "Bb4", 493.883: "B4", 523.251: "C5", 554.365: "C#5", 587.33: "D5", 622.254: "Eb5", 659.255: "E5", 698.456: "F5", 739.989: "F#5", 783.991: "G5", 830.609: "Ab5", 880: "A5", 932.328: "Bb5", 987.767: "B5", 1046.502: "C6", 1108.731: "C#6", 1174.659: "D6", 1244.508: "Eb6", 1318.51: "E6", 1396.913: "F6", 1479.978: "F#6", 1567.982: "G6", 1661.219: "Ab6", 1760: "A6", 1864.655: "Bb6", 1975.533: "B6", 2093.005: "C7", 2217.461: "C#7", 2349.318: "D7", 2489.016: "Eb7", 2637.02: "E7", 2793.826: "F7", 2959.955: "F#7", 3135.963: "G7", 3322.438: "Ab7", 3520: "A7", 3729.31: "Bb7", 3951.066: "B7", 4186.009: "C8"};

var midiMap3 = {"A0": 27.5, "Bb0": 29.135, "B0": 30.868, "C1": 32.703, "C#1": 34.648, "D1": 36.708, "Eb1": 38.891, "E1": 41.203, "F1": 43.654, "F#1":  46.249, "G1": 48.999, "Ab1": 51.913, "A1": 55, "Bb1": 58.27, "B1": 61.735, "C2": 65.406, "C#2": 69.296, "D2": 73.416, "Eb2": 77.782, "E2": 82.407, "F2": 87.307, "F#2": 92.499, "G2": 97.999, "Ab2": 103.826, "A2": 110, "Bb2": 116.541, "B2": 123.471, "C3": 130.813, "C#3": 138.591, "D3": 146.832, "Eb3": 155.563, "E3": 164.814, "F3": 174.614, "F#3": 184.997, "G3": 195.998, "Ab3": 207.652, "A3": 220, "Bb3": 233.082, "B3": 246.942, "C4": 261.626, "C#4": 277.183, "D4": 293.665, "Eb4": 311.127, "E4": 329.628, "F4": 349.228, "F#4": 369.994, "G4": 391.995, "Ab4": 415.305, "A4": 440, "Bb4": 466.164, "B4": 493.883, "C5": 523.251, "C#5": 554.365, "D5": 587.33, "Eb5": 622.254, "E5": 659.255, "F5": 698.456, "F#5": 739.989, "G5": 783.991, "Ab5": 830.609, "A5": 880, "Bb5": 932.328, "B5": 987.767, "C6": 1046.502, "C#6": 1108.731, "D6": 1174.659, "Eb6": 1244.508, "E6": 1318.51, "F6": 1396.913, "F#6": 1479.978, "G6": 1567.982, "Ab6": 1661.219, "A6": 1760, "Bb6": 1864.655, "B6": 1975.533, "C7": 2093.005, "C#7": 2217.461, "D7": 2349.318, "Eb7": 2489.016, "E7": 2637.02, "F7": 2793.826, "F#7": 2959.955, "G7": 3135.963, "Ab7": 3322.438, "A7": 3520, "Bb7": 3729.31, "B7": 3951.066, "C8": 4186.009, "Pause": 0};


var i; //per tutti gli indici

for(i = 21; i <= 108; i++) {midiMap[i] = Math.round((27.500*Math.pow(Math.pow(2,1/12),(i-21)))*1000)/1000;}
for(i = 0; i < keys_length; i++) {tones[i] = midiMap[i+60];} //riempimento di tones per evitare un ulteriore calcolo
for(i = 0; i < 88; i++) {tonesExtended[i] = midiMap[i+21];}  //riempimento di tonesExtended
for(i = 21; i < 60; i++) {renderMidiMap[i] = "l";}
for(i = 84; i <= 108; i++) {renderMidiMap[i] = "l";}



/*var notesMap = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B", ];
var numberMap = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
for(var i = 24; i <= 108; i++) {
  midiMap2[midiMap[i]] = notesMap[((i - 24) % 12)] + numberMap[(i-24) % 12];
  if(((i - 24) % 12) == 11) {
    for(var j = 0; j < numberMap.length; j++) {
        numberMap[j]++;
    } 
  }
}
midiMap2[midiMap[21]] = "A0";
midiMap2[midiMap[22]] = "Bb0";
midiMap2[midiMap[23]] = "B0";*/  //midiMap2 calculated with this function

//Default Tonality
var tonality = {note: "C", mode: "major"};    //TODO: da database

//metronome
var active = 0;
var newClock = false;
var booleanRedRec = false;
var time_signature = 4;  //TODO: da database
var denominator = 4; //da database
var bpm = 120; //da database
var bpm_at = 4; //da database (denominatore della nota scandita dal metronomo)
var beats_number = 4; //da database
var curr_sample = "null";
var selected = Array(time_signature*beats_number).fill(false);
var first_quarter = [];
var change_color = time_signature;
var red_bpm = false;
var red_clicked = false;
for(i = 0; i < beats_number; i++) {first_quarter[i] = (time_signature)*i;}

function createProgressBar() { //create squares in html progress
  for(var i = 0; i < selected.length; i++) {
    var div = document.createElement("div");
    document.querySelector(".progress").appendChild(div);
    div.className = "bpm";
  }
}

//Loop
var linkLoopList = [{"name": "90s Dance","link": "https://dl.dropboxusercontent.com/s/ewmokbtha279mre/vola.wav"},{"name": "Pop","link": "https://dl.dropboxusercontent.com/s/byl11d8m1bvqlkf/noone.wav"},{"name": "Jazz","link": "https://dl.dropboxusercontent.com/s/wymccuxzca3diso/takefive.wav"},{"name": "4 Chords","link": "https://dl.dropboxusercontent.com/s/cowgu1c487ymerq/4chord.wav"}]; //da database
var nameLoopClient = ["90s Dance", "Pop", "Jazz", "4 Chords"];
var selectedLinkLoop;
var duration_loop = (60/bpm)*(bpm_at/4)*(4/denominator)*1000*selected.length; //iniziale
var sourceLoop;
var bufLoop;
var isLooping = false;

function createLinkLoop() {
  for(var i = 0; i < linkLoopList.length; i++) {
    var div = document.createElement("div");
    document.querySelector(".loop-list").appendChild(div);
    div.className = "link-loop";
    div.setAttribute("index", i);
    div.setAttribute("link", linkLoopList[i].link);
    div.setAttribute("onclick", "if(check.checked) {check.checked = false; sourceLoop.stop(0); play(0); if(booleanPlayOnlineRiff == true) {audioMP3Cycle.pause(); audioMP3Cycle.currentTime = 0;}; isLooping = false; isLoopingMaster = false; selected.fill(false); newClock = true; render(); newClock = false; active = 0; updateBPM(-1);}; selectLoop(linkLoopList[" + i + "].link, " + i + ");");
    div.innerHTML = linkLoopList[i].name;
  }
}

//clearInterval(toClear) (forse da mettere in setAttribute, ma non credo)


//Sounds
var gatesSound = [];
var bufSound = []; //ogni buffer di uno strumento è un indice del vettore
var curr_sound = 0; //indice del suono corrente (impostato a -1 per il synth base)

var pianoMap = {path: "https://surikov.github.io/webaudiofontdata/sound/0000_Aspirin_sf2_file.js", name: "_tone_0000_Aspirin_sf2_file"};
var marimbaMap = {path: "https://surikov.github.io/webaudiofontdata/sound/0120_FluidR3_GM_sf2_file.js", name: "_tone_0120_FluidR3_GM_sf2_file"};
var organMap = {path: "https://surikov.github.io/webaudiofontdata/sound/0180_Chaos_sf2_file.js", name: "_tone_0180_Chaos_sf2_file"};
var guitarMap = {path: "https://surikov.github.io/webaudiofontdata/sound/0240_Aspirin_sf2_file.js", name: "_tone_0240_Aspirin_sf2_file"};
var stringMap = {path: "https://surikov.github.io/webaudiofontdata/sound/0490_FluidR3_GM_sf2_file.js", name: "_tone_0490_FluidR3_GM_sf2_file"};
var saxMap = {path: "https://surikov.github.io/webaudiofontdata/sound/0650_GeneralUserGS_sf2_file.js", name: "_tone_0650_GeneralUserGS_sf2_file"};
var squareMap = {path: "https://surikov.github.io/webaudiofontdata/sound/0800_SBLive_sf2.js", name: "_tone_0800_SBLive_sf2"};
var clapMap = {path: "https://surikov.github.io/webaudiofontdata/sound/1180_Aspirin_sf2_file.js", name: "_tone_1180_Aspirin_sf2_file"};
//una mappa per strumento

var soundList = [
    {"name": "Oscillator", "index": -1 },
    {"name": "Grand Piano", "index": 0 }, 
    {"name": "Marimba", "index": 1 },
    {"name": "Rock Organ", "index": 2 },
    {"name": "Acoustic Guitar", "index": 3 },
    {"name": "String Ensemble", "index": 4 },
    {"name": "Alto Sax", "index": 5 },
    {"name": "Square Synth", "index": 6 },
    {"name": "Build Up Clap", "index": 7},
];
var instrumentsAllMap = [pianoMap, marimbaMap, organMap, guitarMap, stringMap, saxMap, squareMap, clapMap];
//aggiungo ogni mappa di ogni strumento (in ordine di indice)

var elem = document.getElementById("myBar");   
var width = 0;
var setup = false;

function playPlayer(midi, instr, when, duration, dest, volume) {
				gatesSound[midi] = player.queueWaveTable(c, dest
					, instr, when, midi, duration, volume);
}

function frame() {
  if(Math.round(width) < 100){
      width = width + (100/instrumentsAllMap.length);
      elem.style.width = Math.round(width) + '%'; 
      elem.innerHTML = Math.round(width) * 1  + '%';
  }
  if(Math.round(width) >= 100) {
    document.querySelector("#overlay").style.display = "none";
    setup = true;
  }
}

function loadSound(map, buf, index) {
    player.loader.startLoad(c, map[index].path, map[index].name);
	  player.loader.waitLoad(function () {
		  buf[index] = window[map[index].name];
      console.log("loaded");
      frame();
    });
}

function loadAllSound() {
  document.querySelector("#overlay").style.display = "block";
  for(i = 0; i < instrumentsAllMap.length; i++) {
      loadSound(instrumentsAllMap, bufSound, i);
  }
}

function createLinkSound() {
  for(var i = 0; i < soundList.length; i++) {
    var div = document.createElement("div");
    document.querySelector(".sound-list").appendChild(div);
    div.className = "link-sound";
    div.setAttribute("index", soundList[i].index);
    div.setAttribute("onclick", "setSound(" + soundList[i].index + ");") 
  div.innerHTML = soundList[i].name;
  }
}


//-------------------------------------------------------------------------------------------//

//Function to do in background while the user is getting logged into the application
function setUp () {
    loadAllSound();

    createLinkLoop();

    createLinkSound();

    createProgressBar();
}



//add value octave in parameters
function getNoteFromFreq(f){
  return map[f];
}

function getNumberFromNote(n) {
  return numberMap[n];
}

function getCharFromMidi(n) {
  return renderMidiMap[n];
}

function getMidiFromChar(n) {
  return renderMidiMap2[n];
}

function getMidiFromFreq(n) {
  return midiMapInvert[n];
}

function getFreqFromMidi(n) {
  return midiMap[n];
}

function getNoteFromFreqMidi(n) {
  return midiMap2[n];
}

//Get Room value from db, needed to know how much rooms are there in the database   //TO DELATE
function getRoomVal () {
  firebase.database().ref('/RoomValue').once('value', function(snap){
        roomVal = snap.val();   
    });
}

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

checkMM.onchange = e => {
  if (checkMM.checked) {
    sendToGlobalDB = true;
  } else {
    sendToGlobalDB = false;
  }
};

//get text from User Search Bar and set the userSearched
//TODO: settare che quando è selezionata e sto scrivendo, la tastiera non deve suonare
function setSearchedUser() {
  userSearched = $('.name-input').val();
}

function setPathRoom(loginPath) {
  roomPath = loginPath;
}

//Updates the room value after a new room has been created
function updateRoomValue (val){
  var home = firebase.database().ref("/RoomValue");
  val = val+1;
  home.update({val});
}


function setNotesOfScale (){
    var j = 0;
    for (i = numberMap[tonality.note]; i < numberMap[tonality.note] + 12; i++){
        if(availableNote[i] == true){
            notesOfScale[j] = indexNoteMap[i%12];
            j++;
        }
    }
}

function setGradesOfScale () {
    for(i = 0; i < notesOfScale.length; i++) {
        noteGradeMap[notesOfScale[i]] = i+1;
    } 
}


//click su barra di ricerca utente su Firebase
function focusInputText (){
    isSearchInputSelected = true;
}

//click fuori la barra di ricerca utente su Firebase
function blurInputText (){
    isSearchInputSelected = false;
}


//View
function renderOctave() {
  document.querySelector(".octave-up").classList.toggle("on-octave", octaveUP);
  document.querySelector(".octave-down").classList.toggle("on-octave", octaveDOWN);
}

function renderCircle(circle) {
    circle.classList.toggle("clicked", octave[Number(circle.getAttribute("circle-number"))]);
}

function renderAvailableNote(circle) {
    circle.classList.toggle("grey-note", !availableNote[Number(circle.getAttribute("circle-number"))]);     
}

function renderRec(button) {
  if(red_clicked || booleanRedRec) {button.classList.toggle("square-rec-clicked", red_clicked);}
}

function renderBPM(bpm, index) {
  if(index == active && selected[active]) {
    newClock = false;
  }
  bpm.classList.toggle("active-bpm", (index == active && selected[active]) && !red_bpm);
  bpm.classList.toggle("active-bpm-rec", (index == active && selected[active]) && red_bpm);
}

function renderLoop() {
  assignTonality();
  $("div").remove(".bpm");
  createProgressBar();
  tempo = bpm;
  document.getElementById('showTempo').innerText = tempo;
}

function render() {
  document.querySelectorAll(".circle").forEach(renderCircle);
  document.querySelectorAll(".circle").forEach(renderAvailableNote);
  if(newClock) {document.querySelectorAll(".bpm").forEach(renderBPM);}
  renderRec(document.querySelector(".button-rec"));
}

    //----- CONTROLLER -----//
    function changeStyle(selector, prop, value) {   //to change a property of css
      var style = document.styleSheets[0].cssRules || document.styleSheets[0].rules;
      for (var i = 0; i < style.length; i++) {
        if (style[i].selectorText == selector) {
          style[i].style[prop] = value;
        }
      }
    }


    function attack(freq, destination, attackTime) {
      if(font_gates[freq]!=null || gates[freq]!=null || font_gates2[freq]!=null || gates2[freq]!=null) {
        return;
      }
      var o = c.createOscillator();
      var g = c.createGain();
      o.connect(g);
      g.connect(destination);
      o.frequency.value = freq;
      g.gain.value = 0;

      //lfo
      var lfo = c.createOscillator();
      lfo.frequency.value = 3;
      lfo.type = "triangle";
      var gLfo = c.createGain();
      gLfo.gain.value = 0;
      lfo.connect(gLfo);


      gLfo.connect(g.gain); //lfo controls gain of the osc

      var now = c.currentTime;

      gLfo.gain.linearRampToValueAtTime(1,now+0.03+attackTime);
      g.gain.linearRampToValueAtTime(1,now+0.03+attackTime);

      lfo.start(0 + now + attackTime);
      o.start(0 + now + attackTime);
      font_gates[freq] = o;
      gates[freq] = g;
      font_gates2[freq] = lfo;
      gates2[freq] = gLfo;
    }

    function release(freq, releaseTime) {
      var now = c.currentTime;
      gates[freq].gain.linearRampToValueAtTime(0,now+0.03+releaseTime);
      gates2[freq].gain.linearRampToValueAtTime(0,now+0.03+releaseTime);
      font_gates[freq].stop(now + 0.03 + releaseTime); //ready for garbage collector
      font_gates2[freq].stop(now + 0.03 + releaseTime); //ready for garbage collector
      gates[freq] = null;
      gates2[freq] = null;
      font_gates[freq] = null;
      font_gates2[freq] = null;
    }

    function octaveChange(key) {
      if(key == "o" && octaveUP) {
        octaveUP = false;
        octaveDOWN = false;
      }
      else if(key == "o" && !octaveUP && !octaveDOWN) {
        octaveUP = false;
        octaveDOWN = true;
      }
      else if(key == "p" && octaveDOWN) {
        octaveUP = false;
        octaveDOWN = false;
      }
      else if(key == "p" && !octaveUP && !octaveDOWN) {
        octaveDOWN = false;
        octaveUP = true;
      }
      renderOctave();
    }

    function keyTouchPress(e,key) {
      if(isLogged && setup && !e.repeat && keys.includes(key) && noteClicked[key.charCodeAt(0)] == undefined && noteClickedMidi[getMidiFromChar(key)] == undefined && availableNote[keys.indexOf(key)] && !isSearchInputSelected) {
          noteCount++;
          noteClicked[key.charCodeAt(0)] = true;
          if(noteCount < 2) {
             document.querySelector(".sound-caption").style.pointerEvents = "none";
             document.querySelector(".sound-caption").style.backgroundColor = "#bcbcb6";
          }
          if(rec) {
            var tempNote = [];
            var tempFreq = [];

            //insertion of the pause
            if(noteCount < 2) {
              var pause = e.timeStamp - t_zero - totalTime;
              message.push({note: pauseNote, freq: pauseFreq, duration: pause});
              totalTime = totalTime + pause;
            }
            //NEW NOTE IS ADDED: save previous situation, one or more notes in an array, and added to the message array
            else {
              for(var i = 0; i < previousNote.length; i++) {
                tempNote[i] = getNoteFromFreq(tones[keys.indexOf(previousNote[i])]) + octaveWhereIAm[previousNote[i]];
                tempFreq[i] = previousFreq[i];
              }

              message.push({note: tempNote, freq: tempFreq, duration: e.timeStamp - t_zero - totalTime});
              totalTime = totalTime + e.timeStamp - t_zero - totalTime;
            }

            //empty array of previous situation
            tempNote = [];
            tempFreq = [];
          }

          if(octaveUP == true){
            if(keys.indexOf(key) < 12) {
              octaveWhereIAm[key] = "5";
            }
            else {
              octaveWhereIAm[key] = "6";
            }
            if(curr_sound == -1) {
              attack(tonesExtended[tonesExtended.indexOf(tones[keys.indexOf(key)])+12], c.destination, 0);
            }
            else {
              attackSound((getMidiFromChar(key)+12), curr_sound, c.destination, 0);
            }
            previousNote.push(key);
            previousFreq.push(tonesExtended[tonesExtended.indexOf(tones[keys.indexOf(key)])+12]);
          }

          else if (octaveDOWN == true){
            if(keys.indexOf(key) < 12) {
              octaveWhereIAm[key] = "3";
            }
            else {
              octaveWhereIAm[key] = "4";
            }
            if(curr_sound == -1) {
              attack(tonesExtended[tonesExtended.indexOf(tones[keys.indexOf(key)])-12], c.destination, 0);
            }
            else {
              attackSound((getMidiFromChar(key)-12), curr_sound, c.destination, 0);
            }
            previousNote.push(key);
            previousFreq.push(tonesExtended[tonesExtended.indexOf(tones[keys.indexOf(key)])-12]);
          }
          else {
            if(keys.indexOf(key) < 12) {
              octaveWhereIAm[key] = "4";
            }
            else {
              octaveWhereIAm[key] = "5";
            }
            if(curr_sound == -1) {
              attack(tones[keys.indexOf(key)], c.destination, 0);
            }
            else {
              attackSound(getMidiFromChar(key), curr_sound, c.destination, 0);
            }
            previousNote.push(key);
            previousFreq.push(tones[keys.indexOf(key)]);
          }

           octave[keys.indexOf(key)] = true;
           pressed[keys.indexOf(key)] = e.timeStamp;
           render();
        }
    }

    function midiPress(e, midiNote) {
      if(isLogged && setup && (midiNote >= 21 && midiNote <= 108) && noteClicked[getCharFromMidi(midiNote).charCodeAt(0)] == undefined && noteClickedMidi[midiNote] == undefined && availableNoteMidi[midiNote-21] && !isSearchInputSelected) {
          noteCount++;
          noteClickedMidi[midiNote] = true;
          if(noteCount < 2) {
             document.querySelector(".sound-caption").style.pointerEvents = "none";
             document.querySelector(".sound-caption").style.backgroundColor = "#bcbcb6";
          }
          if(rec) {
            var tempNote = [];
            var tempFreq = [];

            //insertion of the pause
            if(noteCount < 2) {
              var pause = e.timeStamp - t_zero - totalTime;
              message.push({note: pauseNote, freq: pauseFreq, duration: pause});
              totalTime = totalTime + pause;
            }
            //NEW NOTE IS ADDED: save previous situation, one or more notes in an array, and added to the message array
            else {
              for(var i = 0; i < previousNote.length; i++) {
                tempNote[i] = previousNote[i];
                tempFreq[i] = previousFreq[i];
              }

              message.push({note: tempNote, freq: tempFreq, duration: e.timeStamp - t_zero - totalTime});
              totalTime = totalTime + e.timeStamp - t_zero - totalTime;
            }

            //empty array of previous situation
            tempNote = [];
            tempFreq = [];
          }

          if(curr_sound == -1) {    
            attack(getFreqFromMidi(midiNote), c.destination, 0);
          }
          else {
            attackSound(midiNote, curr_sound, c.destination, 0);
          }
          previousNote.push(getNoteFromFreqMidi(getFreqFromMidi(midiNote)));
          previousFreq.push(getFreqFromMidi(midiNote));


          if(keys.includes(getCharFromMidi(midiNote))) {
            octave[keys.indexOf(getCharFromMidi(midiNote))] = true;
            pressed[keys.indexOf(getCharFromMidi(midiNote))] = e.timeStamp;
            render();
            }

        }
    }

    function keyTouchRelease(e, key) {
      if(!setup) {
        return;
      }
      octaveChange(key);
      if(keys.includes(key) && noteClicked[key.charCodeAt(0)] == true && !(noteClickedMidi[getMidiFromChar(key)] == true) && !isSearchInputSelected) {
         noteCount--;
         if(noteCount == 0) {
           document.querySelector(".sound-caption").removeAttribute("style");     
           noteClicked = [];
         }
         else {
           noteClicked[key.charCodeAt(0)] = undefined;
         }
         var noteFreq;
         if((octaveWhereIAm[key] == "6") || (octaveWhereIAm[key] == "5" && keys.indexOf(key) < 12)) {
            noteFreq = tonesExtended[tonesExtended.indexOf(tones[keys.indexOf(key)])+12];
            if(curr_sound == -1) {
              release(noteFreq, 0);  
            }
            else {
              releaseSound((getMidiFromChar(key))+12, curr_sound, 0);
            }
           }
         else if ((octaveWhereIAm[key] == "3") || (octaveWhereIAm[key] == "4" && keys.indexOf(key) >= 12)) {
            noteFreq = tonesExtended[tonesExtended.indexOf(tones[keys.indexOf(key)])-12];
            if(curr_sound == -1) {
              release(noteFreq, 0);  
            }
            else {
              releaseSound((getMidiFromChar(key))-12, curr_sound, 0);
            }
           }
         else {
            noteFreq = tones[keys.indexOf(key)]; 
            if(curr_sound == -1) {
              release(noteFreq, 0);  
            }
            else {
              releaseSound((getMidiFromChar(key)), curr_sound, 0);
            }
           }

        octave[keys.indexOf(key)] = false;
        duration[keys.indexOf(key)] = e.timeStamp - t_zero - totalTime;

        if(rec) {
          var tempNote = [];
          var tempFreq = [];

          //A NOTE IS RELEASED WHILE OTHER ARE PLAYING: save previous situation, one or more notes in an array, and added to the message array
          if(noteCount > 0) {
            for(var i = 0; i < previousNote.length; i++) {
              tempNote[i] = getNoteFromFreq(tones[keys.indexOf(previousNote[i])]) + octaveWhereIAm[previousNote[i]];
              tempFreq[i] = previousFreq[i];
            }

            message.push({note: tempNote, freq: tempFreq, duration: duration[keys.indexOf(key)]});    
            totalTime = totalTime + duration[keys.indexOf(key)];
          }
          //Note released and it was the only one playing
          else {
            var x = [];      //used to have an array also when you have 1 note
            var y = [];
            x[0] = getNoteFromFreq(tones[keys.indexOf(key)]) + octaveWhereIAm[key];
            y[0] = noteFreq;
            message.push({note: x , freq: y, duration: duration[keys.indexOf(key)]});
            totalTime = totalTime + duration[keys.indexOf(key)];
          }

          //empty array of previous situation
          tempNote = [];
          tempFreq = [];
        }

        //delete note that has been released from the array of previous situation
        //previousFreq used in prevNote to evitate ambiguos error with differts octaves
        previousNote.splice(previousFreq.indexOf(noteFreq), 1);
        previousFreq.splice(previousFreq.indexOf(noteFreq), 1);

        render();
      }
    }

    function midiRelease(e, midiNote) {
      if(isLogged && setup && (midiNote >= 21 && midiNote <= 108) && !(noteClicked[getCharFromMidi(midiNote).charCodeAt(0)] == true) && !isSearchInputSelected && (noteClickedMidi[midiNote] == true)) {
         noteCount--;
         if(noteCount == 0) {
           document.querySelector(".sound-caption").removeAttribute("style");     
           noteClickedMidi = [];
         }
         else {
           noteClickedMidi[midiNote] = undefined;
         }
         var noteFreq = getFreqFromMidi(midiNote);
         if(curr_sound == -1) {    
            release(noteFreq, 0);
          }
          else {
            releaseSound(midiNote, curr_sound, 0);
          }

        if(keys.includes(getCharFromMidi(midiNote))) {
            octave[keys.indexOf(getCharFromMidi(midiNote))] = false;
          }

        duration[midiNote+10] = e.timeStamp - t_zero - totalTime; //+10 per evitare ambiguità con le note su pc

        if(rec) {
          var tempNote = [];
          var tempFreq = [];

          //A NOTE IS RELEASED WHILE OTHER ARE PLAYING: save previous situation, one or more notes in an array, and added to the message array
          if(noteCount > 0) {
            for(var i = 0; i < previousNote.length; i++) {
              tempNote[i] = previousNote[i];
              tempFreq[i] = previousFreq[i];
            }

            message.push({note: tempNote, freq: tempFreq, duration: duration[midiNote+10]});    
            totalTime = totalTime + duration[midiNote+10];
          }
          //Note released and it was the only one playing
          else {
            var x = [];      //used to have an array also when you have 1 note
            var y = [];
            x[0] = getNoteFromFreqMidi(getFreqFromMidi(midiNote));
            y[0] = noteFreq;
            message.push({note: x , freq: y, duration: duration[midiNote+10]});
            totalTime = totalTime + duration[midiNote+10];
          }

          //empty array of previous situation
          tempNote = [];
          tempFreq = [];
        }

        //delete note that has been released from the array of previous situation
        //previousFreq used in prevNote to evitate ambiguos error with differts octaves
        previousNote.splice(previousFreq.indexOf(noteFreq), 1);
        previousFreq.splice(previousFreq.indexOf(noteFreq), 1);

        render();
      }
    }

    function touchEvent(e) {
      e.ontouchstart = function(e) {
        var key = e.target.getAttribute("char");
        keyTouchPress(e, key);
      };
      e.ontouchend = function(e) {
        var key = e.target.getAttribute("char");
        keyTouchRelease(e, key);
      };
    }

    document.onkeydown = function(e) {
      var key = e.key.toLowerCase();
      keyTouchPress(e, key);
    };

    document.onkeyup = function(e) {
      var key = e.key.toLowerCase();
      keyTouchRelease(e, key);
    };

    document.querySelectorAll(".circle").forEach(touchEvent);
    document.querySelector(".octave-up").onclick = function(e) {
      var key = e.target.getAttribute("char");
      keyTouchRelease(e, key);
    };
    document.querySelector(".octave-down").onclick = function(e) {
      var key = e.target.getAttribute("char");
      keyTouchRelease(e, key);
    };

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    var isLoopingMaster = false;
    var updateOneTimeClient = true;   //???


            function clock(snap) {  //color the relative .bpm
              selected.fill(false);
              if(snap == -1) {
                isLoopingMaster = false;
                newClock = true;
                render();
                newClock = false;
                active = 0;
                change_color = time_signature;
                return;
              }
              if(snap != undefined) {
                active = snap;
                change_color = snap % time_signature;
                if(change_color == 0) {change_color = time_signature};
              }
              selected[active] = true;

              if((isMaster && isLoopingMaster) || (!isMaster && updateOneTimeClient)) { //TODO: CHECK, UPDATE SOLO SE STA LOOPPANDO, non serve?
                  updateBPM (active);          //update of the current bpm of the loop on Firebase   
                        updateOneTimeClient = false;
                  check.disabled = false;
              }

              if(change_color >= time_signature) {   //change color every measure
                changeStyle('.active-bpm', 'background-color', '#' + Math.floor(Math.random()*16777215).toString(16));
                //change_color = 0;
                }
              //change_color++;
              newClock = true;
              render();
              //active = (active + 1) % selected.length;
              if(!isLoopingMaster) {
                      updateBPM(-1);  //evitare errori di concorrenza (DA CONTROLLARE!!!)
              }    
        }

function clockMaster() {
     selected.fill(false);
     selected[active] = true;
     if(change_color >= time_signature) {   //change color every measure
        changeStyle('.active-bpm', 'background-color', '#' + Math.floor(Math.random()*16777215).toString(16));
        change_color = 0;
     }
      change_color++;
      newClock = true;
      render();
      active = (active + 1) % selected.length;
}


var prevBankIndex = -1;      //TODO: CHECK, needed for the update of the riff of the same bank
var indexMod = "0";

var loopName = "null";
var prevLoopName = "null";
var prevDuration_loop = null;
var prevSelected_length = null;

    document.querySelector(".button-rec").onclick = async function(e) {

      if(!alreadyRec && !isLooping && isMaster && noteClicked.length == 0 && noteClickedMidi.length == 0) {
        prevLoopName = loopName;            //preservate change of the loop of the master during rec
        prevDuration_loop = duration_loop;
        prevSelected_length = selected.length;

        /*var check_corrector = false;
        if(check.disabled == false) {
          check.disabled = true;
          check_corrector = true;
        }
        document.querySelector(".loop-caption").style.pointerEvents = "none";
        document.querySelector(".loop-caption").style.backgroundColor = "#bcbcb6";*/
        t_zero = e.timeStamp;
        totalTime = 0;
        active = 0;
        alreadyRec = true;
        rec = true;
        red_bpm = true;
        red_clicked = true;
        message = []; // reset message
        clockMaster(); //for the first time without delay
        var time = prevDuration_loop/prevSelected_length; //da mettere in pratica poi
        var refreshIntervalId = setInterval(clockMaster, time); //repeat after 500ms for ever

        await sleep(prevDuration_loop);  


        rec = false;
        red_bpm = false;
        red_clicked = false;

        var index = getRadioButtonSelected();

        if(totalTime >= prevDuration_loop) {
            var daTogliere = totalTime - prevDuration_loop;
            while(daTogliere > 0) {
              if(message[message.length-1].duration > daTogliere) {
               message[message.length-1].duration = message[message.length-1].duration - daTogliere;
               daTogliere = 0;
           }
             else {
               daTogliere = daTogliere - message[message.length-1].duration;
               message.pop();
             }
            }
         }
         else {
           message.push({note: pauseNote, freq: pauseFreq, duration: prevDuration_loop-totalTime});
         }
        recordedMessage[index] = ({sequence: message, instrument: curr_sound}); //store message

          var promise_currLoopName = firebase.database().ref(roomPath + '/loop').once('value');
          promise_currLoopName.then (snap => {
                loopName = snap.val();

                if(prevLoopName == loopName){       //loop changed by the master  
                    if(index != prevBankIndex){
                        sendMessageToFirebase(index); //FIREBASE, TODO: send now or with a click??
                        prevBankIndex = -1;
                } else {
                        indexMod = index + indexMod;
                        sendMessageToFirebase(indexMod); 
                    }
                }

                modifyMessage(index);  //creates Tweet with the audio-text
                clearInterval(refreshIntervalId);  //to stop setInterval
                selected.fill(false);
                newClock = true;  //to remove the color on the bar
				booleanRedRec = true;
                render();
				booleanRedRec = false;
                newClock = false; //to restore the initial conditions
                active = 0;
                change_color = time_signature;  //to change the color of the .bpm

                /*if(check_corrector) {check.disabled = false;}
                document.querySelector(".loop-caption").removeAttribute("style");*/

                if(prevBankIndex == -1){
                    prevBankIndex = getRadioButtonSelected();
                    indexMod = "0";
                }
              
                alreadyRec = false;
        })      
      }

      else if(!alreadyRec && (isLooping || isLoopingMaster) && noteClicked.length == 0 && noteClickedMidi.length == 0) {

        prevLoopName = loopName;  
        prevDuration_loop = duration_loop;
        prevSelected_length = selected.length;
          
        /*check.disabled = true;
        document.querySelector(".loop-caption").style.pointerEvents = "none";
        document.querySelector(".loop-caption").style.backgroundColor = "#bcbcb6";*/
        totalTime = 0;
        alreadyRec = true;
        red_clicked = true;
        render();

        //guardare l'altro metronomo
        while(selected[0] != true) {        //prima 1
          await sleep(15);
          if(active == 0) {        //prima 1
            red_bpm = true; //per evitare ritardo grafico del primo step
          }
        } 
        console.log("start rec")
        t_zero = performance.now();
        rec = true;
        message = []; // reset message
        var timePass = 0;
        var atLeastOneTime = false; //per farlo ciclare almeno una volta
        while(timePass < prevDuration_loop) {
          await sleep(15);
          timePass = timePass + 15;
          if(!atLeastOneTime && active > 0) {       //TO CHECK: prima era current16 > 1
            atLeastOneTime = true;
          }
          else if(active == 0 && atLeastOneTime) {  //TO CHECK: prima era current16 == 1
              red_bpm = false; //per evitare ritardo grafico del primo step
              red_clicked = false;
              //break;  //deve registrare di più
            }
        }
        console.log("end rec")
        rec = false;

        index = getRadioButtonSelected(); 

        if(totalTime >= prevDuration_loop) {
            var daTogliere = totalTime - prevDuration_loop;
            while(daTogliere > 0) {
              if(message[message.length-1].duration > daTogliere) {
               message[message.length-1].duration = message[message.length-1].duration - daTogliere;
               daTogliere = 0;
           }
             else {
               daTogliere = daTogliere - message[message.length-1].duration;
               message.pop();
             }
            }
         }
         else {
           message.push({note: pauseNote, freq: pauseFreq, duration: prevDuration_loop-totalTime});
         }
          
        recordedMessage[index] = ({sequence: message, instrument: curr_sound}); //store message
          
        var promise_currLoopName = firebase.database().ref(roomPath + '/loop').once('value');
          promise_currLoopName.then (snap => {
                loopName = snap.val();
                            
                if(prevLoopName == loopName){       //loop changed by the master                
                    if(index != prevBankIndex){
                        sendMessageToFirebase(index); //FIREBASE, TODO: send now or with a click??
                        prevBankIndex = -1;
                    } else {                    
                        indexMod = index + indexMod;
                        sendMessageToFirebase(indexMod); 
                    }  
                }

                modifyMessage(index);  //creates Tweet with the audio-text

                /*check.disabled = false;
                document.querySelector(".loop-caption").removeAttribute("style");*/

               if(prevBankIndex == -1){
                    prevBankIndex = getRadioButtonSelected();
                    indexMod = "0";
               }
              
               red_bpm = false; //per evitare ritardo grafico del primo step
               red_clicked = false;
               //selected.fill(false);
               //newClock = true;  //to remove the color on the bar
			   booleanRedRec = true;
               render();
			   booleanRedRec = false;
               //newClock = false; //to restore the initial conditions
               alreadyRec = false;
        })
      }
    };


//play Music Messages
async function playMessage(mm, strum, destination) {                //Also plays full message

  if(!alreadyRec && !isPlaying && mm != undefined) {
      
    successNotification("Playing message", 'glyphicon glyphicon-volume-up');  
      
    isPlaying = true;  
    var messageSelected = mm.sequence; //message selected from the bank
    var sound = mm.instrument;
    var max = messageSelected.length;
    var timePass = 0;  



    if(strum != null) {     //messaggio unico, TO CHECK
      for(var i = 0; i < max; i++) {
            for(var j = 0; j < messageSelected[i].freq.length; j++){
              if(strum[i] == -1){
                attack(messageSelected[i].freq[j], destination, timePass);
              }
              else
                attackSound(getMidiFromFreq(messageSelected[i].freq[j]), strum[i], destination, timePass);
              }

        // await sleep(messageSelected[i].duration);

          timePass = timePass + Number(messageSelected[i].duration)/1000; //update with the duration of the note played


             for(j = 0; j < messageSelected[i].freq.length; j++){ 
               if(strum[i] == -1) {
                   release(messageSelected[i].freq[j], timePass);
               }
               else
                   releaseSound(getMidiFromFreq(messageSelected[i].freq[j]), strum[i], timePass);
                }
          }   
    }

    else {
      if(sound == -1){   //synth sound
          for(var i = 0; i < max; i++) {
            for(var j = 0; j < messageSelected[i].freq.length; j++){
               attack(messageSelected[i].freq[j], destination, timePass); 
              }

          //await sleep(messageSelected[i].duration);           //OBSELETO  
          timePass = timePass + Number(messageSelected[i].duration)/1000; //update with the duration of the note played
        
           for(j = 0; j < messageSelected[i].freq.length; j++){  
                 release(messageSelected[i].freq[j], timePass);
               }
          } 
      }
      else { //instrument sound

          console.log("SUONO");
          for(i = 0; i < max; i++) {
            for(j = 0; j < messageSelected[i].freq.length; j++){      
               attackSound(getMidiFromFreq(messageSelected[i].freq[j]), sound, destination, timePass); 
              }

          timePass = timePass + Number(messageSelected[i].duration)/1000; //update with the duration of the note played
          console.log(timePass)
          for(j = 0; j < messageSelected[i].freq.length; j++){  
                releaseSound(getMidiFromFreq(messageSelected[i].freq[j]), sound, timePass);
               }
          }
      }
    }
    isPlaying = false;  
  } else{
      warningNotification("Selected null message")
  }
}



function playLocalMessage () {
    playMessage(recordedMessage[getRadioButtonSelected()], null, c.destination);
}


    //-------------- SEND MESSAGE ------------------//

    //TODO: CHECK ALTERNATIVE TO floor, ex truncate, NOW: FIRST SIX DECIMALS 
    //TODO: ADD ID TO GET THE MESSAGE


    //SEND TO FIREBASE
    //riff.on('value', sendMessageToFirebase); send riff @GLOBAL
    //parametro data??
    function sendMessageToFirebase (index) {
      var correctIndex = Number(('' + index)[0]);
      var messageSelected = recordedMessage[correctIndex].sequence;
      var sound = recordedMessage[correctIndex].instrument;
      var max = messageSelected.length;
      var musicMessage = "";
      var riffToSend;
      for(i=0; i < max; i++){
       // musicMessage = musicMessage + messageSelected[i].note + " " + Math.floor((messageSelected[i].duration)*1000)/1000000 + " ";

        musicMessage = musicMessage + messageSelected[i].note + " " + (messageSelected[i].duration) + " ";
      }  

      //path where you want to save your records: Global DB or Room DB
      if(sendToGlobalDB == true){    
        riffToSend = firebase.database().ref("/RiffCollection/" + userName + "/Riff" + correctIndex);
        instrumentToSend = firebase.database().ref("/RiffCollection/" + userName + "/Riff" + correctIndex);
      } else {
        riffToSend = firebase.database().ref(roomPath + "/RiffCollection/" + userName + "/RiffCollection/Riff" + correctIndex);
        instrumentToSend = firebase.database().ref(roomPath + "/RiffCollection/" + userName + "/RiffCollection/Riff" + correctIndex + "/instrument");

        firebase.database().ref(roomPath + '/RiffCollection/' + userName + '/status').set(index);   //index of the current riff sent on Firebase, modded if the same of the prev
      }  

      var dataRiff = {
          sequence : musicMessage,
          instrument : sound,
          pro: procheck.checked,
      };

      riffToSend.set(dataRiff); //write on firebase the sequence and the instrument


      //console.log(userName + " sending message to Firebase..");  
      successNotification("Musical message sent to the database", 'glyphicon glyphicon-send');      
    }


    //SEND TO TWITTER
    function modifyMessage (index) {
      if(recordedMessage[index] == undefined) {
        return;
      }
      var messageSelected = recordedMessage[index];
      var max = messageSelected.sequence.length;
      var tweet = "";
      var unionNotes = [];    
      var noteOctave;
      var note1;
      var oct1;

      var dur1;
      var counter = 0;
      var newLineCounter = 0;   
      var word;

      var MAX_LEN = 250;


      for(i=0; i < max; i++){
        //tweet = tweet + messageSelected.sequence[i].note + "%20" + Math.floor((messageSelected.sequence[i].duration)*1000)/1000000 + "%0D%0A";

         unionNotes = messageSelected.sequence[i].note.toString().split(',');  //to divide if multiple note

         singleNote = unionNotes[unionNotes.length - 1];

         noteOctave = singleNote.match(/[a-z#]+|[a-zb]+|[^a-z]+/gi);  //split Note, Octave
         note1 = noteOctave[0];
         oct1 = noteOctave[1];      

          if(note1 == "Pause"){
              note1 = "C"
              oct1 = "0"
          }

         dur1 = Math.floor((messageSelected.sequence[i].duration));

         while(dur1 > MAX_LEN){
             counter++;
             dur1 = Math.floor((messageSelected.sequence[i].duration)/(2*counter));
          }

         counter = 0;           //TODO in future: Add also instrument into the parameters

         //tweet = tweet + numberMap[note1] + oct1 + "%20" + dur1 + "%0D%0A"; 

         /* console.log("nota: " + numberMap[note1])
          console.log("durata: " + dur1 + " ottava :" + oct1)
          console.log(textForTwitterMessage[numberMap[note1]][dur1])
          */
          word = textForTwitterMessage[numberMap[note1]][dur1];


          if(textForTwitterMessage[numberMap[note1]][dur1] == undefined){
              word = textForTwitterMessage[numberMap[note1]][3]
          }
          if(newLineCounter == 0){
             word = word.replace(/^\w/, c => c.toUpperCase());
          }
          newLineCounter++;

          tweet = tweet + word + "%20";

          if(newLineCounter == 9){     //new line
              tweet = tweet + "%0D%0A";
              newLineCounter = 0;
          }

        //+ "%0D%0A"
      }
      tweet = tweet.replace(/#/g,"%23");
      //tweet = tweet + messageSelected.instrument + "%0D%0A" + "%23karaoko";
      tweet = tweet + "%0D%0A" + "%23hiraku" + " " + "%23" + roomPath.slice(1); 

      tweetMessage[index] = tweet;  

    document.querySelector(".resp-sharing-button__link").href =  "https://twitter.com/intent/tweet/?text=" + tweet + "&amp;url=";
    }

    //Set tonality limitations
    function assignTonality() {
       if(procheck.checked) {
        return;
      }
      availableNote.fill(false);
      availableNoteMidi.fill(false);
      var indexNote = getNumberFromNote(tonality.note);
      if(tonality.mode == "minor") {          //ricavare la relativa maggiore
        indexNote = (indexNote + 3) % 12;
      }
      for(var i = 0; i < 14; i++) {
        availableNote[indexNote] = true;
        //console.log(indexNote)
        if(i % 7 == 2 || i % 7 == 6) {   //in caso di semitono
          indexNote = (indexNote + 1) % 24;
        }
        else {
          indexNote = (indexNote + 2) % 24;  
        }
      }
      indexNote = (indexNote + 3) % 12;
      for(i = 0; i < 49; i++) {
        availableNoteMidi[indexNote] = true;
        if(i % 7 == 2 || i % 7 == 6) {
           indexNote = (indexNote + 1) % 84;
           }
        else {
          indexNote = (indexNote + 2) % 84;
        }
      }
      for(i = 0; i < 4; i++) {
        availableNoteMidi[84 + i] = availableNoteMidi[i];
      }
      setNotesOfScale();        //set scale of notes available depending on the tonality, starting from I grade
      setGradesOfScale();      //set note-grade map

      render();
    }


    //TO DELATE ??
    /*
    //Change of the bank record button selected
    document.querySelector(".custom-select").onclick = function() {
      //console.log("cambio");
      document.querySelector(".resp-sharing-button__link").href = "https://twitter.com/intent/tweet/?text=" + tweetMessage[getRadioButtonSelected ()] + "&amp;url=";
    };
    */


    /*Bank Records Selector*/

    var selected_record = 0;


    $(function() {

     $('.record-dropdown > .record-caption').on('click', function() {
       $(this).parent().toggleClass('open');
      });

     $('.record-dropdown > .record-list > .link-record').on('click', function() {
       $('.record-dropdown > .record-list > .link-record').removeClass('selected');
       $(this).addClass('selected').parent().parent().removeClass('open').children('.record-caption').text( $(this).text() );
      });

      $(document).on('keyup', function(evt) {
        if ( (evt.keyCode || evt.which) === 27 ) {
          $('.record-dropdown').removeClass('open');
        }
     });

      $(document).on('click', function(evt) {
       if ( $(evt.target).closest(".record-dropdown > .record-caption").length === 0 ) {
         $('.record-dropdown').removeClass('open');
        }
      });

    });

    function selectRecord(i) {
       selected_record = i;
       document.querySelector(".resp-sharing-button__link").href = "https://twitter.com/intent/tweet/?text=" + tweetMessage[getRadioButtonSelected ()] + "&amp;url=";		   
    }


    function getRadioButtonSelected () {
       return selected_record;  
    }


    /*Upload file, to delate after added Python Server*/

    var usersMessagesToTraslate = []; //messages received in Twitter Format, DA ELIMINARE ???




    /* ------------ RECEIVING MESSAGING INTERACTION PART ------------ */

    //SINGLE MESSAGE READY TO BE PLAYED
    var messageReceivedFromUsers = ["","","",""]; //TODO: modificare
    var firebaseMessagesToTraslate = []; //TODO: deve essere array di array


    //TODO: SPLIT TWITTER MESSAGES in "Note dur note dur note dur".. version
    //DA INSERIRE NELLO SCRIPT PYTHON PER SCRIVERE SU FIREBASE
    function createArrayUserStrings(usersText){
      //for(var k = 0; k<1; k++){
        //PRENDE 1 TWEET
        usersMessagesToTraslate.push(usersText.split(' #karaoko')[0]); //array of array of strings
        //usersText = usersText.split(' #karaoko')[1];
        console.log("QUAAA " + usersMessagesToTraslate);
        translateMessagesInPlayableFormat ();
      //}
    }


    //usersMessagesToTraslate ?, si può mettere uno generico per Firebase e twitter, tanto il formato è lo stesso, messaggio twitter è messo su firebase
    //TRANSLATE MESSAGE "Note dur note dur note dur".. in a playable format
    //TODO: CHECK
    function translateMessagesInPlayableFormat(indexSample) {
      //per ora è un messaggio, fare per ognuno così, o array di array..
      var userMessage = [];
      var splittedMesaggesNoteDur = firebaseMessagesToTraslate[indexSample].split(' '); //["note", "dur", "note"...], even index: notes; odd index: duration

      for(var i=0; i < splittedMesaggesNoteDur.length - 1; i=i+2){
        freqF = [];
        var notesSplitted = [];

        notesSplitted = splittedMesaggesNoteDur[i].split(',');

        for(var j = 0; j < notesSplitted.length; j++){
          freqF[j] = midiMap3[notesSplitted[j]]; //get NoteOct frequency
        }

        userMessage.push({freq: freqF, duration: splittedMesaggesNoteDur[i+1]*1000});
      }

      // messageReceivedFromUsers.push(userMessage)
       messageReceivedFromUsers[indexSample] = userMessage;

      //messageReceivedFromUsers[i]..
      //aggiustare, continua a pushare quindi ho l'elenco delle sequenze ogni volta che leggo
    }

    function loadFirebaseSample() {
      //receiveMessageFromFirebase (getRadioButtonSampleSelected()); //TODO: Delate

      var riffName = "Riff" + getRadioButtonSampleSelected();   

      instantGetMMfromFirebaseGLOBAL (userSearched, riffName)
    }


    /*PLAY SEQUENCE RECEIVED*/
    async function playFirebaseSampleMessage() {
       // var indexMMG = getRadioButtonSampleSelected(); TODO: FIX, FAR SUONARE QUELLO SELEZIONATO? Occhio che quando aggiungi un sample lo vai a mettere all'inizio, quindi ad un indice diverso
        var indexMMG = 0;
        playMessage(MMSequencesGLOBAL[indexMMG], null, c.destination);

        MMSequencesGLOBAL.splice(indexMMG, 1); //Remove of the message loaded and played, TODO: Lasciarlo?
    }


    /*Firebase samples radio button get index*/
    function getRadioButtonSampleSelected (){
      for (var i=0; i<4; i++){
          if(document.getElementsByName("radiosSample")[i].checked == true){
          return i;
            //+1
          }
       }
    }


/*----- MIDI ------*/

if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!');
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
    dangerNotification("WebMIDI is not supported in this browser.");
}

function onMIDISuccess(midiAccess) {
    console.log(midiAccess);
    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;

    for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
    }
}

function onMIDIFailure() {
    dangerNotification("Could not access your MIDI devices.");
}

function getMIDIMessage(e) {
    var command = e.data[0];
    var note = e.data[1];
    var velocity = (e.data.length > 2) ? e.data[2] : 0; // a velocity value might not be included with a noteOff command

    switch (command) {
        case 144: // noteOn
            if (velocity > 0) {
                midiPress(e, note);  //on
            } else {
                midiRelease(e, note); //off
            }
            break;
        case 128: // noteOff
            midiRelease(e, note); //off
            break;
        // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
}

//Impostazioni tonalità etc. del loop selezionato
function getLoopSetting(jsonSettings) {
    tonality = jsonSettings["Tonality"];
    time_signature = jsonSettings["TSNumerator"];
    denominator = jsonSettings["TSDenominator"];
    bpm = jsonSettings["Bpm"];
    bpm_at = jsonSettings["Bpm_at"];
    beats_number = jsonSettings["Beats_Number"];
    selected = Array(time_signature*beats_number).fill(false);
    loopDuration = jsonSettings["Duration"];
    duration_loop = loopDuration;

    curr_sample = jsonSettings["loop"];     //TODO: DELETE
    first_quarter = [];
    change_color = time_signature;
    for(var i = 0; i < beats_number; i++) {first_quarter[i] = (time_signature)*i;}
}

var jsonSettings;

//Get settings of the room from Firebase, JSON 
function getLoopSettingsFromFirebase (loopName) {
    firebase.database().ref('Loop/' + loopName).once('value', function(snap){
      jsonSettings = snap.val(); //{""} contains all the infos about the room
    });
}

async function selectLoop(url, index) {
    check.disabled = true;
    document.querySelector(".loop-caption").style.pointerEvents = "none";
    document.querySelector(".loop-caption").style.backgroundColor = "#bcbcb6";
    procheck.disabled = true;
    var supportSource = c.createBufferSource();
    fetch(url) // can be XHR as well
        .then(resp => resp.arrayBuffer())
        .then(buf => c.decodeAudioData(buf)) // can be callback as well
        .then(decoded => {
              supportSource.buffer = bufLoop = decoded;
              //duration_loop = supportSource.buffer.duration*1000; //durata del loop
              supportSource.loop = true;
              supportSource.connect(c.destination);
              check.disabled = false;
              document.querySelector(".loop-caption").removeAttribute("style");
              procheck.disabled = false;
        });
    sourceLoop = supportSource;

    if(isMaster) {

        //così abbiamo accesso a ogni informazione del loop in questione
        selectedLinkLoop = linkLoopList[index];
        

        var promise_loopSettings = firebase.database().ref('Loop/' + selectedLinkLoop["name"]).once('value');    
        promise_loopSettings.then(snap => {
          updateCurrLoop(); //update of the current loop on Firebase

          getLoopSetting(snap.val()); //get settings of the loop from Firebase

          document.querySelector(".monitor-loop").innerHTML = "• LOOP: " + selectedLinkLoop.name.toUpperCase();
          var majmin = "";
          if(tonality.mode == "minor") majmin = "m";
          if(procheck.checked) {
            document.querySelector(".monitor-tonality").innerHTML = "• TONALITY: " + tonality.note + majmin + " (PRO)";
          }
          else {
            document.querySelector(".monitor-tonality").innerHTML = "• TONALITY: " + tonality.note + majmin;
          }
          document.querySelector(".monitor-bpm").innerHTML = "• BPM: " + bpm;    

          loopName =  selectedLinkLoop["name"]
          renderLoop();    
        })
    }
    //jsonSettings = undefined;

    MMSequences = []; //TODO: CHECK: quando cambio loop perdo i messaggi che ho ricevuto => Evita di avere problemi con i messaggi ricevuti con un vecchio loop di diversa durato    

    cleanMarkovChain ();   //Clean MC ready to be filled for the new loop

    //ONLINE AUDIO
    audioMP3Cycle = null; //delete prec audio of riffs of the prev loop
    document.querySelector("audio").src = []; //empties audio buffer deleting the blob    
    booleanPlayOnlineRiff = false;

}

var toClear;

var booleanPlayOnlineRiff = false;

check.onchange = e => {
  var when = c.currentTime + 0.01;    
    
    
  if (check.checked) {
     if(booleanPlayOnlineRiff == true){
          cycleMMReceived (when);
      }

    check.disabled = true; //?????
    sourceLoop.start(when); // start our bufferSource
    play(when);


   isLooping = true;
   isLoopingMaster = true;

    //var time = (60/bpm)*(bpm_at/4)*(4/denominator)*1000  quello che ci piace di più
    var time = duration_loop/selected.length;
    var counter = 0;
    /*async function eskere() {
      while(isLooping) {
        clock();
        await sleep(time-2.6-counter);
        counter = counter + 0.0001;
      }
    }
    eskere()*/
    //far partire la barra
  } else {
    sourceLoop.stop(0); // this destroys the buffer sourceLoop
    play(0);
      
      if(booleanPlayOnlineRiff == true){      
        audioMP3Cycle.pause()
        audioMP3Cycle.currentTime = 0
      }
    isLooping = false;     //cose del rec spostate qua dentro
    isLoopingMaster = false;

   // clearInterval(toClear);
    selected.fill(false);
    newClock = true;
    render();
    newClock = false;
    active = 0;
    change_color = time_signature;
    //stoppare la barra
    sourceLoop = c.createBufferSource(); // so we need to create a new one
    sourceLoop.buffer = bufLoop;
    sourceLoop.loop = true;
    updateBPM(-1);                       //set -1 as Loop Inactive on Firebase
    sourceLoop.connect(c.destination);
  }
};

//funzione della tendina del loop

$(function() {

  $('.loop-dropdown > .loop-caption').on('click', function() {
    $(this).parent().toggleClass('open');
  });

  $('.loop-dropdown > .loop-list > .link-loop').on('click', function() {
    $('.loop-dropdown > .loop-list > .link-loop').removeClass('selected');
    $(this).addClass('selected').parent().parent().removeClass('open').children('.loop-caption').text( $(this).text() );
  });

  $(document).on('keyup', function(evt) {
    if ( (evt.keyCode || evt.which) === 27 ) {
      $('.loop-dropdown').removeClass('open');
    }
  });

  $(document).on('click', function(evt) {
    if ( $(evt.target).closest(".loop-dropdown > .loop-caption").length === 0 ) {
      $('.loop-dropdown').removeClass('open');
    }
  });

});

//funzione per la veste grafica della tendina dei suoni

$(function() {

 $('.sound-dropdown > .sound-caption').on('click', function() {
   $(this).parent().toggleClass('open');
  });

 $('.sound-dropdown > .sound-list > .link-sound').on('click', function() {
   $('.sound-dropdown > .sound-list > .link-sound').removeClass('selected');
   $(this).addClass('selected').parent().parent().removeClass('open').children('.sound-caption').text( $(this).text() );
  });

  $(document).on('keyup', function(evt) {
    if ( (evt.keyCode || evt.which) === 27 ) {
      $('.sound-dropdown').removeClass('open');
    }
 });

  $(document).on('click', function(evt) {
   if ( $(evt.target).closest(".sound-dropdown > .sound-caption").length === 0 ) {
     $('.sound-dropdown').removeClass('open');
    }
  });

});

procheck.onchange = e => {
   var majmin = "";
   if(tonality.mode == "minor") majmin = "m";
   if(procheck.checked) {
     availableNote.fill(true);
     availableNoteMidi.fill(true);
     document.querySelector(".monitor-tonality").innerHTML = "• TONALITY: " + tonality.note + majmin + " (PRO)";
     render();
   }
   else {
     assignTonality();
     document.querySelector(".monitor-tonality").innerHTML = "• TONALITY: " + tonality.note + majmin;
   }
}



//------ Firebase settings of the room ------ /

//Add new room and initial settings in the database
async function createNewRoom () {
  var randomVal = getRandomArbitrary(100, 100000);

  var promise_roomVal = firebase.database().ref('/RoomValue').once('value');

  /*getRoomVal();                                                               
  while(roomVal == undefined) {
      await sleep(100);
  }*/

  promise_roomVal.then(snap => {  

      successNotification("New room created by " + userName, 'glyphicon glyphicon-ok');

      roomPath = "/Room" + snap.val().val + "-" + randomVal;

      var room = firebase.database().ref(roomPath);
        room.update({
            author : userName,
            currTime : -1,
            loop : "null",
        })

      addUserSettingsToFirebase();

      document.getElementById("container-roomid").innerHTML = "ID: " + roomPath.slice(1);
      updateRoomValue (snap.val().val);

      listenUpdatesFromFirebase (); // TODO: CHEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEECK   
  }) 

}

function addUserSettingsToFirebase () {

    var room = firebase.database().ref(roomPath + "/RiffCollection");
    var boolExist;

    room.once('value', function(snapshot) {
        if (!snapshot.exists() && !isMaster) {
            warningNotification("Searched Room doesn't exist");
            //alert("The Room doesn't exists");

            boolExist = false;

        } else{
              room.update({
                [userName]: {
                    RiffCollection :{
                      Riff0: { 
                          sequence: "Pause 2.0",    //TODO: Insert of the correct duration
                          instrument: -2,
                          pro: false
                             },
                      Riff1: { 
                          sequence: "Pause 2.0",
                          instrument: -2,
                          pro: false
                             },
                      Riff2: { 
                          sequence: "Pause 2.0",
                          instrument: -2,
                          pro: false
                             },
                      Riff3: { 
                          sequence: "Pause 2.0",
                          instrument: -2,
                          pro: false                              
                             }, 
                    },
                  status: "new",    
                },
              }); //write on firebase    
            }

        boolExist = true;

        });
        return boolExist;
    }

//Called quando cambio sample in una room
function updateCurrLoop (){
  var ref = firebase.database().ref(roomPath);
  ref.update({loop : selectedLinkLoop.name});
}

//Metronome update of the current loop selected
function updateBPM (index){
 if(index == -1) {
    isLoopingMaster = false;
    selected.fill(false);
    newClock = true;
    render();
    newClock = false;
    active = 0;
    change_color = time_signature;
  }
  else {
    isLoopingMaster = true;
  }
 if(isMaster) {
      var ref = firebase.database().ref(roomPath);
      ref.update({currTime : index});
    }
}



//------------- SOUNDS from GITHUB -----------------//

function setSound(index) {  //da chiamare ogni volta che si cambia suono
  curr_sound = index;
}

function attackSound(note, index, dest, attackTime) {
  if(gatesSound[note] != null) {
    return;
  }
  var tempo = 0 + c.currentTime + attackTime;
  if(note == 15) {
    playPlayer(15, bufSound[index], tempo, 0, dest, 0.0);
  }
  else {
    playPlayer(note, bufSound[index], tempo, 2, dest, 1.0);
  }
}

var releaseInstrum = [0.3, 0.3, 0.3, 0.2, 0.3, 0.1, 0.1, 0.1];

function releaseSound(note, index, releaseTime) {
  var tempo = 0 + c.currentTime + releaseInstrum[index] + releaseTime;
  //meglio passarli un indice per i gain diversi
  if(note == 15) {
    gatesSound[15].gain.linearRampToValueAtTime(0,tempo);
    gatesSound[15].audioBufferSourceNode.stop(tempo);
    gatesSound[15] = null;  
  }
  else {
    gatesSound[note].gain.linearRampToValueAtTime(0,tempo);
    gatesSound[note].audioBufferSourceNode.stop(tempo);
    gatesSound[note] = null;
  }
}



/* -------- CYCLE ALGORITHM: PLAY MMS OF USERS ---------*/

var loopDuration =(60/bpm)*(bpm_at/4)*(4/denominator)*1000*selected.length; //duration of the loop chord progress, default


/*2 TYPES ---
1. From the /RiffCollection/NOMEUTENTE/RIFFNAME             --global
2. From the /RoomXX/RiffCollection/NOMEUTENTE/RiffCollection/RIFFNAME      --room
*/

//TODO: AGGIUNGERLI IN UNA CARTELLA LOOP, IN MODO CHE PRENDO SOLO QUELLI DEL LOOP GIUSTO

var MMSequences = []; //array containing the mms of the users uploaded on Firebase in the room
var MMSequencesGLOBAL = []; //array containing the mms of the users uploaded on Firebase

var UsersOnline = [] //array of users that have join the room


//Real time update of the MMS with new mm of users in the room
function instantGetMMfromFirebaseROOM (user, riffName){
    var userRiff = firebase.database().ref(roomPath + "/RiffCollection/" + user + "/RiffCollection/" + riffName); 
    //console.log("Ho ricevuto un nuovo messaggio da " + user + ": " + riffName);
    
    successNotification("Reiceved new musical message from " + user, 'glyphicon glyphicon-ok');
    
    messageOwners.push(user);
    
    userRiff.once('value', receivedMusicMessageRoom);
}

//Real time update of the MMS with new mm of users global
function instantGetMMfromFirebaseGLOBAL (user, riffName){
    var userRiff = firebase.database().ref("/RiffCollection/" + user + "/" + riffName); 

    var promise_userRiff = firebase.database().ref("/RiffCollection/" + user + "/" + riffName).once('value');    
    promise_userRiff.then(snap => {
      if(snap.val() != null){
            //console.log("Nuovo messaggio Globale da " + user + ": " + riffName);

            successNotification("Loaded new Global musical message of " + user, 'glyphicon glyphicon-ok');
          
            userRiff.once('value', receivedMusicMessageGlobal);
      } else {
          warningNotification("Searched message doesn't exist");
      }
    })
}

function receivedMusicMessageRoom(data) {

  if(data.val().instrument != -2){
      //console.log("Acquisito MusicMessage: " + data.val().sequence + "Instr: " + data.val().instrument); //to delate

      MMSequences.push({sequence: instantTranslateMMSInPlayableFormat(data.val()), instrument: data.val().instrument, pro: data.val().pro});   

      //gives the received riff to the markov chain
        if (booleanFeedMarkovChain && selectedLinkLoop != null){    //TODO: manca qualcosa
            if(MMSequences[MMSequences.length - 1].pro == false){     //get only riffs with notes of the tonality
                createPercentage(MMSequences[MMSequences.length - 1])
            }
        }

     }
}

function receivedMusicMessageGlobal(data) {
    console.log("Acquisito MusicMessage: " + data.val().sequence + "Instr: " + data.val().instrument);

    MMSequencesGLOBAL.push({sequence: instantTranslateMMSInPlayableFormat(data.val()), instrument: data.val().instrument});
}


var union = [];   //array containing all mm received in one

function transformInUniqueMM (mm){
    var unionSequence = [];
    var unionSound = []

    for (var i = 0; i < mm.length; i++){
        unionSequence = unionSequence.concat(mm[i].sequence);
        for(var j = 0; j < mm[i].sequence.length; j++){   
             unionSound.push(mm[i].instrument);
        }
    }
    union.push({sequence: unionSequence, instrument: unionSound});
}


async function CYCLE (mm) {
    while(true) {
      await sleep(20);
      if(active == 0) {
        await sleep(150);
        totMM = mm.length;  
           for(var i = 0; i < totMM; i++) {
               playMessage(mm[i], null, c.destination);
               while(isPlaying) {
                    //await sleep(loopDuration);
                    await sleep(100);
               }
            // mm.shift() //remove the current musical sequence played shifting the array
            }
        break;
      }
    }    
    MMSequences = []; //TODO: CHECK
}


    //TODO: Delete, permette di playare live da sotto ma se ci sono problemi per pause troppo corte queste vengono
    //riportate anche sulle successive, quindi non è una soluzione corretta
    /*function OO (){
          isPlaying = true;  

          var messageSelected = union[0].sequence; //message selected from the bank
          var sound = union[0].instrument;
          var max = messageSelected.length;

          var timePass = 0;  

            for(i = 0; i < max; i++) {

                for(j = 0; j < messageSelected[i].freq.length; j++){
                    if(sound[i] != -1){
                        attackSound(getMidiFromFreq(messageSelected[i].freq[j]), sound[i], c.destination, timePass); 
                    } else {
                        console.log("O2")
                        attack(messageSelected[i].freq[j], c.destination, timePass); 
                    }
                }

                //await sleep(messageSelected[i].duration);

                timePass = timePass + Number(messageSelected[i].duration)/1000; //update with the duration of the note played

                for(j = 0; j < messageSelected[i].freq.length; j++){
                    if(sound[i] != -1){
                        releaseSound(getMidiFromFreq(messageSelected[i].freq[j]), sound[i], timePass);
                    } else {
                        release(messageSelected[i].freq[j], timePass);
                    }
                }
            }        

        isPlaying = false;  

        console.log("end of playing rec");
    }

    */

async function messageOwnersNotification (){
    for(var i = 0; i < messageOwners.length; i++){
        successNotification("Music message of: " + messageOwners[i], 'glyphicon glyphicon-volume-up')
        await sleep (loopDuration);
    }
}

function cycleMMReceived (when) {
    //OO(union[0]);

    audioMP3Cycle.play(when);
    //messageOwnersNotification()
}


var mp3Button = document.getElementById("storer");

var chunks = [];
var audioMP3Cycle;

var dest = c.createMediaStreamDestination();
var mediaRecorder = new MediaRecorder(dest.stream);

mp3Button.addEventListener("click", async function(e) {
    if (MMSequences.length != 0) {
        mediaRecorder.start();

        //console.log("Transforming in mp3..");
        primaryNotification("Transforming in mp3...");
        
        console.log(e);
        
        //e.target.disabled = true; //can't be clicked until all the trasformation is done
        document.getElementById('storer').style.pointerEvents = "none";
        document.getElementById('storer').style.backgroundColor = "#bcbcb6";
        
        e.target.innerHTML = "Transforming messages...";

        transformInUniqueMM(MMSequences);

        var messageSelected = union[0].sequence; //message selected from the bank
        var sound = union[0].instrument;
        var max = messageSelected.length;

        var timePass = 0;  

        for(i = 0; i < max; i++) {

            for(j = 0; j < messageSelected[i].freq.length; j++){
                if(sound[i] != -1){
                    attackSound(getMidiFromFreq(messageSelected[i].freq[j]), sound[i], dest, timePass); 
                } else {
                    attack(messageSelected[i].freq[j], dest, timePass); 
                }
            }

            timePass = timePass + Number(messageSelected[i].duration)/1000; //update with the duration of the note played

            for(j = 0; j < messageSelected[i].freq.length; j++){
                if(sound[i] != -1){
                    releaseSound(getMidiFromFreq(messageSelected[i].freq[j]), sound[i], timePass);
                } else {
                    release(messageSelected[i].freq[j], timePass);
                }
            }
        }

        //TODO FREEZARE in modo da non rischiare di far rallentare le registrazioni interne  

        await sleep(timePass*1000);   //wait until the riff is played so it can be saved in the blob


        e.target.innerHTML = "Transform Online Messages";
        mediaRecorder.stop();     //close recording

        document.getElementById('storer').removeAttribute("style")
        //e.target.disabled = false;

        MMSequences = [];     //after trasforming in audio buffer, empities mm received and the union of them
        union = [];    

        //console.log("Audio completed!");
        successNotification("Audio completed!", 'glyphicon glyphicon-cd');

      } else {   
          
          warningNotification("There are no messages to converts");

      }
});

mediaRecorder.ondataavailable = function(evt) {
    // push each chunk (blobs) in an array 
    
    chunks.push(evt.data);
};

mediaRecorder.onstop = function(evt) {
    // Make blob out of our blobs, and open it.     

    var blob = new Blob(chunks, { 'type' : 'audio/mpeg; codecs=opus' });      //audio/wav o audio/ogg o audio/webm o audio/mpeg
    document.querySelector("audio").src = URL.createObjectURL(blob);

    audioMP3Cycle = new Audio(URL.createObjectURL(blob));

    blobRiffContainer.push(document.querySelector("audio").src); //saves audio blob in an array 

    chunks = [];  //elimina i chunks precedenti già inseriti nell'audio precedente

    booleanPlayOnlineRiff = true; //next time the loop starts the riffs will play     
};



//TODO: Not used
function quantize(completeMessage) {
    var sedicesimo = duration_loop/16384;

    for(var i = 0; i < completeMessage[0].sequence.length; i++) {
        if(completeMessage[0].sequence[i].duration < sedicesimo) {
            if(sedicesimo - completeMessage[0].sequence[i].duration <= completeMessage[0].sequence[i].duration) {
                completeMessage[0].sequence[i].duration = sedicesimo;
            }
            else {
                completeMessage[0].sequence[i].duration = 0;
            }
        }
        else {
            var multiplo = sedicesimo;
      while(completeMessage[0].sequence[i].duration >= multiplo) {
                multiplo = multiplo+sedicesimo;
          }
          if(multiplo - completeMessage[0].sequence[i].duration <= completeMessage[0].sequence[i].duration-(multiplo-sedicesimo)) {
              completeMessage[0].sequence[i].duration = multiplo;
          }
          else {
              completeMessage[0].sequence[i].duration = multiplo-sedicesimo;
          }
      }
  }
}

//TODO: UNIQUE FUNC WITH THE PREC? quella di prima è per il caricamento facendo la ricerca, questa per quelli che riceve ogni volta aggiornando
function instantTranslateMMSInPlayableFormat(mm) {
    //array contenente l'mm preso da firebase appena caricato
    var instantMM = [];
    var splittedMesaggesNoteDur = mm.sequence.split(' '); //["note", "dur", "note"...], even index: notes; odd index: duration

    //TODO: mm.instrument DA AGGIUNGERE array strumenti

    for(var i=0; i < splittedMesaggesNoteDur.length - 1; i=i+2){
        freqF = [];
        var notesSplitted = []; 
        notesSplitted = splittedMesaggesNoteDur[i].split(',');

        for(var j = 0; j < notesSplitted.length; j++){
            freqF[j] = midiMap3[notesSplitted[j]]; //get NoteOct frequency    
        }

        //instantMM.push({freq: freqF, duration: splittedMesaggesNoteDur[i+1]*1000});
        instantMM.push({freq: freqF, duration: splittedMesaggesNoteDur[i+1]});      
    }

    return instantMM;
}

var messageOwners = [];

//Listen live updates of users riffs in the room    
function listenUpdatesFromFirebase () {
    var refRC = firebase.database().ref(roomPath + '/RiffCollection/');
    var semaphore = false;

    //on_value_change, è chiamata la prima volta che si adda un utente e ogni volta che viene inviato un riff (1 seq 2 instr)
    refRC.on('child_changed', function(userOnFirebase) {
        firebase.database().ref(roomPath + '/RiffCollection/' + userOnFirebase.key + '/status').once('value', function(snap){
            userStatus = snap.val(); 
            userStatus = Number(('' + userStatus)[0]) 
        });

        if(semaphore == true) {
            riffSel = "Riff" + userStatus;
            console.log("E' stato aggiunto un nuovo riff da " + userOnFirebase.key + ": " + riffSel);

            instantGetMMfromFirebaseROOM (userOnFirebase.key , riffSel);
            semaphore = false;         //for the next
        } else {
            semaphore = true;   //after modifield status (index riff modifield)
        }
    });


    //Called when a new user is logged into the room
    refRC.on('child_added', function(userOnFirebase) {
        //console.log("Nuovo utente loggato, " + userOnFirebase.key);

        infoNotification(userOnFirebase.key);

        UsersOnline.push(userOnFirebase.key);    //save the name of the owner of the riff
    });

    //TODO in the future: ON DELATE, not implemented
}

fullcontainer = document.querySelector('.full-container');


//------------- LOGIN SETTINGS -------------//

var choice;
var counter = 0;
var isEnd = false;

function getNickname() {
  text = $('.nickname-input').val();
  console.log(text);
  return text;
}

function getRoomId() {
  text = $('.roomId-input').val();
  console.log(text);
  return text;
}

function getRadioButtonChoiceSelected (){
  for (var i=0; i<2; i++){
        if(document.getElementsByName("radiosSettings")[i].checked == true){
            return i
        //+1
      }
   }
}


//???
var alreadyStarted = false;
var firstTime = true;
var alreadyMinusOne = false;
var sourceStarted = false;


async function setLoopSettingsFromFirebase () {
  var promise_loopName = firebase.database().ref(roomPath + '/loop').on('value', async function(snap){
        loopName = snap.val();

        while(loopName == undefined){  //Un-necessary, only for security reasons
            console.log("...")
              await sleep(100);
          }

        console.log("Loop Selezionato " + loopName);

        if(loopName != "null") {        //no loop selected by the master

            var promise_loopSettings = firebase.database().ref('Loop/' + loopName).once('value');    
            promise_loopSettings.then(snap => {

            getLoopSetting(snap.val()); //get settings of the loop from Firebase
                
            var index = nameLoopClient.indexOf(loopName);

            selectLoop(linkLoopList[index].link, index);    
                

            document.querySelector(".monitor-loop").innerHTML = "• LOOP: " + loopName.toUpperCase();
            var majmin = "";
            if(tonality.mode == "minor") majmin = "m";
            if(procheck.checked) {
               document.querySelector(".monitor-tonality").innerHTML = "• TONALITY: " + tonality.note + majmin + " (PRO)";
            }
             else {
                document.querySelector(".monitor-tonality").innerHTML = "• TONALITY: " + tonality.note + majmin;
             }
              document.querySelector(".monitor-bpm").innerHTML = "• BPM: " + bpm;            

              renderLoop();    
            })
        }

       //PREV Metodo, TO DELATE

        /*getLoopSettingsFromFirebase(loopName);
          while(jsonSettings == undefined){     
              await sleep(100);
          }

         getLoopSetting(jsonSettings); //get settings of the loop from Firebase

          jsonSettings = undefined;
          renderLoop(); */

     });

    firebase.database().ref(roomPath + '/currTime').on('value', async function(snap){
        console.log(snap.val());
        if(snap.val() == -1) {
          updateBPM(-1);
          alreadyStarted = false;
          if(!firstTime && !alreadyMinusOne) {
            if(sourceStarted) {
              sourceLoop.stop(0);
              sourceStarted = false;
            }
            play(0);
            alreadyMinusOne = true;
            updateOneTimeClient = false;
            sourceLoop = c.createBufferSource(); // so we need to create a new one
            sourceLoop.buffer = bufLoop;
            sourceLoop.loop = true;
            sourceLoop.connect(c.destination);
          }
          firstTime = false;
        } 
        else {
          if((snap.val() == 0 || snap.val() == 1) && !alreadyStarted && !sourceStarted) {
            updateOneTimeClient = true;
            alreadyMinusOne = false;
            var when = c.currentTime + 0.01;
            sourceLoop.start(when);
            play(when);
            sourceStarted = true;
            alreadyStarted = true;
            firstTime = false;
          }
          //clock(snap.val());
        }    //TODO: CHEEEEEEEEEEEEEEEECK
    });
}



radioButtonsSettings = document.querySelector('.radioButtonsSettings');
choiceNickname = document.querySelector('.choiceNickname');
choiceRoomId = document.querySelector('.choiceRoomId');
loginSettings = document.querySelector('.loginPosition');


//radioButtonsSamples.classList.add("hide");


//SETUP
setUp();


var isMaster = false;       //boolean to know if the user is the Room Creator


//Firebase Username limitations
function isValidNickname (txt){
    if(txt.includes(".") || txt.includes("#") || txt.includes("$") || txt.includes("/") || txt.includes("[") || txt.includes("]") ||  txt.includes(",")){
        return false
    }
    else{
        return true
    }
}



function choiceBack () {
    counter--;
    if(counter == 0){
        backButton.classList.add("hide");
        radioButtonsSettings.classList.remove("hide");
        choiceNickname.classList.add("hide");
        backButton.classList.add("hide");
    }
    if(counter == 1){
        radioButtonsSettings.classList.add("hide");
        choiceNickname.classList.remove("hide");
        backButton.classList.remove("hide");
        choiceRoomId.classList.add("hide");
    }
    if(counter == 2){
        choiceNickname.classList.add("hide");
        choiceRoomId.classList.remove("hide");
    }
    //choiceConfirmed();
}






//Initial Settings
function choiceConfirmed() {
    var isRoomExistent;
    var existRoom_promise;
    var loginText;
    var roomText;

    var isValid;

    if(counter == 0){     //after Create or Join Room
        radioButtonsSettings.classList.add("hide");
        choice = getRadioButtonChoiceSelected ()     //(0- create 1- join)
        choiceNickname.classList.remove("hide");
        backButton.classList.remove("hide");        
    }

    if(counter == 1){     //after setting Nickname
        loginText = getNickname();
        isValid = isValidNickname(loginText);

        if(loginText == "" || !isValid)  {
            warningNotification("Invalid Nickname, it can't be null or contain: ., # , $ , /, [, ]")
            loginText = userName; //set default name
            counter= counter-1; //stays in the current window
        } else {  
            choiceNickname.classList.add("hide");
            setUsername(loginText);
            choiceRoomId.classList.remove("hide");
        }
    }

    if(counter == 2) {
        if(choice == 1){  //join room
            roomText = getRoomId()
        if(roomText == "")  {
           warningNotification("Insert valid Room: RoomXX-XXX")
           counter= counter-1; //stays in the current window
        }
        else{
        setPathRoom("/" + roomText); //join Cooperative Room
        isMaster = false;
		    document.querySelector("#master").style.display = "none";
        document.querySelector("#cm").style.width = "630px";
          
        document.getElementById("container-roomid").innerHTML = "ID: " + roomPath.slice(1); //add room where the user is in

           var existRoom_promise = firebase.database().ref(roomPath + "/RiffCollection").once('value');

           existRoom_promise.then (snap => {
                if(snap.val() != null) {
                    isRoomExistent = addUserSettingsToFirebase();
                    //TODO: SINCR WITH DB SETTINGS
                    setLoopSettingsFromFirebase ();  //set loop limitation and listens to loop changes
                    isEnd = true;     

                    //get to the Room Page
                    choiceRoomId.classList.add("hide");
                    loginSettings.classList.add("hide")
                    isLogged = true;
                    fullcontainer.classList.remove("hide");                
                }
               else{
                   //alert(" non esiste")
                   warningNotification("Searched Room doesn't exist")
                   counter= counter-1; //stays in the current window because the insert Room doesn't exist                   
               }
           })     
        }
    } 
  }

    if(counter == 1 && choice == 0) { //new Room
        createNewRoom ();
        //LISTEN TO FIREBASE UPDATES
        isMaster = true;
        isEnd = true;
        document.querySelector(".station").style.borderRadius = "10px 0px 0px 0px";
        document.querySelector(".keyboard-border-second").style.borderRadius = "0px 0px 0px 0px";                  
    }  

    if(isEnd) {
        //get to the Room Page
        document.querySelector('.roomId-input').value = ''
        choiceRoomId.classList.add("hide");
        loginSettings.classList.add("hide")
        isLogged = true;
        fullcontainer.classList.remove("hide");
        //or window.location(url); location.href = "app.html"; //change page;
    }
    counter++;
}


//METRONOME


var unlocked = false;
var isPlayingMetronome = false;      // Are we currently playing?
var startTime;              // The start time of the entire sequence.
var current16thNote;        // What note is currently last scheduled?
var tempo = 120.0;          // tempo (in beats per minute)
var lookahead = 25.0;       // How frequently to call scheduling function 
                            //(in milliseconds)
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                            // This is calculated from lookahead, and overlaps 
                            // with next interval (in case the timer is late)
var nextNoteTime = 0.0;     // when the next note is due.
var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
var noteLength = 0.05;      // length of "beep" (in seconds)
var canvas,                 // the canvas element
    canvasContext;          // canvasContext is the canvas' context 2D
var last16thNoteDrawn = -1; // the last "box" we drew on the screen
var notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages


// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
})();

//change resolution

function removeResolution(e) {
  e.classList.toggle("resolution-box-selected", false);
}

function selectResolution(i) {
  noteResolution = i;
  document.querySelectorAll(".resolution-box").forEach(removeResolution);
  document.querySelector("#res-" + i).classList.toggle("resolution-box-selected", true);
}



function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT 
                                          // tempo value to calculate beat length.
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    if(current16thNote%4 === 0) {
      active = current16thNote/4;  ///da provare con loop dispari
      change_color = active % time_signature;
      if(change_color == 0) {change_color = time_signature};
    }  

    current16thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote == (time_signature*beats_number*4)) {
        current16thNote = 0;
    }
}

function scheduleNote( beatNumber, time ) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );

    if ( (noteResolution==1) && (beatNumber%2))
        return; // we're not playing non-8th 16th notes
    if ( (noteResolution==0) && (beatNumber%4))
        return; // we're not playing non-quarter 8th notes
    if ( (noteResolution==3) )
        return; //we're not playing metronome notes

    // create an oscillator
    var osc = c.createOscillator();
    osc.connect( c.destination );
    if (beatNumber % (time_signature*beats_number*4) === 0)    // beat 0 == high pitch
        osc.frequency.value = 880.0;
    else if (beatNumber % (time_signature*4) === 0 )    // quarter notes = medium pitch
        osc.frequency.value = 440.0;
    else                        // other 16th notes = low pitch
        osc.frequency.value = 220.0;

    osc.start( time );
    osc.stop( time + noteLength );
}

function scheduler() {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (nextNoteTime < c.currentTime + scheduleAheadTime ) {
        scheduleNote( current16thNote, nextNoteTime );
        nextNote();
    }
}

function play(at) {
    if (!unlocked) {
      // play silent buffer to unlock the audio
      var buffer = c.createBuffer(1, 1, 22050);
      var node = c.createBufferSource();
      node.buffer = buffer;
      node.start(at);
      unlocked = true;
    }

    isPlayingMetronome = !isPlayingMetronome;

    if (isPlayingMetronome) { // start playing
        current16thNote = 0;
        nextNoteTime = at;  //currentTime prima
        timerWorker.postMessage("start");
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
    }
}

function resetCanvas (e) {
    // resize the canvas - but remember - this clears the canvas too.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //make sure we scroll to the top left.
    window.scrollTo(0,0); 
}

function draw() {
    var currentNote = last16thNoteDrawn;
    var currentTime = c.currentTime;

    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
        currentNote = notesInQueue[0].note;
        notesInQueue.splice(0,1);   // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (last16thNoteDrawn != currentNote) {
        var x = Math.floor( canvas.width / 18 );
        canvasContext.clearRect(0,0,canvas.width, canvas.height); 
        var tempNote = false;
        for (var i = 0; i < (time_signature*beats_number*4); i++) {
            canvasContext.fillStyle = ( currentNote == i ) ? 
                ((currentNote%(time_signature*4) === 0)?"red":"blue") : "black";
            canvasContext.fillRect( x * (i+1), x, x/2, x/2 );
            if(currentNote%4 === 0) {       //prima era %(timesignature)
              if(tempNote !== currentNote) {
              /*active = currentNote/time_signature;             //TODELATE
                change_color = active % time_signature;
                if(change_color == 0) {change_color = time_signature};*/
                clock();
                tempNote = currentNote;
              };
            }
        }
        last16thNoteDrawn = currentNote;
    }

    // set up to draw again
    requestAnimFrame(draw);
}



function init(){
    var container = document.createElement( 'div' );

    container.className = "container";
    container.style.display = "none"; //TOCHECK        
    canvas = document.createElement( 'canvas' );
    canvasContext = canvas.getContext( '2d' );
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
    document.body.appendChild( container );
    container.appendChild(canvas);    
    canvasContext.strokeStyle = "#ffffff";
    canvasContext.lineWidth = 2;

    // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
    // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
    // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
    // spec-compliant, and work on Chrome, Safari and Firefox.

    // if we wanted to load audio files, etc., this is where we should do it.

    window.onorientationchange = resetCanvas;
    window.onresize = resetCanvas;

    requestAnimFrame(draw);    // start the drawing loop.

    function createWorker(fn) {
       var blob = new Blob(['self.onmessage = ', fn.toString()], { type: 'text/javascript' });
       var url = URL.createObjectURL(blob);

      return new Worker(url);
    }

    timerWorker = createWorker(function (e) {
        var timerID=null;
        var interval=100;
        self.onmessage=function(e){
            if (e.data=="start") {
                console.log("starting");
                timerID=setInterval(function(){postMessage("tick");},interval)
            }
            else if (e.data.interval) {
                console.log("setting interval");
                interval=e.data.interval;
                console.log("interval="+interval);
                if (timerID) {
                    clearInterval(timerID);
                    timerID=setInterval(function(){postMessage("tick");},interval)
                }
            }
            else if (e.data=="stop") {
                console.log("stopping");
                clearInterval(timerID);
                timerID=null;
            }
        };

        postMessage('hi there');
       });

    timerWorker.onmessage = function(e) {
        if (e.data == "tick") {
            // console.log("tick!");
            scheduler();
        }
        else
            console.log("message: " + e.data);
    };
    timerWorker.postMessage({"interval":lookahead});
}

window.addEventListener("load", init );




/* -------------------- B O T  A L G O R I T H M -------------------- */



//Array mm: {note, dur} of a riff -- without pauses

function MMNoteSeq (mm){
    var riffNotes = [];
    var noteOctave = [];
    var currNote;
    var currNoteOct;
    var pauseDur = "0";     //if the first note has no pause

    var singleNote;
    var noPause = false;

    var unionNotes = [];

    for(i = 0; i < mm.sequence.length; i++){

        if(mm.sequence[i].freq != 0){ //is a note

            unionNotes = mm.sequence[i].freq.toString().split(',');     

            if(unionNotes.length > 1){      //consecutive notes, no pause
                noPause = true;
            }
            singleNote = unionNotes[unionNotes.length - 1];


            noteOctave = midiMap2[singleNote].match(/[a-z#]+|[a-zb]+|[^a-z]+/gi);  //split Note, Octave     //TODO: + di 1 nota
            currNote = noteOctave[0]; //starting note
            currNoteOct = noteOctave[1];

            if(!noPause){
               riffNotes.push({note: currNote, octave: currNoteOct, duration: mm.sequence[i].duration, prevPauseDuration: pauseDur});

                //console.log(riffNotes);
            } else {        //consecutive note
               riffNotes.push({note: currNote, octave: currNoteOct, duration: mm.sequence[i].duration, prevPauseDuration: "0"});
            }


            noPause = false;
            pauseDur = [];  //svuoto in modo che il successivo non abbia la pausa del prec qualora questa non ci sia
        }
        else{       //is a pause  
            pauseDur = mm.sequence[i].duration;
        }
     }
    return riffNotes;
}


/*Hash map containing:
array of duration that had the next note

TO ADD: duration of the pause after, add octave and octave probability    

0: num di volte che la nota è stata suonata, probabilità di essere la prima nota del riff e con che durata
1,2,3.. note - percentage of going into the next one
*/
var markovChain = {       //value sono le volte che compare una nota di quel grado, rispettivamente I, II, III...

  0: { numOfRiffAnalyzed: 0},  

  1: [
    { timeUsed: 0, timesUsedAsFirst: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },  
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },   //I    
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },   //II
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },   //III
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },   //IV
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },   //V
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },   //VI
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },   //VII
  ],
  2: [
    { timeUsed: 0, timesUsedAsFirst: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },  
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },      
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
  ],
  3: [
    { timeUsed: 0, timesUsedAsFirst: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },  
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },      
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
  ],
  4: [
    { timeUsed: 0, timesUsedAsFirst: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },  
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },      
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
  ],
  5: [
    { timeUsed: 0, timesUsedAsFirst: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },  
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },      
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
  ],
  6: [
    { timeUsed: 0, timesUsedAsFirst: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },  
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },      
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
  ],
  7: [
    { timeUsed: 0, timesUsedAsFirst: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },  
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },      
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
    { value: 0, probability: 0, duration: [], prevPauseDuration: [], octave: [] },
  ]    
};


//Cleans markovChain
function cleanMarkovChain (){
    var grades = 8; //0 + 7grades
    
    markovChain[0].numOfRiffAnalyzed = 0;
    
    for (var i = 1; i < grades; i++){
        markovChain[i][0].timeUsed = 0;
        markovChain[i][0].timesUsedAsFirst = 0;
        markovChain[i][0].probability = 0;
        markovChain[i][0].duration = [];
        markovChain[i][0].prevPauseDuration = [];
        markovChain[i][0].octave = [];

        for( var j = 1; j < grades; j++){
            markovChain[i][j].value = 0;
            markovChain[i][j].probability = 0;
            markovChain[i][j].duration = [];
            markovChain[i][j].prevPauseDuration = [];
            markovChain[i][j].octave = [];
            
        }
    }
}

//Calculates the interval beetween two notes            //TODO: Not used yet
function calculateInterval (firstNote, secondNote) {

    var noteOctave = firstNote.match(/[a-z#]+|[a-zb]+|[^a-z]+/gi);  //split Note, Octave
    var note1 = noteOctave[0];
    var oct1 = noteOctave[1];
    noteOctave = secondNote.match(/[a-z#]+|[a-zb]+|[^a-z]+/gi);
    var note2 = noteOctave[0];
    var oct2 = noteOctave[1];


    return numberMap[note1]+12*oct1 - [note2]+12*oct2 //TODO: ABS
}


//markovSequence[X][0].timeUsed
//markovSequence[X][Y].value    ---> X starting note | Y arriving note
                    //MMSequences[0]
function createPercentage (mm) {
    var totTimes;       //how much times the note has been used
    var nextNoteTimes;
    var noteOctave;
    var currNote;
    var nextNote;
    var firstTotTimes;

    var zeroDuration = "0";

    var notesArray = MMNoteSeq(mm);

    //First Note settings

    console.log("1-contenuto di notegrademap " + notesArray[0].note); //TODO: Delate


    markovChain[0].numOfRiffAnalyzed = markovChain[0].numOfRiffAnalyzed + 1; //update num of riff analyzed
    firstTotTimes = markovChain[noteGradeMap[notesArray[0].note]][0].timesUsedAsFirst;
    markovChain[noteGradeMap[notesArray[0].note]][0].timesUsedAsFirst = firstTotTimes +1;    //update first note apparance
    markovChain[noteGradeMap[notesArray[0].note]][0].duration.push(notesArray[0].duration);  //duration of first note
    markovChain[noteGradeMap[notesArray[0].note]][0].octave.push(notesArray[0].octave);  //octave of first note

    markovChain[noteGradeMap[notesArray[0].note]][0].prevPauseDuration.push(notesArray[0].prevPauseDuration);  //dur prev pause

    
    console.log(notesArray);    //TODO: Delate

    for(i = 0; i < notesArray.length - 1; i++){     //adds values into markov sequences
        currNote = notesArray[i].note; //starting note
        nextNote = notesArray[i+1].note; //arriving note

        console.log("notegrade curr.. " + noteGradeMap[currNote] + " next " + noteGradeMap[nextNote]);

        totTimes = markovChain[noteGradeMap[currNote]][0].timeUsed
        markovChain[noteGradeMap[currNote]][0].timeUsed = totTimes + 1; //increments the total num of time that note has been used
        console.log("Incrementata " + currNote + " = " + markovChain[noteGradeMap[currNote]][0].timeUsed);

        nextNoteTimes = markovChain[noteGradeMap[currNote]][noteGradeMap[nextNote]].value;
        markovChain[noteGradeMap[currNote]][noteGradeMap[nextNote]].value =  nextNoteTimes + 1; //increments how much times the next note has been played        

        markovChain[noteGradeMap[currNote]][noteGradeMap[nextNote]].duration.push(notesArray[i+1].duration); //adds the time duration of the next note played


        markovChain[noteGradeMap[currNote]][noteGradeMap[nextNote]].prevPauseDuration.push(notesArray[i+1].prevPauseDuration); //adds the time duration of the pause before next note played

        markovChain[noteGradeMap[currNote]][noteGradeMap[nextNote]].octave.push(notesArray[i+1].octave); //adds the octave of the next note played
    }

    //double for to set all the probabilities with new dates

    var firstGrade = 1;
    var lastGrade = 7;
    var j;

    for(i = firstGrade; i <= lastGrade; i++){

        markovChain[i][0].probability = markovChain[i][0].timesUsedAsFirst / markovChain[0].numOfRiffAnalyzed ;

        for(j = firstGrade; j <= lastGrade; j++){
            totTimes = markovChain[i][0].timeUsed;

            nextNoteTimes = markovChain[i][j].value;

            markovChain[i][j].probability = nextNoteTimes / totTimes;   //update probability

        }
    }

    //OLD METHOD: direct access, but it doesn't update when receives a new riff, works if you send an unique riff

    /*for(i = 0; i < notesArray.length - 1; i++){     //sets probability, when you have all the notes values
        currNote = notesArray[i].note; //starting note
        nextNote = notesArray[i+1].note; //arriving note
        totTimes = markovSequence[noteGradeMap[currNote]][0].timeUsed;
        nextNoteTimes = markovSequence[noteGradeMap[currNote]][noteGradeMap[nextNote]].value;


        markovSequence[noteGradeMap[currNote]][noteGradeMap[nextNote]].probability = nextNoteTimes / totTimes;
    }*/      
}


//Calculates random number with probabilities
function randomWithProbability(intervalsProbability) {
    var notRandomNumbers = [];

    //console.log(intervalsProbability)
    for(var i = 1; i < intervalsProbability.length; i++){       //array è da 1 a 8
        for(var j = 0; j < intervalsProbability[i].probability; j++){
            notRandomNumbers.push(intervalsProbability[i].note);     //insert del valore tante volte quanto la sua %
        }
    }

    var idx = Math.floor(Math.random() * notRandomNumbers.length);


    return notRandomNumbers[idx];       //returns the next note
}


/*Machine Learning Riff*/
function generateRiff (numOfIterations){
    //numOfIterations
    console.log("generate Riff");
    var firstGrade = 1;
    var lastGrade = 7;

    var nextNote;
    var currNote;
    var currNoteDuration;
    var currNoteDurationIndex;
    var currNoteDurationPrevPause;
    var currNoteDurationPrevPauseIndex;
    var currNoteOctave;
    var currNoteOctaveIndex;


    var intervalsProbability = [];
    var gradesProbability = [];     //array of array containing for each grade the probab of the next one

    var machineLearningRiff = [];


    //Starting Note

    for(var i = firstGrade; i <= lastGrade; i++){
        if(isNaN(markovChain[i][0].probability)){
            markovChain[i][0].probability = 0;
        }
        intervalsProbability[i] = ({note: i, probability: (markovChain[i][0].probability) * 100, duration: markovChain[i][0].duration, prevPauseDuration: markovChain[i][0].prevPauseDuration, octave: markovChain[i][0].octave});    
    }

    nextNote = randomWithProbability(intervalsProbability);
    currNoteDurationIndex = getRandomArbitrary(0, intervalsProbability[nextNote].duration.length - 1 );
    currNoteDuration = intervalsProbability[nextNote].duration[currNoteDurationIndex];
    currNoteDurationPrevPauseIndex = getRandomArbitrary(0, intervalsProbability[nextNote].prevPauseDuration.length - 1 );
    currNoteDurationPrevPause = intervalsProbability[nextNote].prevPauseDuration[currNoteDurationPrevPauseIndex];
    currNoteOctaveIndex = getRandomArbitrary(0, intervalsProbability[nextNote].octave.length - 1 );
    currNoteOctave = intervalsProbability[nextNote].octave[currNoteOctaveIndex];

    console.log("1.La prossima nota è: " + nextNote + currNoteOctave);


    machineLearningRiff.push({note: nextNote, duration: currNoteDuration, prevPauseDuration: currNoteDurationPrevPause, octave: currNoteOctave});  

    intervalsProbability = []; //svuoto probabilità per quella nota


     for(var i = 0; i < numOfIterations - 1; i++) {

        currNote = machineLearningRiff[i].note; 

        //Creates array of array with the distrubution of probability for every next note  
        for(var j = firstGrade; j <= lastGrade; j++){
            for(var z = firstGrade; z <= lastGrade; z++){

                if(isNaN(markovChain[j][z].probability)){
                    markovChain[j][z].probability = 0;
                }
                intervalsProbability[z] = ({note: z, probability: (markovChain[j][z].probability) * 100, duration: markovChain[j][z].duration, prevPauseDuration: markovChain[j][z].prevPauseDuration, octave: markovChain[j][z].octave});
            }

            gradesProbability[j] = intervalsProbability;

            intervalsProbability = []; //svuoto probabilità per quella nota
        }

        nextNote = randomWithProbability(gradesProbability[currNote]); 

        if(nextNote == undefined){    //stato pozzo che non genera più note, resta quella l'ultima, TODO: Change??
            return machineLearningRiff;         //completed
        }

        currNoteDurationIndex = getRandomArbitrary(0, gradesProbability[currNote][nextNote].duration.length - 1 );
        currNoteDuration = gradesProbability[currNote][nextNote].duration[currNoteDurationIndex];
        currNoteDurationPrevPauseIndex = getRandomArbitrary(0, gradesProbability[currNote][nextNote].prevPauseDuration.length - 1 );
        currNoteDurationPrevPause = gradesProbability[currNote][nextNote].prevPauseDuration[currNoteDurationPrevPauseIndex];
        currNoteOctaveIndex = getRandomArbitrary(0, gradesProbability[currNote][nextNote].octave.length - 1 );
        currNoteOctave = gradesProbability[currNote][nextNote].octave[currNoteOctaveIndex];

        console.log("La prossima nota è: " + nextNote + currNoteOctave);

        machineLearningRiff.push({note: nextNote, duration: currNoteDuration, prevPauseDuration: currNoteDurationPrevPause, octave: currNoteOctave});  

     }

    machineLearningRiff = buildRiff(machineLearningRiff)

    successNotification("Created Bot Message", 'glyphicon glyphicon-barcode')
    
    messageOwners.push("Computer")
    
    return machineLearningRiff[0];
}


//Receives array containing in each cell Note, Dur, PrevPauseDur
function buildRiff (MLRiff) {
    var botSequence = [];
    var freqPause = [0];
    var botRiff = [];
    var j = 0;
    var totDurationTime = 0;

    for(var i = 0; i < MLRiff.length; i++){
        j = i * 2;

        botSequence[j] = ({
            freq: freqPause, 
            duration: MLRiff[i].prevPauseDuration
        });


       botSequence[j+1] = ({
            freq: [midiMap3[notesOfScale[MLRiff[i].note - 1] + "5"]],   //ADDARE L'OTTAVA 
            duration: MLRiff[i].duration
        }); //gets the note from the Grade using the notes of the Scale, -1 because starts from 0 


        totDurationTime = totDurationTime + Number(MLRiff[i].prevPauseDuration) + Number(MLRiff[i].duration);

    }
    botSequence = fixBotRiffSize(botSequence, totDurationTime) //fix sequence time dimension    
    
    //TODO: INSTRUMENT preso a random 

    botRiff.push({sequence: botSequence, instrument: 6, pro: false, creator: "Computer"});

    return botRiff;
}

                     //sequenza nota-dur, nota-dur
function fixBotRiffSize (botSequence, totDur){
    var freqPause = [0];
    var isCompleted = false;

    console.log("Durata riff: " + totDur + " Durata Loop: " + loopDuration);

    while (!isCompleted){
        if(totDur < loopDuration){      //add final Pause with the duration missing

            botSequence[botSequence.length] = {
                freq: freqPause, 
                duration: (loopDuration - totDur).toString() 
            }

            isCompleted = true;

        } else {
            console.log("Cut");

            //tagliare, TODO: TIP per implementazione futura --> tagliare in modo che la durata resti un multiplo in modo che fitta più loop

            /*itera eliminando ogni volta l'ultimo fino ad ottenere una durata totale del riff < durata del loop, per poi aggiungere la pause finale*/

            totDur = Number(totDur) - Number(botSequence[botSequence.length - 1].duration); //update of the riff duration after the last note is removed

            botSequence.pop();

        }
    }

    return botSequence;
}


function createRiffMachineLearning (numOfIterations) {
    var botRiff;

    botRiff = generateRiff(numOfIterations);

    MMSequences.push(botRiff);
}



// -------------- TWITTER : Music Messages into Words -------------- //

var textToAnlyze = [
    "come to decide that the things that i tried were in my life just to get high onwhen i sit alone come get a little known but i need more than myself this time step from the road to the sea to the sky and i do believe that we rely on when i lay it on come get to play it on all my life to sacrifice hey oh listen what i say, oh i got your hey oh now listen what i say, oh when will i know that i really can't go to the well once more time to decide on? when it's killing me when will i really see all that i need to look inside come to believe that i better not leave before i get my chance to ride when it's killing me what do i really need all that i need to look inside hey oh listen what i say, oh come back and hey oh look here what i say oh the more i see, the less i know the more i like to let it go hey oh, whoa, whoa, whoa deep beneath the cover of another perfect wonder where it's so white as snow privately divided by a world so undecided and there's nowhere to go in between the cover of another perfect wonder and it's so white as snow running through the field where all my tracks will be concealed and there's nowhere to go when to descend to amend for a friend all the channels that have broken down now you bring it up i'm gonna ring it up just to hear you sing it out step from the road to the sea to the sky and i do believe what we rely on when i lay it on come get to play it on all my life to sacrifice hey oh listen what i say, oh i got your hey oh listen what i say, oh the more i see, the less i know the more i like to let it go hey oh, whoa, whoa, whoa deep beneath the cover of another perfect wonder where it's so white as snow privately divided by a world so undecided and there's nowhere to go in between the cover of another perfect wonder where it's so white as snow running through the field where all my tracks will be concealed and there's nowhere to go i said hey, hey, yeah, oh yeah, oh yeah, tell my love now hey, hey, yeah, oh yeah, tell my love now deep beneath the cover of another perfect wonder where it's so white as snow privately divided by a world so undecided and there's nowhere to go deep beneath the cover of another perfect wonder where it's so white as snow running through the field where all my tracks will be concealed and there's nowhere to go i said hey oh yeah, oh yeah tell my love now hey, yeah, yeah, oh yeah",

    "getting crazy on the waltzers but it's the life that i choose sing about the six blade sing about the switchback and a torture tattoo and i been riding on a ghost train where the cars they scream and slam and i don't know where i'll be tonight but i'd always tell you where i am in a screaming ring of faces i seen her standing in the light she had a ticket for the races just like me she was a victim of the night i put my hand upon the lever said let it rock and let it roll i had the one arm bandit fever there was an arrow through my heart and my soul and the big wheel keep on turning neon burning up above and i'm just high on the world come on and take a low ride with me girl on the tunnel of love it's just the danger when you're riding at your own risk she said you are the perfect stranger she said baby let's keep it like this it's just a cakewalk twisting baby step right up and say hey mister give me two give me two 'cause any two can play and the big wheel keep on turning neon burning up above and i'm just high on the world come on and take a low ride with me girl on the tunnel of love well it's been money for muscle another whirligig money for muscle another girl i dig another hustle just to make it big and rock away rock away and girl it looks so pretty to me just like it always did like the spanish city to me when we were kids oh girl it looks so pretty to me just like it always did like the spanish city to me when we were kids she took off a silver locket she said remember me by this she put her hand in my pocket i got a keepsake and a kiss and in the roar of dust and diesel i stood and watched her walk away i could have caught up with her easy enough but something must have made me stay and the big wheel keep on turning neon burning up above and i'm just high on the world come on and take a low ride with me girl on the tunnel of love and now i'm searching through these carousels and the carnival arcades searching everywhere from steeplechase to palisades in any shooting gallery where promises are made to rock away rock away from cullercoats and whitley bay out to rock away and girl it looks so pretty to me like it always did like the spanish city to me when we were kids girl it looks so pretty to me like it always did like the spanish city to me when we were kids",

    "when i look into your eyes i can see a love restrained but darlin' when i hold you don't you know i feel the same nothin' lasts forever and we both know hearts can change and it's hard to hold a candle in the cold november rain we've been through this such a long long time just tryin' to kill the pain, oo yeah but love is always coming and love is always going and no one's really sure who's lettin' go today walking away if we could take the time to lay it on the line i could rest my head just knowin' that you were mine all mine so if you want to love me then darlin' don't refrain or i'll just end up walkin' in the cold november rain do you need some time on your own do you need some time all alone everybody needs some time on their own don't you know you need some time all alone i know it's hard to keep an open heart when even friends seem out to harm you but if you could heal a broken heart wouldn't time be out to charm you sometimes i need some time on my own sometimes i need some time all alone everybody needs some time on their own don't you know you need some time all alone and when your fears subside and shadows still remain, oh yeah i know that you can love me when there's no one left to blame so never mind the darkness we still can find a way 'cause nothin' lasts forever even cold november rain don't ya think that you need somebody don't ya think that you need someone everybody needs somebody you're not the only one you're not the only one don't ya think that you need somebody don't ya think that you need someone everybody needs somebody you're not the only one you're not the only one don't ya think that you need somebody don't ya think that you need someone everybody needs somebody you're not the only one you're not the only one don't ya think that you need somebody don't ya think that you need someone everybody needs somebody",

    "hello, i've waited here for you everlong tonight, i throw myself into and out of the red, out of her head she sang come down and waste away with me down with me slow how you wanted it to be i'm over my head, out of her head she sang and i wonder when i sing along with you if everything could ever feel this real forever if anything could ever be this good again the only thing i'll ever ask of you you got to promise not to stop when i say when she sang breathe out so i can breathe you in hold you in and now i know you've always been out of your head, out of my head i sang and i wonder when i sing along with you if everything could ever feel this real forever if anything could ever be this good again the only thing i'll ever ask of you you got to promise not to stop when i say when she sang and i wonder if everything could ever feel this real forever if anything could ever be this good again the only thing i'll ever ask of you you got to promise not to stop when i say when hello, i've waited here for you everlong tonight, i throw myself into and out of the red, out of her head she sang come down and waste away with me down with me slow how you wanted it to be i'm over my head, out of her head she sang and i wonder when i sing along with you if everything could ever feel this real forever if anything could ever be this good again the only thing i'll ever ask of you you got to promise not to stop when i say when she sang breathe out so i can breathe you in hold you in and now i know you've always been out of your head, out of my head i sang and i wonder when i sing along with you if everything could ever feel this real forever if anything could ever be this good again the only thing i'll ever ask of you you got to promise not to stop when i say when she sang and i wonder if everything could ever feel this real forever if anything could ever be this good again the only thing i'll ever ask of you you got to promise not to stop when i say when",

    "take me out tonight where there's music and there's people and they're young and alive driving in your car i never never want to go home because i haven't got one anymoretake me out tonight because i want to see people and i want to see life driving in your car oh, please don't drop me home because it's not my home, it's their home, and i'm welcome no moreand if a double-decker bus crashes into us to die by your side is such a heavenly way to die and if a ten-ton truck kills the both of us to die by your side well, the pleasure - the privilege is minetake me out tonight take me anywhere, i don't care i don't care, i don't care and in the darkened underpass i thought oh god, my chance has come at last but then a strange fear gripped me and i just couldn't ask take me out tonight oh, take me anywhere, i don't care i don't care, i don't care driving in your car i never never want to go home because i haven't got one, day oh, i haven't got oneand if a double-decker bus crashes into us to die by your side is such a heavenly way to die and if a ten-ton truck kills the both of us to die by your side well, the pleasure - the privilege is mine oh, there is a light and it never goes out there is a light and it never goes out there is a light and it never goes out there is a light and it never goes out there is a light and it never goes out there is a light and it never goes out there is a light and it never goes out there is a light and it never goes out there is a light and it never goes out",

    "i'm tired of being what you want me to be feeling so faithless, lost under the surface i don't know what you're expecting of me put under the pressure of walking in your shoes caught in the undertow, just caught in the undertow every step that i take is another mistake to you caught in the undertow, just caught in the undertow i've become so numb, i can't feel you there become so tired, so much more aware by becoming this all i want to do is be more like me and be less like you can't you see that you're smothering me? holding too tightly, afraid to lose control 'cause everything that you thought i would be has fallen apart right in front of you caught in the undertow, just caught in the undertow every step that i take is another mistake to you caught in the undertow, just caught in the undertow and every second i waste is more than i can take! i've become so numb, i can't feel you there become so tired, so much more aware by becoming this all i want to do is be more like me and be less like you and i know i may end up failing too but i know you were just like me with someone disappointed in you i've become so numb, i can't feel you there become so tired, so much more aware by becoming this all i want to do is be more like me and be less like you i've become so numb, i can't feel you there i'm tired of being what you want me to be i've become so numb, i can't feel you there i'm tired of being what you want me to be",

    "in the day we sweat it out on the streets of a runaway american dream at night we ride through the mansions of glory in suicide machines sprung from cages out on highway nine, chrome wheeled, fuel injected, and steppin' out over the line h-oh, baby this town rips the bones from your back it's a death trap, it's a suicide rap we gotta get out while we're young `cause tramps like us, baby we were born to run yes, girl we were wendy let me in i wanna be your friend i want to guard your dreams and visions just wrap your legs 'round these velvet rims and strap your hands 'cross my engines together we could break this trap we'll run till we drop, baby we'll never go back h-oh, will you walk with me out on the wire `cause baby i'm just a scared and lonely rider but i gotta know how it feels i want to know if love is wild babe i want to know if love is real oh, can you show me beyond the palace hemi-powered drones scream down the boulevard girls comb their hair in rearview mirrors and the boys try to look so hard the amusement park rises bold and stark kids are huddled on the beach in a mist i wanna die with you wendy on the street tonight in an everlasting kiss one, two, three, four the highway's jammed with broken heroes on a last chance power drive everybody's out on the run tonight but there's no place left to hide together wendy we can live with the sadness i'll love you with all the madness in my soul h-oh, someday girl i don't know when we're gonna get to that place where we really wanna go and we'll walk in the sun but till then tramps like us baby we were born to run oh honey, tramps like us baby we were born to run come on with me, tramps like us baby we were born to run",

    "i want to live life never be cruel i want to live life be good to you i want to fly and never come down and live my life and have friends around we never change do we, no, no we never learn do we so i want to live in a wooden house i want to live life always be true i want to live life and be good to you i want to fly and never come down and live my life and have friends around we never change do we no no we never learn do we so i want to live in a wooden house where making more friends would be easy oh and i don't have a soul to save yes and i sin every single day we never change do we we never learn do we so i want to live in a wooden house where making more friends would be easy i want to live where the sun comes out i want to live life never be cruel i want to live life be good to you i want to fly and never come down and live my life and have friends around we never change do we, no, no we never learn do we so i want to live in a wooden house i want to live life always be true i want to live life and be good to you i want to fly and never come down and live my life and have friends around we never change do we no no we never learn do we so i want to live in a wooden house where making more friends would be easy oh and i don't have a soul to save yes and i sin every single day we never change do we we never learn do we so i want to live in a wooden house where making more friends would be easy i want to live where the sun comes out",

    "Apollo 11 was the spaceflight that landed the first two people on the moon. commander neil armstrong and lunar module pilot buzz aldrin, both american, landed the apollo lunar module eagle on july 20, 1969. armstrong became the first person to step onto the lunar surface six hours later on july 21 at 02:56:15 utc; aldrin joined him 19 minutes later. they spent about two and a quarter hours together outside the spacecraft, and collected 47.5 pounds of lunar material to bring back to earth. command module pilot michael collins flew the command module columbia alone in lunar orbit while they were on the moon's surface. Armstrong and aldrin spent 21.5 hours on the lunar surface before rejoining columbia in lunar orbit. apollo 11 was launched by a saturn v rocket from kennedy space center on merritt island, florida, on july 16 at 13:32 utc, and was the fifth crewed mission of Nasa's Apollo program. the apollo spacecraft had three parts: a command module with a cabin for the three astronauts, and the only part that returned to earth; a service module , which supported the command module with propulsion, electrical power, oxygen, and water; and a lunar module (lm) that had two stages – a descent stage for landing on the moon, and an ascent stage to place the astronauts back into lunar orbit. after being sent to the moon by the saturn v's third stage, the astronauts separated the spacecraft from it and traveled for three days until they entered lunar orbit. armstrong and aldrin then moved into eagle and landed in the sea of tranquillity. the astronauts used eagle's ascent stage to lift off from the lunar surface and rejoin collins in the command module. they jettisoned eagle before they performed the maneuvers that blasted them out of lunar orbit on a trajectory back to earth. they returned to earth and splashed down in the pacific ocean on july 24 after more than eight days in space. David art space wave Japan Florida street Saturn Internet connection popx just because of you",

    "music is an art form and cultural activity whose medium is sound organized in time. general definitions of music include common elements such as pitch which governs melody and harmony, rhythm and its associated concepts tempo, meter, and articulation, dynamics loudness and softness, and the sonic qualities of timbre and texture which are sometimes termed the color of a musical sound. different styles or types of music may emphasize, de-emphasize or omit some of these elements. music is performed with a vast range of instruments and vocal techniques ranging from singing to rapping; there are solely instrumental pieces, solely vocal pieces such as songs without instrumental accompanimen and pieces that combine singing and instruments. the word derives from greek μουσική mousike; art of the muses. see glossary of musical terminology. in its most general form, the activities describing music as an art form or cultural activity include the creation of works of music, the criticism of music, the study of the history of music, and the aesthetic examination of music. ancient greek and indian philosophers defined music as tones ordered horizontally as melodies and vertically as harmonies. common sayings such as the harmony of the spheres and it is music to my ears point to the notion that music is often ordered and pleasant to listen to. however, 20th-century composer john cage thought that any sound can be music, saying, for example, there is no noise, only sound. Just because of you These things I have to go through It's more than that, we're chained And there's no one else to blame For us two",

    "i would say i'm sorry if i thought that it would change your mind but i know that this time i have said too much, been too unkind i try to laugh about it cover it all up with lies i try to laugh about it hiding the tears in my eyes 'cause boys don't cry boys don't cry i would break down at your feet and beg forgiveness, plead with you but i know that it's too late and now there's nothing i can do so i try to laugh about it cover it all up with lies i try to laugh about it hiding the tears in my eyes 'cause boys don't cry boys don't cry i would tell you that i loved you if i thought that you would stay but i know that it's no use that you've already gone away misjudged your limits pushed you too far took you for granted i thought that you needed me more, more, more now i would do most anything to get you back by my side but i just keep on laughing hiding the tears in my eyes 'cause boys don't cry boys don't cry boys don't cry i would say i'm sorry if i thought that it would change your mind but i know that this time i have said too much, been too unkind i try to laugh about it cover it all up with lies i try to laugh about it hiding the tears in my eyes 'cause boys don't cry boys don't cry i would break down at your feet and beg forgiveness, plead with you but i know that it's too late and now there's nothing i can do so i try to laugh about it cover it all up with lies i try to laugh about it hiding the tears in my eyes 'cause boys don't cry boys don't cry i would tell you that i loved you if i thought that you would stay but i know that it's no use that you've already gone away misjudged your limits pushed you too far took you for granted i thought that you needed me more, more, more now i would do most anything to get you back by my side but i just keep on laughing hiding the tears in my eyes 'cause boys don't cry boys don't cry boys don't cry",

    "it might not be the right time i might not be the right one but there's something about us i want to say cause there's something between us anyway i might not be the right one it might not be the right time but there's something about us i've got to do some kind of secret i will share with you i need you more than anything in my life i want you more than anything in my life i'll miss you more than anyone in my life i love you more than anyone in my life something in the middle of the side of the store got your attention when you ask for more i was excited to be part of your world to belong, to be lost, to be mostly the two of us something i was stealing for no reason at all they hang me higher than a disco ball but you talked them into letting me go it's no picasso, michelangelo something 'bout the jewels you wear shiny, shiny bangles on your wrists and at the masquerade ball you feel trapped in a vault, in an empty aquarium if suddenly you're out of the woods then inside of an alley you're out of words well, i thought it was radium at first just because of you these things i have to go through is it so bad? is it so true? is it still you? just because of you these things i have to go through it's more than that, we're chained and there's no one else to blame for us two some things they don't matter till they matter to you they stole that money from a homeless girl the truth, we're all to blame there are lies and moral consequences we started at the end of the line to end up giving up to a couple, who cares? when you talked me into letting you go no more coral on the atoll something 'bout how hard you learned kamikaze in a hopeless world do you remember the last time you laughed and i laughed and you left and i left? send me on the lonely other side of the world with a couple of guys and no alphabet put two and two together we'll make it last forever just because of you these things i have to go through is it so bad? is it so true? is it still you? just because of you these things i have to go through it's more than that, we're chained and there's no one else to blame for us two just because of you these things i have to go through is it so bad? is it so true? is it still you? just because of you these things i have to go through it's more than that, we're chained and there's no one else to blame for us two"
];


var textForTwitterMessage = textToAnlyze.map(function(s) {
    return s.split(/\s+/).slice(0,250);
});


//FUNZIONI JAVASCRIPT DEI TASTI A DESTRA PER IL MASTER

var onoff = false;

var iterationNumberML = 30;

function renderOnOff() {
  document.querySelector(".on-off-iteration").classList.toggle("on-iteration", onoff);
}

function renderIteration() {
  document.querySelector(".number-iteration-text").innerHTML = iterationNumberML;
}

//listen to Riff Received to build Markov Chain
document.querySelector(".on-off-iteration").onclick = function() {
  booleanFeedMarkovChain = !booleanFeedMarkovChain;
  onoff = !onoff; //for the render    
  renderOnOff();
}

var upTimer = null;
var downTimer = null;

document.querySelector(".up-iteration").addEventListener("mousedown", function() {
    if(upTimer != null) {
      return;
    }
    if(downTimer != null) {
      clearInterval(downTimer);
      downTimer = null;
    }
    upTimer = setInterval(function() {
      if(iterationNumberML >= 120) {
        return;
      }
      iterationNumberML++;
      renderIteration();
    }, 50);
});

document.querySelector(".up-iteration").addEventListener("mouseup", function() {
    if(upTimer != null) {
      clearInterval(upTimer);
      upTimer = null;
    }
});

document.querySelector(".up-iteration").addEventListener("mouseleave", function() {
  if(upTimer != null) {
      clearInterval(upTimer);
      upTimer = null;
    }
});																			   
document.querySelector(".down-iteration").addEventListener("mousedown", function() {
    if(downTimer != null) {
      return;
    }
  if(upTimer != null) {
      clearInterval(upTimer);
      upTimer = null;
    }
    downTimer = setInterval(function(){
      if(iterationNumberML <= 15) {
        return;
      }
      iterationNumberML--;
      renderIteration();
    }, 50);
});

document.querySelector(".down-iteration").addEventListener("mouseup", function() {
    if(downTimer != null) {
      clearInterval(downTimer);
      downTimer = null;
    }
});

document.querySelector(".down-iteration").addEventListener("mouseleave", function() {
    if(downTimer != null) {
        clearInterval(downTimer);
        downTimer = null;
      }
});																					 
document.querySelector(".create-riff").onclick = function() {
    if(markovChain[0].numOfRiffAnalyzed > 0){
          createRiffMachineLearning(iterationNumberML);
          console.log("Bot riff created");
    } else {
        warningNotification("Not enough information in the Markov Chain")
    }
}



// -------------- NOTIFICATIONS -------------- //

successNotification("This application has been developed by Davide Gioiosa and Davide Dal Cortivo", 'glyphicon glyphicon-barcode')


function successNotification(text, iconSelected){
  $.notify({
	// options
	title: '<strong>Success</strong>',
	message: "<br>" + text,                //Si può far aprire un link esterno <em><strong>click</strong></em>",
    icon: iconSelected,
	//url: 'https://it.wikipedia.org/wiki/Karaoke',
	target: '_blank'
},{
	// settings
	element: 'body',
	//position: null,
	type: "success",
	//allow_dismiss: true,
	newest_on_top: true,
	showProgressbar: false,
	placement: {
		from: "top",
		align: "right"
	},
	offset: 20,
	spacing: 10,
	z_index: 1031,
	delay: 3300,
	timer: 1000,
	url_target: '_blank',
	mouse_over: null,
	animate: {
		enter: 'animated fadeInDown',
		exit: 'animated fadeOutRight'
	},
	onShow: null,
	onShown: null,
	onClose: null,
	onClosed: null,
	icon_type: 'class',
});
}


function infoNotification(userName){
  $.notify({
	// options
	title: '<strong>Info</strong>',
	message: "<br>E' entrato un nuovo utente: " + userName + " !",
  icon: 'glyphicon glyphicon-globe',
},{
	// settings
	element: 'body',
	position: null,
	type: "info",
	allow_dismiss: true,
	newest_on_top: true,
	showProgressbar: false,
	placement: {
		from: "top",
		align: "right"
	},
	offset: 20,
	spacing: 10,
	z_index: 1031,
	delay: 3300,
	timer: 1000,
	url_target: '_blank',
	mouse_over: null,
	animate: {
		enter: 'animated bounceInDown',
		exit: 'animated bounceOutUp'
	},
	onShow: null,
	onShown: null,
	onClose: null,
	onClosed: null,
	icon_type: 'class',
});
}


function warningNotification(text){
  $.notify({
	// options
	title: '<strong>Warning</strong>',
	message: "<br>" + text,
    icon: 'glyphicon glyphicon-warning-sign',
},{
	// settings
	element: 'body',
	position: null,
	type: "warning",
	allow_dismiss: true,
	newest_on_top: true,
	showProgressbar: false,
	placement: {
		from: "top",
		align: "right"
	},
	offset: 20,
	spacing: 10,
	z_index: 1031,
	delay: 3300,
	timer: 1000,
	url_target: '_blank',
	mouse_over: null,
	animate: {
		enter: 'animated bounceIn',
		exit: 'animated bounceOut'
	},
	onShow: null,
	onShown: null,
	onClose: null,
	onClosed: null,
	icon_type: 'class',
});
}

function dangerNotification(text){
  $.notify({
	// options
	title: '<strong>Danger</strong>',
	message: "<br>" + text,
},{
	// settings
	element: 'body',
	position: null,
	type: "danger",
	allow_dismiss: false,
	newest_on_top: true,
	showProgressbar: false,
	placement: {
		from: "top",
		align: "right"
	},
	offset: 20,
	spacing: 10,
	z_index: 1031,
	delay: 3300,
	timer: 1000,
	url_target: '_blank',
	mouse_over: null,
	animate: {
		enter: 'animated flipInY',
		exit: 'animated flipOutX'
	},
	onShow: null,
	onShown: null,
	onClose: null,
	onClosed: null,
	icon_type: 'class',
});
}

function primaryNotification(text){
  $.notify({
	// options
	title: '<strong>Primary</strong>',
	message: "<br>" + text,
    icon: 'glyphicon glyphicon-music',  
},{
	// settings
	element: 'body',
	position: null,
	type: "success",
	allow_dismiss: true,
	newest_on_top: false,
	showProgressbar: false,
	placement: {
		from: "top",
		align: "right"
	},
	offset: 20,
	spacing: 10,
	z_index: 1031,
	delay: 3300,
	timer: 1000,
	url_target: '_blank',
	mouse_over: null,
	animate: {
		enter: 'animated lightSpeedIn',
		exit: 'animated lightSpeedOut'
	},
	onShow: null,
	onShown: null,
	onClose: null,
	onClosed: null,
	icon_type: 'class',
});
}



    //UPDATE VERSION: 06/02 - 01.44,