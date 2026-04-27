// ---------------- STATE ----------------
let state = {
  scene: 0,
  player: "",
  hints: 0,
  startTime: Date.now()
};

const story = document.getElementById("story");
const input = document.getElementById("input");
const btn = document.getElementById("submitBtn");

btn.onclick = handleInput;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") handleInput();
});

// ---------------- INPUT ----------------
function handleInput() {
  const val = input.value.trim();
  input.value = "";

  switch (state.scene) {

    // ---------- SCENE 0 ----------
    case 0:
      story.innerText = `Velkommen til mitt slott, jeg heter Renaud de Vichy! Jeg døde i 1256, men før den tid var jeg tempelridder i Jerusalem, og grunnla min residens her kort tid før jeg døde.

Heldigvis er ikke døden slutten, og jeg lever videre som et spøkelse.

Men hvem er dere? (SKRIV NAVNET DERES)`;
      state.scene = 1;
      break;

    // ---------- SCENE 1 ----------
    case 1:
      state.player = val || "Anonym";
      story.innerText = `Hei ${state.player}, det var hyggelig. Men hvorfor er dere her hos et gammelt spøkelse?

Er det kanskje noen som skal gifte seg?

Hva er navnet på disse barbarene?`;

      state.scene = 2;
      break;

    // ---------- SCENE 2 ----------
    case 2:
      if (isWeddingAnswer(val)) {
        story.innerText = `Gudrun og Jens ja, barbarer slik jeg trodde...

Hvor er det disse hedningene kommer fra da?`;
        state.scene = 3;
      } else {
        showHint("Hva heter de som skal gifte seg?");
      }
      break;

    // ---------- SCENE 3 ----------
    case 3:
      if (val.toLowerCase() === "skjåk") {
        story.innerText = `Ja jeg har snakket med Olav den Hellig...

Det er synd å brenne så fager ei bygd.

Vel vel...

Første oppgave starter nå.`;
        state.scene = 4;
      } else {
        showHint("Hva heter stedet Gudrun og Jens kommer fra?");
      }
      break;

    // ---------- SCENE 4 (OPPGAVE 1) ----------
    case 4:
      story.innerText = `OPPGAVE 1
Spørsmål: (DIN HISTORIE HER)
Hint: (DU FYLLER INN)
Svar: (SETTES SENERE)`;
      state.scene = 5;
      break;

    // ---------- SCENE 5 (OPPGAVE 2) ----------
    case 5:
      story.innerText = `OPPGAVE 2
Spørsmål: (DIN HISTORIE HER)
Hint: (DU FYLLER INN)
Svar: (SETTES SENERE)`;
      state.scene = 6;
      break;

    // ---------- SCENE 6 (OPPGAVE 3) ----------
    case 6:
      story.innerText = `OPPGAVE 3
Spørsmål: (DIN HISTORIE HER)
Hint: (DU FYLLER INN)
Svar: (SETTES SENERE)`;
      state.scene = 7;
      break;

    // ---------- SCENE 7 (MÅL) ----------
    case 7:
      story.innerText = `MÅL!
Spørsmål: (DIN HISTORIE HER)
Hint: (DU FYLLER INN)
Svar: (SLUTT)`;
      break;
  }
}

// ---------------- HELPERS ----------------
function isWeddingAnswer(val) {
  const a = val.toLowerCase();
  return (
    a === "jens og gudrun" ||
    a === "gudrun og jens" ||
    a === "jens and gudrun" ||
    a === "gudrun and jens"
  );
}

function showHint(text) {
  state.hints++;
  story.innerHTML += `\n\n💡 HINT: ${text}`;
}
