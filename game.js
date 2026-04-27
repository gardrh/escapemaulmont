let state = {
  scene: 0,
  player: "",
  hints: 0
};

const story = document.getElementById("story");
const input = document.getElementById("input");
const btn = document.getElementById("submitBtn");

btn.onclick = handleInput;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") handleInput();
});

function handleInput() {
  const val = input.value.trim();
  input.value = "";

  if (state.scene === 0) {
    story.innerText = "Hva heter du, fremmede?";
    state.scene = 1;
    return;
  }

  if (state.scene === 1) {
    state.player = val || "Anonym";
    state.scene = 2;
    introScene();
    return;
  }

  if (state.scene === 2) {
    handleCastleInput(val);
  }
}

function introScene() {
  story.innerText =
`Velkommen ${state.player}...

Du står foran Chateau Maulmont.
Noe i slottet våkner når du nærmer deg.

Hva gjør du?`;
}

function handleCastleInput(val) {
  const cmd = val.toLowerCase();

  if (cmd.includes("dør")) {
    showHint("Døren reagerer på symboler, ikke kraft.");
  } else if (cmd.includes("se")) {
    story.innerText = "Du ser en ulv risset inn i steinen...";
  } else if (cmd.includes("hint")) {
    showHint("Prøv å undersøke døren nærmere.");
  } else {
    story.innerText = "Renaud hvisker: 'Slottet forstår deg ikke ennå...'";
  }
}

function showHint(text) {
  state.hints++;
  story.innerHTML += `\n\n<span class='hint'>HINT: ${text}</span>`;
}
