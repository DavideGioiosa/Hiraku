//Model
var font_gates = [];
var gates = [];
var font_gates2 = []; //lfo
var gates2 = [];  //lfo
var octave = Array(24).fill(false);
var c = new AudioContext();
var keys = "zsxdcvgbhnjmq2w3er5t6y7u";
var message = [];   //array struct note-freq-time
var tones = [];
var tonesExtended = [];
var keys_length = keys.length;
var pressed = [];
var duration = [];
var rec = false;
var alreadyRec = false;
var t_zero;
var totalTime;
var noteCount = 0;
var pauseNote = ["Pause"];    //to put always array in the message
var pauseFreq = [0]           //to put always array in the message
var noteClicked = [];
var noteClickedMidi = [];
var availableNote = Array(24).fill(true);
var availableNoteMidi = Array(88).fill(true);

//FIREBASE
var userName = "mariorossi"    //TODO: set at the beginning
var userSearched = ""; //TODO: set di te stesso?

//da eliminare una volta aggiunto il radio button
function setUserName (name) {
  userName = name;
}

var idUser = 1;
//isFirstFirebaseMessage
// to delate var indexSample = 0;

//

var previousNote = [];
var previousFreq = [];

var recordedMessage = ["","","",""];  //bank registered messages
var tweetMessage = ["","","",""] //bank registered messages ready to be sended to Twitter

//change octave boolean
var octaveUP = false; 
var octaveDOWN = false;

//release note when changing octave
var octaveWhereIAm = []

//hashmap frequency-notes
var map = { 0: "Pause", 261.626: "C", 277.183: "C#", 293.665: "D", 311.127: "Eb", 329.628: "E", 349.228: "F", 369.994: "F#", 391.995: "G", 415.305: "Ab", 440: "A", 466.164: "Bb", 493.883: "B", 523.251: "C", 554.365: "C#", 587.33: "D", 622.254: "Eb", 659.255: "E", 698.456: "F", 739.989: "F#", 783.991: "G", 830.609: "Ab", 880: "A", 932.328: "Bb", 987.767: "B" }

//hashmap notes-frequency
var map2 = { "Pause": 0, "C": 261.626, "C#":277.183, "D": 293.665, "Eb": 311.127, "E": 329.628, "F": 349.228, "F#": 369.994, "G": 391.995, "Ab": 415.305, "A": 440, "Bb": 466.164, "B": 493.883, "C": 523.251, "C#": 554.365, "D": 587.33, "Eb": 622.254, "E": 659.255, "F": 698.456, "F#": 739.989, "G": 783.991, "Ab": 830.609, "A": 880, "Bb": 932.328, "B": 987.767 }

//hashmap notes-index
var numberMap = { "C": 0, "C#": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11 }

//midiMap

var renderMidiMap = {60: "z", 61: "s", 62:"x", 63: "d", 64: "c", 65: "v", 66: "g", 67: "b", 68: "h", 69: "n", 70: "j", 71: "m", 72: "q", 73: "2", 74: "w", 75: "3", 76: "e", 77: "r", 78: "5", 79: "t", 80: "6", 81: "y", 82: "7", 83: "u"}

var midiMap = {};
	
var midiMap2 = {27.5: "A0", 29.135: "Bb0", 30.868: "B0", 32.703: "C1", 34.648: "C#1", 36.708: "D1", 38.891: "Eb1", 41.203: "E1", 43.654: "F1", 46.249: "F#1", 48.999: "G1", 51.913: "Ab1", 55: "A1", 58.27: "Bb1", 61.735: "B1", 65.406: "C2", 69.296: "C#2", 73.416: "D2", 77.782: "Eb2", 82.407: "E2", 87.307: "F2", 92.499: "F#2", 97.999: "G2", 103.826: "Ab2", 110: "A2", 116.541: "Bb2", 123.471: "B2", 130.813: "C3", 138.591: "C#3", 146.832: "D3", 155.563: "Eb3", 164.814: "E3", 174.614: "F3", 184.997: "F#3", 195.998: "G3", 207.652: "Ab3", 220: "A3", 233.082: "Bb3", 246.942: "B3", 261.626: "C4", 277.183: "C#4", 293.665: "D4", 311.127: "Eb4", 329.628: "E4", 349.228: "F4", 369.994: "F#4", 391.995: "G4", 415.305: "Ab4", 440: "A4", 466.164: "Bb4", 493.883: "B4", 523.251: "C5", 554.365: "C#5", 587.33: "D5", 622.254: "Eb5", 659.255: "E5", 698.456: "F5", 739.989: "F#5", 783.991: "G5", 830.609: "Ab5", 880: "A5", 932.328: "Bb5", 987.767: "B5", 1046.502: "C6", 1108.731: "C#6", 1174.659: "D6", 1244.508: "Eb6", 1318.51: "E6", 1396.913: "F6", 1479.978: "F#6", 1567.982: "G6", 1661.219: "Ab6", 1760: "A6", 1864.655: "Bb6", 1975.533: "B6", 2093.005: "C7", 2217.461: "C#7", 2349.318: "D7", 2489.016: "Eb7", 2637.02: "E7", 2793.826: "F7", 2959.955: "F#7", 3135.963: "G7", 3322.438: "Ab7", 3520: "A7", 3729.31: "Bb7", 3951.066: "B7", 4186.009: "C8"};

var midiMap3 = {"A0": 27.5, "Bb0": 29.135, "B0": 30.868, "C1": 32.703, "C#1": 34.648, "D1": 36.708, "Eb1": 38.891, "E1": 41.203, "F1": 43.654, "F#1":  46.249, "G1": 48.999, "Ab1": 51.913, "A1": 55, "Bb1": 58.27, "B1": 61.735, "C2": 65.406, "C#2": 69.296, "D2": 73.416, "Eb2": 77.782, "E2": 82.407, "F2": 87.307, "F#2": 92.499, "G2": 97.999, "Ab2": 103.826, "A2": 110, "Bb2": 116.541, "B2": 123.471, "C3": 130.813, "C#3": 138.591, "D3": 146.832, "Eb3": 155.563, "E3": 164.814, "F3": 174.614, "F#3": 184.997, "G3": 195.998, "Ab3": 207.652, "A3": 220, "Bb3": 233.082, "B3": 246.942, "C4": 261.626, "C#4": 277.183, "D4": 293.665, "Eb4": 311.127, "E4": 329.628, "F4": 349.228, "F#4": 369.994, "G4": 391.995, "Ab4": 415.305, "A4": 440, "Bb4": 466.164, "B4": 493.883, "C5": 523.251, "C#5": 554.365, "D5": 587.33, "Eb5": 622.254, "E5": 659.255, "F5": 698.456, "F#5": 739.989, "G5": 783.991, "Ab5": 830.609, "A5": 880, "Bb5": 932.328, "B5": 987.767, "C6": 1046.502, "C#6": 1108.731, "D6": 1174.659, "Eb6":1244.508, "E6": 1318.51, "F6": 1396.913, "F#6": 1479.978, "G6": 1567.982, "Ab6": 1661.219, "A6": 1760, "Bb6": 1864.655, "B6": 1975.533, "C7": 2093.005, "C#7": 2217.461, "D7": 2349.318, "Eb7": 2489.016, "E7": 2637.02, "F7": 2793.826, "F#7": 2959.955, "G7": 3135.963, "Ab7": 3322.438,"A7": 3520,"Bb7": 3729.31, "B7": 3951.066, "C8": 4186.009, "Pause": 0};


for(var i = 21; i <= 108; i++) {midiMap[i] = Math.round((27.500*Math.pow(2,1/12)**(i-21))*1000)/1000;}
for(var i = 0; i < keys_length; i++) {tones[i] = midiMap[i+60];} //riempimento di tones per evitare un ulteriore calcolo
for(var i = 0; i < 88; i++) {tonesExtended[i] = midiMap[i+21];}  //riempimento di tonesExtended




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
var time_signature = 4;  //TODO: da database
var denominator = 4; //da database
var bpm = 120; //da database
var bpm_at = 4; //da database (denominatore della nota scandita dal metronomo)
var beats_number = 4; //da database
var curr_sample = "null"
var selected = Array(time_signature*beats_number).fill(false);
var first_quarter = [];
var change_color = time_signature;
var red_bpm = false;
var red_clicked = false;
for(var i = 0; i < beats_number; i++) {first_quarter[i] = (time_signature)*i;}
/*for(var i = 0; i < selected.length/time_signature; i++) {first_quarter[i] = (selected.length/time_signature)*i;} assicurarsi che sia falsa */

//Loop
var linkLoopList = [{"name": "No One","link": "https://dl.dropboxusercontent.com/s/7oij89016bx8xv6/aliciakeys.wav", tonality: {note: "E", mode: "major"}, "time_signature": 4, "denominator": 4, "bpm": 90, "bpm_at": 4, "beats_number": 4},{"name": "Stand By Me","link": "https://dl.dropboxusercontent.com/s/20vxnjrtc8546zi/standbyme.wav", tonality: {note: "A", mode: "major"}, "time_signature": 4, "denominator": 4, "bpm": 119, "bpm_at": 4, "beats_number": 8}]; //da database
var selectedLinkLoop;
var duration_loop = (60/bpm)*(bpm_at/4)*(4/denominator)*1000*selected.length; //iniziale
let source;
let buf;
var isLooping = false;

function createLinkLoop() {
  for(var i = 0; i < linkLoopList.length; i++) {
    var div = document.createElement("div");
    document.querySelector(".list").appendChild(div);
    div.className = "link-loop";
    div.setAttribute("index", i);
    div.setAttribute("link", linkLoopList[i].link);
    div.setAttribute("onclick", "if(check.checked) {check.checked = false; source.stop(0); isLooping = false; clearInterval(toClear); selected.fill(false); newClock = true; render(); newClock = false; active = 0;}; selectLoop(linkLoopList[" + i + "].link, " + i + ");") 
    div.innerHTML = linkLoopList[i].name;
  }
}



function createProgressBar() { //create squares in html progress
  for(var i = 0; i < selected.length; i++) {
    var div = document.createElement("div");
    document.querySelector(".progress").appendChild(div);
    div.className = "bpm";
  }
}

createLinkLoop();

createProgressBar();

//add value octave in parameters
function getNoteFromFreq(f){
  return map[f];
}

function getFreqFromNote(f){
 return map2[f];
}

function getNumberFromNote(n) {
  return numberMap[n];
}

function getCharFromMidi(n) {
  return renderMidiMap[n];
}

function getFreqFromMidi(n) {
  return midiMap[n];
}

function getNoteFromFreqMidi(n) {
  return midiMap2[n];
}

//get text from User Search Bar and set the userSearched
//TODO: settare che quando è selezionata e sto scrivendo, la tastiera non deve suonare
function setSearchedUser() {
  userSearched = $('.name-input').val();
}


//View
function renderCircle(circle) {
    circle.classList.toggle("clicked", octave[Number(circle.getAttribute("circle-number"))])
}

function renderAvailableNote(circle) {
    circle.classList.toggle("grey-note", !availableNote[Number(circle.getAttribute("circle-number"))])     
}

function renderRec(button) {
  button.classList.toggle("square-rec-clicked", red_clicked)
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
}

function render() {
  document.querySelectorAll(".circle").forEach(renderCircle)
  document.querySelectorAll(".circle").forEach(renderAvailableNote)
  if(newClock) {document.querySelectorAll(".bpm").forEach(renderBPM)}
  renderRec(document.querySelector(".button-rec"))
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


function attack(freq) {
  if(font_gates[freq]!=null || gates[freq]!=null || font_gates2[freq]!=null || gates2[freq]!=null) {
    return;
  }
  var o = c.createOscillator();
  var g = c.createGain();
  o.connect(g);
  g.connect(c.destination);
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

  gLfo.gain.linearRampToValueAtTime(1,now+0.03);
  g.gain.linearRampToValueAtTime(1,now+0.03);
  
  lfo.start();
  o.start();
  font_gates[freq] = o;
  gates[freq] = g;
  font_gates2[freq] = lfo;
  gates2[freq] = gLfo;
}

function release(freq) {
  var now = c.currentTime;
  gates[freq].gain.linearRampToValueAtTime(0,now+0.03);
  gates2[freq].gain.linearRampToValueAtTime(0,now+0.03);
  font_gates[freq].stop(now+0.03); //ready for garbage collector
  font_gates2[freq].stop(now+0.03); //ready for garbage collector
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
}

function keyTouchPress(e,key) {
  if(keys.includes(key) && noteClicked[key.charCodeAt(0)] == undefined && noteClickedMidi[key.charCodeAt(0)] == undefined && availableNote[keys.indexOf(key)]) {
      noteCount++;
      noteClicked[key.charCodeAt(0)] = true;
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
          
          message.push({note: tempNote, freq: tempFreq, duration: e.timeStamp - t_zero - totalTime})
          totalTime = totalTime + e.timeStamp - t_zero - totalTime;
        }
        
        //empty array of previous situation
        tempNote = []
        tempFreq = []
      }
    
      if(octaveUP == true){
        if(keys.indexOf(key) < 12) {
          octaveWhereIAm[key] = "5";
        }
        else {
          octaveWhereIAm[key] = "6";
        }
        attack(tonesExtended[tonesExtended.indexOf(tones[keys.indexOf(key)])+12]);
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
        attack(tonesExtended[tonesExtended.indexOf(tones[keys.indexOf(key)])-12]);
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
        attack(tones[keys.indexOf(key)])
        previousNote.push(key);
        previousFreq.push(tones[keys.indexOf(key)]);
      }
    
       octave[keys.indexOf(key)] = true;
       pressed[keys.indexOf(key)] = e.timeStamp;
       render();
    }
}

function midiPress(e, midiNote) {
  if(keys.includes(getCharFromMidi(midiNote))) {
    if(!(noteClicked[getCharFromMidi(midiNote).charCodeAt(0)] == undefined)) {
      return;
    }
  }
  if(availableNoteMidi[midiNote-21]) {
      noteCount++;
      if(keys.includes(getCharFromMidi(midiNote))) {noteClickedMidi[getCharFromMidi(midiNote).charCodeAt(0)] = true;}
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
          
          message.push({note: tempNote, freq: tempFreq, duration: e.timeStamp - t_zero - totalTime})
          totalTime = totalTime + e.timeStamp - t_zero - totalTime;
        }
        
        //empty array of previous situation
        tempNote = []
        tempFreq = []
      }

      attack(getFreqFromMidi(midiNote))
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
  octaveChange(key);
  if(keys.includes(key) && noteClicked[key.charCodeAt(0)] == true && !(noteClickedMidi[key.charCodeAt(0)] == true) && availableNote[keys.indexOf(key)]) {
     noteCount--;
     noteClicked[key.charCodeAt(0)] = undefined;
     var noteFreq;
     if((octaveWhereIAm[key] == "6") || (octaveWhereIAm[key] == "5" && keys.indexOf(key) < 12)) {
          noteFreq = tonesExtended[tonesExtended.indexOf(tones[keys.indexOf(key)])+12]; 
          release(noteFreq);
       }
     else if ((octaveWhereIAm[key] == "3") || (octaveWhereIAm[key] == "4" && keys.indexOf(key) >= 12)) {
        noteFreq = tonesExtended[tonesExtended.indexOf(tones[keys.indexOf(key)])-12];
        release(noteFreq);
       }
     else {
        noteFreq = tones[keys.indexOf(key)]; 
        release(noteFreq);
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
        var x = []      //used to have an array also when you have 1 note
        var y = []
        x[0] = getNoteFromFreq(tones[keys.indexOf(key)]) + octaveWhereIAm[key];
        y[0] = noteFreq
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
  if(keys.includes(getCharFromMidi(midiNote))) {
    if((noteClicked[getCharFromMidi(midiNote).charCodeAt(0)] == true)) {
      return;
    }
  }
  if(availableNoteMidi[midiNote-21]) {
     noteCount--;
     if(keys.includes(getCharFromMidi(midiNote))) {noteClickedMidi[getCharFromMidi(midiNote).charCodeAt(0)] = undefined;}
     var noteFreq = getFreqFromMidi(midiNote);
     release(noteFreq);
    
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
        var x = []      //used to have an array also when you have 1 note
        var y = []
        x[0] = getNoteFromFreqMidi(getFreqFromMidi(midiNote));
        y[0] = noteFreq
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
  }
  e.ontouchend = function(e) {
    var key = e.target.getAttribute("char");
    keyTouchRelease(e, key);
  }
}

document.onkeydown = function(e) {
  var key = e.key.toLowerCase();
  keyTouchPress(e, key)
}

document.onkeyup = function(e) {
  var key = e.key.toLowerCase();
  keyTouchRelease(e, key)
}

document.querySelectorAll(".circle").forEach(touchEvent);
document.querySelector(".octave-up").onclick = function(e) {
  var key = e.target.getAttribute("char");
  keyTouchRelease(e, key);
}
document.querySelector(".octave-down").onclick = function(e) {
  var key = e.target.getAttribute("char");
  keyTouchRelease(e, key);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clock() {  //color the relative .bpm
  selected.fill(false);
  selected[active] = true;
  if(change_color >= time_signature) {   //change color every measure
    changeStyle('.active-bpm', 'background-color', '#' + Math.floor(Math.random()*16777215).toString(16));
    change_color = 0;
    }
  change_color++;
  newClock = true;
  render();
  active = (active + 1) % selected.length
}

document.querySelector(".button-rec").onclick = async function(e) {
  if(!alreadyRec && !isLooping) {
    var check_corrector = false;
    if(check.disabled == false) {
      check.disabled = true;
      check_corrector = true;
    }
    document.querySelector(".caption").style.pointerEvents = "none";
    document.querySelector(".caption").style.backgroundColor = "#bcbcb6";
    t_zero = e.timeStamp;
    totalTime = 0;
    active = 0;
    alreadyRec = true;
    rec = true;
    red_bpm = true;
    red_clicked = true;
    message = []; // reset message
    clock(); //for the first time without delay
    var time = duration_loop/selected.length //da mettere in pratica poi
    var refreshIntervalId = setInterval(clock, time) //repeat after 500ms for ever
  
    await sleep(duration_loop);  //TODO: modify, end of registration
    rec = false;
    red_bpm = false;
    red_clicked = false;
    var index = getRadioButtonSelected();
    
    message.push({note: pauseNote, freq: pauseFreq, duration: duration_loop-totalTime});
    recordedMessage[index] = message; //store message
    
    sendMessageToFirebase(index); //FIREBASE, TODO: send now or with a click??
 
    modifyMessage(index);  //creates Tweet with the audio-text
    clearInterval(refreshIntervalId);  //to stop setInterval
    selected.fill(false);
    newClock = true;  //to remove the color on the bar
    render();
    newClock = false; //to restore the initial conditions
    active = 0;
    change_color = time_signature;  //to change the color of the .bpm
    
    if(check_corrector) {check.disabled = false};
    document.querySelector(".caption").removeAttribute("style");
    alreadyRec = false;
  }
  if(!alreadyRec && isLooping) {
    check.disabled = true;
    document.querySelector(".caption").style.pointerEvents = "none";
    document.querySelector(".caption").style.backgroundColor = "#bcbcb6";
    totalTime = 0;
    alreadyRec = true;
    red_clicked = true;
    render();
    while(selected[0] != true) {
      await sleep(100);
      if(active == 0) {
        red_bpm = true; //per evitare ritardo grafico del primo step
      }
    } 
    t_zero = performance.now();
    rec = true;
    message = []; // reset message
    var timePass = 0;
    while(timePass < duration_loop) {
    await sleep(100);
    timePass = timePass + 100;
    if(active == 0) {
        red_bpm = false; //per evitare ritardo grafico del primo step
        red_clicked = false;
      }
    }
    rec = false;
    var index = getRadioButtonSelected(); 
    message.push({note: pauseNote, freq: pauseFreq, duration: duration_loop-totalTime});

    recordedMessage[index] = message; //store message
    
    sendMessageToFirebase(index); //FIREBASE, TODO: send now or with a click??
 
    modifyMessage(index);  //creates Tweet with the audio-text
    
    alreadyRec = false;
    check.disabled = false;
    document.querySelector(".caption").removeAttribute("style");
  }
}

//play local messages
async function playMessage() {
  if(!alreadyRec) {
    var messageSelected = recordedMessage[getRadioButtonSelected()] //message selected from the bank
    var max = messageSelected.length;
  
    for(var i = 0; i < max; i++) {
      for(var j = 0; j < messageSelected[i].freq.length; j++){      
         attack(messageSelected[i].freq[j]) 
        }
    
    await sleep(messageSelected[i].duration);
    
    for(var j = 0; j < messageSelected[i].freq.length; j++){  
          release(messageSelected[i].freq[j]);
         }
    } 
  }
  console.log("return");
}



//-------------- SEND MESSAGE ------------------//

//TODO: CHECK ALTERNATIVE TO floor, ex truncate, NOW: FIRST SIX DECIMALS 
//TODO: ADD ID TO GET THE MESSAGE


//SEND TO FIREBASE
//riff.on('value', sendMessageToFirebase); //FIREBASE ??
//parametro data??
function sendMessageToFirebase (index) {
  console.log(userName + " sending message to Firebase..")
  var messageSelected = recordedMessage[index];
  var max = messageSelected.length;
  var musicMessage = "";
  for(i=0; i < max; i++){
    musicMessage = musicMessage + messageSelected[i].note + " " + Math.floor((messageSelected[i].duration)*1000)/1000000 + " ";
  }  
  
  //path where you want to save your records
  var riff = firebase.database().ref("/RiffCollection/" + userName + "/Riff" + index);
  
  riff.set(musicMessage); //write on firebase
  
  //riff.on('value', receivedString); //per ricevere ogni volta che aggiornat
}

//FUNZIONE CHIAMATA OGNI VOLTA CHE LA STRINGA DA SERVER VIENE MODIFICATA
function receivedString(data) {
  string = data.val();
  console.log("Leggo stringa da server : " + string)
}


//SEND TO TWITTER
function modifyMessage (index) {
  var messageSelected = recordedMessage[index];
  var max = messageSelected.length;
  var tweet = "";
  for(i=0; i < max; i++){
    tweet = tweet + messageSelected[i].note + "%20" + Math.floor((messageSelected[i].duration)*1000)/1000000 + "%0D%0A";
    //+ "%0D%0A"
  }
  tweet = tweet.replace(/#/g,"%23");
  tweet = tweet + "%23karaoko";
  
  tweetMessage[index] = tweet;
  
document.querySelector(".resp-sharing-button__link").href =  "https://twitter.com/intent/tweet/?text=" + tweet + "&amp;url="
}

//Set tonality limitations
function assignTonality() {
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
  for(var i = 0; i < 49; i++) {
    availableNoteMidi[indexNote] = true;
    if(i % 7 == 2 || i % 7 == 6) {
       indexNote = (indexNote + 1) % 84;
       }
    else {
      indexNote = (indexNote + 2) % 84;
    }
  }
  for(var i = 0; i < 4; i++) {
    availableNoteMidi[84 + i] = availableNoteMidi[i];
  }
  render();
}


//Change of the bank record button selected
document.querySelector(".custom-select").onclick = function() {
  console.log("cambio")
  document.querySelector(".resp-sharing-button__link").href = "https://twitter.com/intent/tweet/?text=" + tweetMessage[getRadioButtonSelected ()] + "&amp;url=";
}



/*Bank Records Selector*/

var x, i, j, selElmnt, a, b, d;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < selElmnt.length; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    d = document.createElement("DIV");
    d.innerHTML = selElmnt.options[j].innerHTML;
    d.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(d);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);


function getRadioButtonSelected () {
  try {
    a = document.querySelector(".custom-select").querySelector(".select-items").querySelector(".same-as-selected").textContent.split("Record ")[1];
  }
  catch (err){
    return 0    //no setted bank is the first
  }
  return (a - 1)
}


/*Upload file, to delate after added Python Server*/

var usersMessagesToTraslate = []; //messages received in Twitter Format, DA ELIMINARE ???




/* ------------ RECEIVING MESSAGING INTERACTION PART ------------ */

//SINGLE MESSAGE READY TO BE PLAYED
var messageReceivedFromUsers = ["","","",""] //TODO: modificare
var firebaseMessagesToTraslate = [] //TODO: deve essere array di array


//TODO: SPLIT TWITTER MESSAGES in "Note dur note dur note dur".. version
//DA INSERIRE NELLO SCRIPT PYTHON PER SCRIVERE SU FIREBASE
function createArrayUserStrings(usersText){
  //for(var k = 0; k<1; k++){
    //PRENDE 1 TWEET
    usersMessagesToTraslate.push(usersText.split(' #karaoko')[0]); //array of array of strings
    //usersText = usersText.split(' #karaoko')[1];
    console.log(usersMessagesToTraslate);
    translateMessagesInPlayableFormat ();
  //}
}

//TODO: CHANGE PARAMETERS
//Reads musicMessage from Firebase when it's updated
function receiveMessageFromFirebase (index){
  var riff = firebase.database().ref("/RiffCollection/" + userSearched + "/Riff" + index);
   
  riff.on('value', receivedString);
}

//Riceva stringa da firebase e avvia funzione per renderla suonabile
function receivedString(data) {
  var indexSample = getRadioButtonSampleSelected(); 
  console.log("index Sample: " + indexSample);
  firebaseMessagesToTraslate[indexSample] = data.val();
  console.log("Leggo stringa da server : " + firebaseMessagesToTraslate[indexSample]);
  translateMessagesInPlayableFormat(indexSample); 
}

//usersMessagesToTraslate ?, si può mettere uno generico per feribase e twitter, tanto il formato è lo stesso, messaggio twitter è messo su firebase
//TRANSLATE MESSAGE "Note dur note dur note dur".. in a playable format

function translateMessagesInPlayableFormat(indexSample) {
  //per ora è un messaggio, fare per ognuno così, o array di array..
  var userMessage = [];
  var splittedMesaggesNoteDur = firebaseMessagesToTraslate[indexSample].split(' '); //["note", "dur", "note"...], even index: notes; odd index: duration

  for(var i=0; i < splittedMesaggesNoteDur.length - 1; i=i+2){
    freqF = [];
    var notesSplitted = []
    
    notesSplitted = splittedMesaggesNoteDur[i].split(',');
    
    for(var j = 0; j < notesSplitted.length; j++){
      freqF[j] = midiMap3[notesSplitted[j]] //get NoteOct frequency
    }
    
    userMessage.push({freq: freqF, duration: splittedMesaggesNoteDur[i+1]*1000})
  }
  
  // messageReceivedFromUsers.push(userMessage)
   messageReceivedFromUsers[indexSample] = userMessage;
  
  //messageReceivedFromUsers[i]..
  //aggiustare, continua a pushare quindi ho l'elenco delle sequenze ogni volta che leggo
}

function loadFirebaseSample() {
  receiveMessageFromFirebase (getRadioButtonSampleSelected())
}


/*PLAY SEQUENCE RECEIVED*/
async function playFirebaseSampleMessage() {
  var messageSelected = messageReceivedFromUsers[getRadioButtonSampleSelected()] //[0] message selected from the ones received
  var max = messageSelected.length;
  
  for(var i = 0; i < max; i++) {
   for(var j = 0; j < messageSelected[i].freq.length; j++){      
       attack(messageSelected[i].freq[j]) 
     }
    
    await sleep(messageSelected[i].duration);
    
   for(var j = 0; j < messageSelected[i].freq.length; j++){  
      release(messageSelected[i].freq[j]);
      }
  }
  console.log("end of the play");
}


/*Firebase samples radio button get index*/
function getRadioButtonSampleSelected (){
  for (var i=0; i<4; i++){
	    if(document.getElementsByName("radiosSample")[i].checked == true){
		    return i
        //+1
	  }
   }
}


/*----- MIDI ------*/

if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!');
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
    console.log('WebMIDI is not supported in this browser.');
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
    console.log('Could not access your MIDI devices.');
}

function getMIDIMessage(e) {
    var command = e.data[0];
    var note = e.data[1];
    var velocity = (e.data.length > 2) ? e.data[2] : 0; // a velocity value might not be included with a noteOff command

    switch (command) {
        case 144: // noteOn
            if (velocity > 0) {
                midiPress(e, note)  //on
            } else {
                midiRelease(e, note) //off
            }
            break;
        case 128: // noteOff
            midiRelease(e, note) //off
            break;
        // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
}



//funzioni per il loop
function updateMetronome(jsonSettings) {
  tonality = jsonSettings["Tonality"];
  time_signature = jsonSettings["TSNumerator"];
  denominator = jsonSettings["TSDenominator"];
  bpm = jsonSettings["Bpm"];
  bpm_at = jsonSettings["Bpm_at"];
  beats_number = jsonSettings["Beats_Number"];
  selected = Array(time_signature*beats_number).fill(false);
  
  curr_sample = jsonSettings["Sample"];
  first_quarter = [];
  change_color = time_signature;
  for(var i = 0; i < beats_number; i++) {first_quarter[i] = (time_signature)*i;}
}

var jsonSettings;

//Get settings of the room from Firebase, JSON 
function getSettingsFromFirebase () {
    firebase.database().ref('Loop/' + selectedLinkLoop["name"]).once('value', function(snap){
      jsonSettings = snap.val(); //{""} contains all the infos about the room
    })
}


async function selectLoop(url, index) {

  let supportSource = c.createBufferSource();
  fetch(url) // can be XHR as well
    .then(resp => resp.arrayBuffer())
    .then(buf => c.decodeAudioData(buf)) // can be callback as well
    .then(decoded => {
      supportSource.buffer = buf = decoded;
      duration_loop = supportSource.buffer.duration*1000; //durata del loop
      supportSource.loop = true;
      supportSource.connect(c.destination);
      check.disabled = false;
    });
  source = supportSource;
  
  //così abbiamo accesso a ogni informazione del loop in questione
  selectedLinkLoop = linkLoopList[index];
  //get settings of the loop and updates the room
  
  while(jsonSettings == undefined){
      getSettingsFromFirebase()
      await sleep(100)
  }
  
  console.log(jsonSettings)
  updateMetronome(jsonSettings);
  renderLoop();
}

var toClear;

check.onchange = e => {
  if (check.checked) {
    source.start(0); // start our bufferSource
    isLooping = true,
    clock();
    //var time = (60/bpm)*(bpm_at/4)*(4/denominator)*1000  quello che ci piace di più
    var time = duration_loop/selected.length;
    toClear = setInterval(clock, time)
    //far partire la barra
  } else {
    source.stop(0); // this destroys the buffer source
    isLooping = false;     //cose del rec spostate qua dentro
    clearInterval(toClear);
    selected.fill(false);
    newClock = true;
    render();
    newClock = false;
    active = 0;
    change_color = time_signature;
    //stoppare la barra
    source = c.createBufferSource(); // so we need to create a new one
    source.buffer = buf;
    source.loop = true;
    source.connect(c.destination);
  }
};

  

//funzione per la veste grafica della tendina (non credo proprio serva toccarla)

$(function() {
  
  $('.dropdown > .caption').on('click', function() {
    $(this).parent().toggleClass('open');
  });
  
  $('.dropdown > .list > .link-loop').on('click', function() {
    $('.dropdown > .list > .link-loop').removeClass('selected');
    $(this).addClass('selected').parent().parent().removeClass('open').children('.caption').text( $(this).text() );
  });
  
  $(document).on('keyup', function(evt) {
    if ( (evt.keyCode || evt.which) === 27 ) {
      $('.dropdown').removeClass('open');
    }
  });
  
  $(document).on('click', function(evt) {
    if ( $(evt.target).closest(".dropdown > .caption").length === 0 ) {
      $('.dropdown').removeClass('open');
    }
  });
  
});


//UPDATE VERSION: 18/12 - 22.35, 
/*
  MERGED
  
  Insert FIREBASE:
  - send musicMessage to Firebase
  - get message from Firebase and play it
  
  - Insert radio button section where select what sample you want to load from Firebase and play it
  - Insert search bar: search the user of whose you want to get samples, confirm, upload and play them
  - Insert a different nickname to save new samples
  - Insert Loop
  
  -Fixed sound glitch
*/