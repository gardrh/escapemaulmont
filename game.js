let state = {
  scene: 0,
  player: "",
  hints: 0,
  lastHint: ""
};

const story = document.getElementById("story");
const input = document.getElementById("input");
const btn = document.getElementById("submitBtn");
const hintBtn = document.getElementById("hintBtn");

btn.onclick = handleInput;
hintBtn.onclick = showHint;

function handleInput() {

  const val = input.value.trim();
  input.value = "";

  switch (state.scene) {

    case 0:
      story.innerText =
`Velkommen til mitt slott, jeg heter Renaud de Vichy!
Jeg døde i 1256, men før den tid var jeg tempelridder i Jerusalem.

Hvem er dere? (SKRIV NAVNET DERES)`;
      state.scene = 1;
      break;

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
        state.lastHint = "Hva heter de som skal gifte seg?";
      }
      break;

    case 3:
      if (val.toLowerCase() === "skjåk") {
        story.innerText =
`Ja... jeg har hørt om dette stedet.

Første oppgave starter nå.`;
        state.scene = 4;
      } else {
        state.lastHint = "Hva heter stedet Gudrun og Jens kommer fra?";
      }
      break;

    case 4:
      story.innerText = "OPPGAVE 1 (din historie her)";
      break;
  }
}

function showHint() {
  if (!state.lastHint) return;
  state.hints++;
  story.innerHTML += `\n\n💡 HINT: ${state.lastHint}`;
}

function isWedding(val) {
  const a = val.toLowerCase();
  return (
    (a.includes("jens") && a.includes("gudrun")) ||
    (a.includes("gudrun") && a.includes("jens"))
  );
}
