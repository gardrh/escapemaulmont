let state = {
  scene: 0,
  player: "",
  hints: 0,
  score: 1000,
  startTime: Date.now(),
  lastHint: ""
};

const story = document.getElementById("story");
const input = document.getElementById("input");
const btn = document.getElementById("submitBtn");
const hintBtn = document.getElementById("hintBtn");

btn.onclick = handleInput;
hintBtn.onclick = showHint;
input.addEventListener("keydown", (e) => { if (e.key === "Enter") handleInput(); });

// Show scene 0 on load
story.innerText =
`Velkommen til mitt slott, jeg heter Renaud de Vichy! Jeg døde i 1256, men før den tid var jeg tempelridder i Jerusalem, og grunnla min residens her kort tid før jeg døde.

Heldigvis er ikke døden slutten, og jeg lever videre som et spøkelse.

Men hvem er dere? (SKRIV NAVNET DERES)`;

function handleInput() {
  const val = input.value.trim();
  if (!val) return;
  input.value = "";

  switch (state.scene) {
    case 0:
      state.player = val;
      state.scene = 1;
      state.lastHint = "Hva heter de som skal gifte seg?";
      story.innerText =
`Hei ${state.player}, det var hyggelig. Men hvorfor er dere her hos et gammelt spøkelse, som bare vil hvile i fred, er det kanskje noen som skal gifte seg?

Hva er navnet på disse barbarene?`;
      break;

    case 1:
      if (isWedding(val)) {
        state.scene = 2;
        state.lastHint = "Hva heter det der Gudrun og Jens kommer fra?";
        story.innerText =
`Gudrun og Jens ja, barbarer slik jeg trodde, det kunne ikke vært Pierre, eller Louis, eller Michelle eller Edith eller lignende.

Hvor er det disse hedningene kommer fra da?`;
      } else {
        story.innerHTML += `\n\n❓ Prøv igjen...`;
      }
      break;

    case 2:
      if (val.toLowerCase() === "skjåk") {
        state.scene = 3;
        state.lastHint = "Hva heter dette rommet i hotellverden?";
        story.innerText =
`Ja jeg har snakket med en annen helligmann, Olav den Hellig var det vel. Det er synd å brenne så fager ei bygd skal han ha sagt om Skjåk. Vel vel, biensur og nok om det.

Jeg har helt glemt rustningen min, kan dere si meg hvor jeg har lagt den?`;
      } else {
        story.innerHTML += `\n\n❓ Prøv igjen...`;
      }
      break;

    case 3:
      if (isReception(val)) {
        state.scene = 4;
        state.lastHint = "";
        story.innerText =
`Der var den ja, den er grei å ha når jeg skal ut i krigen. Nå som dere har funnet rustningen min, kan dere sjekke dybden på bassenget for meg — om det er for dypt kan jeg ikke bade med rustningen.

Hvor mange meter dypt er bassenget?`;
      } else {
        story.innerHTML += `\n\n❓ Prøv igjen...`;
      }
      break;

    case 4:
      if (isPoolDepth(val)) {
        state.scene = 5;
        state.lastHint = "Pianoet står i første etasje.";
        story.innerText =
`Oi, det var jammen flaks, da kan jeg jo bade uten å drukne! Med mindre jeg faller, men det har jeg ikke gjort siden den ene gangen i Jerusalem. Huff det var flaut, men tres bon, gråt ikke over spilt vin.

Det er altså slik at noen nordboere vil gifte seg her hos meg. For at de skal få lov til det må dere løse TO oppgaver til. Om ikke vil jeg ule i trærne gjennom bryllupskvelden.

Det finnes et piano i huset. Hvilket merke er dette?`;
      } else {
        story.innerHTML += `\n\n❓ Prøv igjen...`;
      }
      break;

    case 5:
      if (val.toUpperCase() === "SAMICK") {
        state.scene = 6;
        state.lastHint = "Det finnes informasjon om hvor mange østers som skal til før man kreperer ved STED";
        story.innerText =
`Jeg trodde kanskje dere ikke visste hva et piano var, barbariske nordboere som dere stort sett er (med noen unntak!).

Nu vel, til slutt — for at dette skal gå veien for brudeparet har jeg en siste oppgave.

Hvor mange østers kan man spise før man kreperer, slik tempelridderordenen gjorde ved slaget i Acre i 1291?`;
      } else {
        story.innerHTML += `\n\n❓ Prøv igjen...`;
      }
      break;

    case 6:
      if (val.trim() === "1") {
        state.scene = 7;
        state.lastHint = "";
        const completionTime = Math.floor((Date.now() - state.startTime) / 1000);
        story.innerText =
`Gratulerer til dere, og condoléances til meg — dette blir nok et veldig leven. Dere har løst den store Renaud de Vichys gåter.

Jeg trekker meg tilbake i veggen der jeg kom fra.

Spillet er slutt.`;
        sendScore(state.player, state.score, completionTime);
      } else {
        story.innerHTML += `\n\n❓ Prøv igjen...`;
      }
      break;
  }
}

function showHint() {
  if (!state.lastHint) {
    story.innerHTML += `\n\n💡 Ingen hint tilgjengelig nå.`;
    return;
  }
  state.hints++;
  state.score = Math.max(0, state.score - 50);
  story.innerHTML += `\n\n💡 HINT: ${state.lastHint}`;
}

// ---------------- HELPERS ----------------
function isWedding(val) {
  const a = val.toLowerCase();
  return a.includes("jens") && a.includes("gudrun");
}

function isReception(val) {
  const a = val.toLowerCase().trim();
  return a === "resepsjonen" || a === "resepsjon";
}

function isPoolDepth(val) {
  const a = val.toLowerCase().trim().replace(",", ".");
  return a === "1.5" || a === "1.50" || a === "150 cm" || a === "150cm";
}

// ---------------- GOOGLE SHEETS ----------------
function sendScore(playerName, score, completionTime) {
  fetch("https://script.google.com/macros/s/AKfycbxtvbDjAO1hwbxGwwzIKYgPgZ3GsZwzLO4RjfpmK6DQVmOOioCN2aa93vG4rU32wZpZ/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      player: playerName,
      score: score,
      time: completionTime
    })
  })
  .then(res => res.text())
  .then(() => {
    story.innerText += `\n\n✅ Score lagret!`;
  })
  .catch(() => {
    story.innerText += `\n\n⚠️ Kunne ikke lagre score.`;
  });
}
