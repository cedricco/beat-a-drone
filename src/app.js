import { Sequencer, Soundfont, CacheStorage, SplendidGrandPiano } from "smplr";
import { AudioContext } from "standardized-audio-context";

const context = new AudioContext();
const storage = CacheStorage();

const instru1loadingEl = document.querySelector("#instru1loading")
const instru2loadingEl = document.querySelector("#instru2loading")
const tabInstru1El = document.querySelector("#tabInstru1")

// const instru1 = SplendidGrandPiano(context, { storage });
const instru1 = Soundfont(context, { 
    instrument: "marimba", 
    storage,
    onLoadProgress: ({ loaded, total }) => {
        instru1loadingEl.innerHTML = `${loaded} / ${total} samples loaded`;
    },
});
const instru2 = Soundfont(context, 
    { 
        instrument: "taiko_drum", 
        storage,
        onLoadProgress: ({ loaded, total }) => {
            instru2loadingEl.innerHTML = `${loaded} / ${total} samples loaded`;
        },
    }
);

const seq = Sequencer(context, { bpm: 110, loop: true, humanize: { timingMs: 12, velocity: 8 }, });

const CHORDS_BY_NB = {
    1: ["C5", "E5", "G5"],
    2: ["D5", "F5", "A6"],
    3: ["E5", "G5", "B6"],
    4: ["F5", "A6", "C6"],
    5: ["G5", "B6", "D6"],
    6: ["A6", "C6", "E6"],
    7: ["B6", "D6", "F6"], 
}


const startBtn = document.querySelector("#startBtn")
startBtn.addEventListener("click", (e) => {
    seq.removeTrack(instru1)
    const tab = tabInstru1El.value
    const chordsNb = tab.split(" ")
    let notes = Array()
    chordsNb.forEach((chordNb, index) => {
        const at = `${index+1}:1`
        const chordNotes = CHORDS_BY_NB[chordNb]
        chordNotes.forEach(note => {
            notes.push(
                { note, at, duration: "1m" },
            )
        })
    });
    seq.addTrack(instru1, notes, { id: "instru1", volume: 0.6 })
    seq.removeTrack(instru2)
    const beats = Array()
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            beats.push(
                // 480 is ticks per quarter note so multiply by 4 to get ticks for a full one
                { note: "C4", at: Math.floor(((rects[j].x) / WIDTH) * 480 * 4) + (480 * 4) * i, duration: "4n" }
            )
        }
    }
    seq.addTrack(instru2, beats, { id: "instru2", volume: 1 },
    );
    seq.start();
})
const stopBtn = document.querySelector("#stopBtn")
stopBtn.addEventListener("click", (e) => {
    seq.stop();
})

// get canvas related references
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var BB = canvas.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

// drag related variables
var dragok = false;
var startX;
var startY;

// an array of objects that define different rectangles
let rects = [];
rects.push({
    x: 75 - 15,
    y: 50 - 15,
    width: 30,
    height: 30,
    fill: "#444444",
    isDragging: false
});
rects.push({
    x: 75 - 25,
    y: 50 - 25,
    width: 30,
    height: 30,
    fill: "#ff550d",
    isDragging: false
});
rects.push({
    x: 75 - 35,
    y: 50 - 35,
    width: 30,
    height: 30,
    fill: "#800080",
    isDragging: false
});
rects.push({
    x: 75 - 45,
    y: 50 - 45,
    width: 30,
    height: 30,
    fill: "#0c64e8",
    isDragging: false
});

// listen for mouse events
canvas.onpointerdown = myDown;
canvas.onpointerup = myUp;
canvas.onpointermove = myMove;

// call to draw the scene
draw();

// draw a single rect
function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

// clear the canvas
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// redraw the scene
function draw() {
    clear();
    ctx.fillStyle = "#FAF7F8";
    rect(0, 0, WIDTH, HEIGHT);
    // redraw each rect in the rects[] array
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        ctx.fillStyle = r.fill;
        rect(r.x, r.y, r.width, r.height);
    }
}


// handle mousedown events
function myDown(e) {

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY);

    // test each rect to see if mouse is inside
    dragok = false;
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (mx > r.x && mx < r.x + r.width && my > r.y && my < r.y + r.height) {
            // if yes, set that rects isDragging=true
            dragok = true;
            r.isDragging = true;
        }
    }
    // save the current mouse position
    startX = mx;
    startY = my;
}


// handle mouseup events
function myUp(e) {  
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    dragok = false;
    for (var i = 0; i < rects.length; i++) {
        rects[i].isDragging = false;
    }
}


// handle mouse moves
function myMove(e) {
    // if we're dragging anything...
    if (dragok) {

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        var mx = parseInt(e.clientX - offsetX);
        var my = parseInt(e.clientY - offsetY);

        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX;
        var dy = my - startY;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];
            if (r.isDragging) {
                r.x += dx;
                r.y += dy;
            }
        }

        // redraw the scene with the new rect positions
        draw();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;

    }
}

