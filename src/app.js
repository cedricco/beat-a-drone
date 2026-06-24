import { Soundfont } from "smplr";

const context = new AudioContext();
const marimba = Soundfont(context, { instrument: "marimba" });

const startBtn = document.querySelector("#startBtn")
startBtn.addEventListener("click", (e) => {
    marimba.start({ note: 60, velocity: 80 });
})
