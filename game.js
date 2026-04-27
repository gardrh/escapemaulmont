let state = {
  scene: 0,
  player: "",
  hints: 0,
  startTime: Date.now()
};

const story = document.getElementById("story");
const input = document.getElementById("input");
const input2 = document.getElementById("input2");
const btn = document.getElementById("submitBtn");

btn.onclick = handleInput;

function handleInput() {

  const val = input.value.trim();
  const val2 = input2.value.trim();

  input.value = "";
  input2.value = "";

  switch (state.scene) {

    // ---------------- SCENE 0 ----------------
    case 0:
      story.innerText =
`Velkommen til mitt slott, jeg heter Renaud de Vichy!
Jeg døde i 1256, men før den tid var jeg tempelridder i Jerusalem.

Heldigvis er ikke døden slutten, og jeg lever videre som et spøkelse.

Men hvem er dere? (SKRIV NAVNET DERES)`;

      state.scene = 1;
      break;

    // ---------------- SCENE 1 ----------------
    case 1:
      state.player = val || "Anonym";

      story.innerText =
`Hei ${state.player}...

Hvorfor er dere her hos et gammelt spøkelse?

Hva er navnet på disse barbarene?`;

      state.scene = 2;
      break;

    // ---------------- SCENE 2 ----------------
    case 2:
      if (isWedding(val)) {
        story.innerText =
`Gudrun og Jens ja...

Hvor kommer disse hedningene fra?`;

        state.scene = 3;
      } else {
        showHint("Hva heter de som skal gifte seg?");
      }
      break;

    // ---------------- SCENE 3 ----------------
    case 3:
      if (val.toLowerCase() === "skjåk") {
        story.innerText =
`Ja... jeg har hørt om dette stedet.

Første oppgave starter nå.`;

        state.scene = 4;
      } else {
        showHint("Hvor kommer Gudrun og Jens fra?");
      }
      break;

    // ---------------- SCENE 4 (PLACEHOLDER) ----------------
    case 4:
      story.innerText = "OPPGAVE 1 (din historie her)";
      state.scene = 5;
      break;

    // ---------------- SCENE 5 ----------------
    case 5:
      story.innerText = "OPPGAVE 2 (din historie her)";
      state.scene = 6;
      break;

    // ---------------- SCENE 6 ----------------
    case 6:
      story.innerText = "OPPGAVE 3 (din historie her)";
      state.scene = 7;
      break;

    // ---------------- SCENE 7 (MÅL) ----------------
    case 7:
      story.innerText = "MÅL (din finale her)";
      break;
  }
}

// ---------------- HELPERS ----------------

function isWedding(val) {
  const a = val.toLowerCase();
  return (
    (a.includes("jens") && a.includes("gudrun")) ||
    (a.includes("gudrun") && a.includes("jens"))
  );
}

function showHint(text) {
  state.hints++;
  story.innerHTML += `\n\n💡 HINT: ${text}`;
}
