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

// ---------------- GOOGLE SHEETS ----------------

function sendScore(playerName, score, completionTime) {
  fetch("https://script.google.com/macros/s/AKfycbxtvbDjAO1hwbxGwwzIKYgPgZ3GsZwzLO4RjfpmK6DQVmOOioCN2aa93vG4rU32wZpZ/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      player: playerName,
      score: score,
      time: completionTime
    })
  })
  .then(res => res.text())
  .then(data => {
    console.log("Saved!", data);
    story.innerHTML += "\n\n✅ Score lagret!";
  })
  .catch(err => {
    console.error("Error saving score", err);
    story.innerHTML += "\n\n⚠️ Kunne ikke lagre score";
  });
}

function endGame() {
  const timeTaken = Math.floor((Date.now() - state.startTime) / 1000);
  const score = Math.max(1000 - (state.hints * 100) - timeTaken, 0);

  story.innerHTML =
`🏆 DU RØMTE SLUTTET!

Spiller: ${state.player}
Tid: ${timeTaken}s
Hint brukt: ${state.hints}
Score: ${score}`;

  sendScore(state.player, score, timeTaken);
}
