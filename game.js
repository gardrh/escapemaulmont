// ---------------- STATE ----------------
let state = {
  scene: 0,
  player: "",
  startTime: Date.now()
};

const sceneDiv = document.getElementById("scene");
const input = document.getElementById("input");
const buttonsDiv = document.getElementById("buttons");

document.getElementById("submitBtn").onclick = handleInput;
document.getElementById("hintBtn").onclick = showHint;

// ---------------- RENDER ----------------
function render(text, buttons = []) {
  sceneDiv.innerText = text;
  buttonsDiv.innerHTML = "";

  buttons.forEach(btn => {
    const b = document.createElement("button");
    b.innerText = btn.text;
    b.onclick = btn.action;
    buttonsDiv.appendChild(b);
  });
}

// ---------------- INPUT ----------------
function handleInput() {
  const val = input.value.trim();
  input.value = "";
  next(val);
}

// ---------------- HINTS ----------------
function showHint() {
  const hints = {
    1: "Han liker kallenavnet sitt 😉",
    2: "Sjekk vær og føremelding",
    3: "Noe han bruker hver dag...",
    5: "Google er lov 😄"
  };

  alert(hints[state.scene] || "Ingen hint her!");
}

// ---------------- GAME FLOW ----------------
function next(val) {
  const answer = val.toUpperCase();

  switch (state.scene) {

    case 0:
      state.player = val || "Anonym";
      state.scene = 1;
      scene1();
      break;

    case 1:
      if (answer === "STORKAR") {
        state.scene = 2;
        scene2();
      } else {
        alert("Gamle-Erik reagerer ikke... prøv igjen!");
      }
      break;

    case 2:
      if (answer === "BLÅ" || answer === "BLA") {
        state.scene = 3;
        scene3();
      } else {
        alert("Feil! Tenk på føret.");
      }
      break;

    case 3:
      if (answer === "TERMOSEN") {
        state.scene = 4;
        scene4();
      } else {
        alert("Feil! Let et sted han bruker mye.");
      }
      break;

    case 4:
      if (answer === "NEI") {
        state.scene = 5;
        scene5();
      } else {
        alert("Er dere HELT sikre?");
      }
      break;

    case 5:
      if (answer === "GRUSOMT FØRE" || answer === "GRUSOMT FORE") {
        state.scene = 6;
        scene6();
      } else {
        alert("Ikke helt riktig...");
      }
      break;
  }
}

// ---------------- SCENES ----------------

function scene0() {
  render("Hva heter du?");
}

function scene1() {
  render(`Dere går inn i smøreboden...

Gamle-Erik:
"Jassåå folkens, er det dere?"

Hva svarer dere?`);
}

function scene2() {
  render(`Gamle-Erik:
"Jeg har voksa ski med rød... men det er kanskje feil."

Hvilken farge trenger han?`);
}

function scene3() {
  render(`"SNØRRUNGER! Hvor er blåsmøringa?!"

Hvor er den?`);
}

function scene4() {
  render(`"Har dere kødda med meg!?"

Velg svar:`, [
    { text: "JA", action: () => alert("Dårlig idé 😅") },
    { text: "NEI", action: () => next("NEI") }
  ]);
}

function scene5() {
  render(`Hva sa han om føret etter turen?`);
}

function scene6() {
  const time = Math.floor((Date.now() - state.startTime) / 1000);
  const score = Math.max(0, 1000 - time);

  render(`🎉 GRATULERER 🎉

Du slapp ut av smøreboden!

Tid: ${time} sekunder
Score: ${score}

Bra jobba, ${state.player}!`);

  sendScore(state.player, score, time);
}

// ---------------- GOOGLE SHEETS ----------------

function sendScore(playerName, score, completionTime) {
  fetch("https://script.google.com/macros/s/AKfycbxtvbDjAO1hwbxGwwzIKYgPgZ3GsZwzLO4RjfpmK6DQVmOOioCN2aa93vG4rU32wZpZ/exec", {
    method: "POST",
    body: JSON.stringify({
      player: playerName,
      score: score,
      time: completionTime
    })
  })
  .then(res => res.text()) // 🔥 safer than .json()
  .then(data => {
    console.log("Saved!", data);
    render(sceneDiv.innerText + "\n\n✅ Score lagret!");
  })
  .catch(err => {
    console.error("Error saving score", err);
    render(sceneDiv.innerText + "\n\n⚠️ Kunne ikke lagre score");
  });
}

// ---------------- START GAME ----------------
scene0();
