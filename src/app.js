import { Sequencer, Soundfont, CacheStorage, SplendidGrandPiano } from "smplr";
import { AudioContext } from "standardized-audio-context";

const context = new AudioContext();
const storage = CacheStorage();

const instru1loadingEl = document.querySelector("#instru1loading")
const instru2loadingEl = document.querySelector("#instru2loading")
const tabInstru1El = document.querySelector("#tabInstru1")

// const instru1 = SplendidGrandPiano(context, { storage });
const instru1 = Soundfont(context, { 
    instrument: "choir_aahs", 
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


const OCTAVE = 1
const NOTES = ["A", "B", "C", "D", "E", "F", "G"]
const START_AT_NOTE = 2 // Commence en C

let CHORDS_BY_NB = {}
for (let i=0; i < 7; i++) {
    const notes = Array()
    for (let j=0; j < 3; j++) {
        const index = i + j*2 + START_AT_NOTE
        const remainder = index % 7
        const modulo = Math.floor(index/7)
        notes.push(`${NOTES[remainder]}${OCTAVE + modulo}`)
    }
    CHORDS_BY_NB[`${i}`] = notes
}
console.log(CHORDS_BY_NB)

// 1: ["C3", "E3", "G3"],
//     2: ["D3", "F3", "A4"],
//     3: ["E3", "G3", "B4"],
//     4: ["F3", "A4", "C4"],
//     5: ["G3", "B4", "D4"],
//     6: ["A4", "C4", "E4"],
//     7: ["B4", "D4", "F4"], 
// }


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
                { note: "C4", at: Math.floor(((rects[j].x + 15) / WIDTH) * 480 * 4) + (480 * 4) * i, duration: "4n" }
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
    x: -14,
    y: 50,
    width: 30,
    height: 30,
    fill: "#444444",
    isDragging: false
});
rects.push({
    x: 100,
    y: 50,
    width: 30,
    height: 30,
    fill: "#fF350d",
    isDragging: false
});
rects.push({
    x: 120,
    y: 50,
    width: 30,
    height: 30,
    fill: "#800080",
    isDragging: false
});
rects.push({
    x: 140,
    y: 50,
    width: 30,
    height: 30,
    fill: "#0C44e8",
    isDragging: false
});

// listen for mouse events
canvas.onpointerdown = myDown;
// canvas.onpointerup = myUp;
// canvas.onpointermove = myMove;

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

    // if we're dragging anything...
    if (dragok) {

        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];
            if (r.isDragging) {
                r.x = mx - 15;
                r.y = my - 15;
            }
        }

        // redraw the scene with the new rect positions
        draw();

        // clear all the dragging flags
        dragok = false;
        for (var i = 0; i < rects.length; i++) {
            rects[i].isDragging = false;
        }

    } else {

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

    }
}


// handle mouseup events
function myUp(e) {  
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

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

