import { Sequencer, Soundfont, CacheStorage } from "smplr";
import { AudioContext } from "standardized-audio-context";

const context = new AudioContext();
const storage = CacheStorage();

const instru1 = Soundfont(context, { instrument: "cello" });
const instru2 = Soundfont(context, { instrument: "taiko_drum", storage });

const startBtn = document.querySelector("#startBtn")
startBtn.addEventListener("click", (e) => {
    const seq = Sequencer(context, { bpm: 100, loop: true });
    seq.addTrack(instru1, [
    { note: "C4", at: "1:1", duration: "1m" },
    { note: "E4", at: "1:1", duration: "1m" },
    { note: "G4", at: "1:1", duration: "1m" },
    { note: "B5", at: "2:1", duration: "1m" },
    { note: "E4", at: "2:1", duration: "1m" },
    { note: "G4", at: "2:1", duration: "1m" },
    { note: "B5", at: "3:1", duration: "1m" },
    { note: "D5", at: "3:1", duration: "1m" },
    { note: "G4", at: "3:1", duration: "1m" },
    { note: "A4", at: "4:1", duration: "1m" },
    { note: "C4", at: "4:1", duration: "1m" },
    { note: "E4", at: "4:1", duration: "1m" },
    ]);
    seq.addTrack(instru2, [
    { note: "C4", at: "1:1", duration: "4n" },
    { note: "C5", at: "1:2", duration: "4n" },
    { note: "C5", at: "1:3", duration: "4n" },
    { note: "C5", at: "1:4", duration: "4n" },
    { note: "C4", at: "2:1", duration: "4n" },
    { note: "C5", at: "2:2", duration: "4n" },
    { note: "C5", at: "2:3", duration: "4n" },
    { note: "C5", at: "2:4", duration: "4n" },
    { note: "C4", at: "3:1", duration: "4n" },
    { note: "C5", at: "3:2", duration: "4n" },
    { note: "C5", at: "3:3", duration: "4n" },
    { note: "C5", at: "3:4", duration: "4n" },
    { note: "C4", at: "4:1", duration: "4n" },
    { note: "C5", at: "4:2", duration: "4n" },
    { note: "C5", at: "4:3", duration: "4n" },
    { note: "C5", at: "4:4", duration: "4n" },
    ]);
    seq.start();
})
