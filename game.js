let state = {
  scene: 1,
  player: "",
  hints: 0,
  lastHint: "",
  score: 0,
  startTime: Date.now()
};

const story = document.getElementById("story");
const input = document.getElementById("input");
const btn = document.getElementById("submitBtn");
const hintBtn = document.getElementById("hintBtn");

btn.onclick = handleInput;
hintBtn.onclick = showHint;

input.addEventListener("keydown", (e) => { if (e.key === "Enter") handleInput(); });

function handleInput() {
  const val = input.value.trim();
  input.value = "";

  switch (state.scene) {
    case 1:
      state.player = val || "Anonym";
      story.innerText =
`Hei ${state.player}...
Hvorfor er dere her hos et gammelt spøkelse?
Hva er navnet på disse barbarene?`;
      state.scene = 2;
      state.lastHint = "Hva heter de som skal gifte seg?";
      break;

    case 2:
      if (isWedding(val)) {
        story.innerText =
`Gudrun og Jens ja...
Hvor kommer disse hedningene fra?`;
        state.scene = 3;
        state.lastHint = "Hva heter stedet de kommer fra?";
      } else {
        story.innerHTML += `\n\n❓ Prøv igjen...`;
      }
      break;

    case 3:
      if (val.toLowerCase() === "skjåk") {
        story.innerText =
`Ja... jeg har hørt om dette stedet.
Første oppgave starter nå.`;
        state.scene = 4;
        state.lastHint = "";
      } else {
        story.innerHTML += `\n\n❓ Prøv igjen...`;
      }
      break;

    case 4:
      // Example of finishing the game — call this when the last puzzle is solved:
      // finishGame();
      story.innerText = "OPPGAVE 1 (din historie her)";
      break;
  }
}

function showHint() {
  if (!state.lastHint) {
    story.innerHTML += `\n\n💡 Ingen hint tilgjengelig nå.`;
    return;
  }
  state.hints++;
  state.score = Math.max(0, state.score - 10); // Deduct points per hint
  story.innerHTML += `\n\n💡 HINT: ${state.lastHint}`;
}

function finishGame() {
  const completionTime = Math.floor((Date.now() - state.startTime) / 1000); // seconds
  story.innerText = `🎉 Gratulerer ${state.player}! Dere klarte det!`;
  sendScore(state.player, state.score, completionTime);
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
    story.innerText += `\n\n✅ Score lagret!`;
  })
  .catch(err => {
    console.error("Error saving score", err);
    story.innerText += `\n\n⚠️ Kunne ikke lagre score`;
  });
}

function isWedding(val) {
  const a = val.toLowerCase();
  return a.includes("jens") && a.includes("gudrun");
}
