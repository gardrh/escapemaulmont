
// ---------------- STATE ----------------
let state = {
  scene: 0,
  player: "",
  startTime: Date.now()
};

const story = document.getElementById("story");
const input = document.getElementById("input");
const btn = document.getElementById("submitBtn");

// ---------------- START ----------------
window.addEventListener("DOMContentLoaded", () => {
  btn.onclick = handleInput;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleInput();
  });
});

// ---------------- INPUT ----------------
function handleInput() {
  const val = input.value.trim();
  input.value = "";

  if (state.scene === 0) {
    state.player = val || "Anonym";
    state.scene = 1;
    scene1();
  }
}

// ---------------- SCENE 1 ----------------
function scene1() {
  story.innerText = `
Velkommen ${state.player}...

Renaud de Vichy:
"Jeg døde i 1256, men jeg lever fortsatt..."

Men hvem er dere?
(SKRIV NAVNET DERES)
`;
}
