/* ══════════════════════════════════════════
   Escape from Chateau Maulmont – game.js
══════════════════════════════════════════ */

/* ── SCENE DATA ── */
const scenes = [
  {
    chapter: "Innledning",
    renaud: { src: "renaud.png", cls: "" },
    text: `Velkommen til mitt slott, jeg heter Renaud de Vichy! Jeg døde i 1256, men før den tid var jeg tempelridder i Jerusalem, og grunnla min residens her kort tid før jeg døde.

Heldigvis er ikke døden slutten, og jeg lever videre som et spøkelse.

Men hvem er dere? (SKRIV NAVNET DERES)`,
    answers: ["_name_"],
    hints: []
  },
  {
    chapter: "Scene 1",
    renaud: { src: "renaud.png", cls: "flip" },
    text: `Hei {name}, det var hyggelig. Men hvorfor er dere her hos et gammelt spøkelse, som bare vil hvile i fred — er det kanskje noen som skal gifte seg?

Hva er navnet på disse barbarene?`,
    answers: ["_wedding_"],
    hints: [
      "Hva heter de som skal gifte seg?",
      "Det er to navn — ett mannsnavn og ett kvinnenavn."
    ]
  },
  {
    chapter: "Scene 2",
    renaud: { src: "renaud.png", cls: "dim" },
    text: `Gudrun og Jens ja, barbarer slik jeg trodde — det kunne ikke vært Pierre, eller Louis, eller Michelle eller Edith eller lignende.

Hvor er det disse hedningene kommer fra da?`,
    answers: ["skjåk", "skjaak"],
    hints: [
      "Hva heter stedet Gudrun og Jens kommer fra?",
      "Det er et sted i Oppland, kjent for natur og tradisjon."
    ]
  },
  {
    chapter: "Scene 3",
    renaud: { src: "renaud.png", cls: "" },
    text: `Ja, jeg har snakket med en annen helligmann — Olav den Hellig var det vel. Det er synd å brenne så fager ei bygd, skal han ha sagt om Skjåk. Vel vel, biensur og nok om det.

Jeg har helt glemt rustningen min, kan dere si meg hvor jeg har lagt den?`,
    answers: ["resepsjonen", "resepsjon"],
    hints: [
      "Hva heter dette rommet i hotellverden?",
      "Det er stedet du sjekker inn når du ankommer et hotell."
    ]
  },
  {
    chapter: "Scene 4",
    renaud: { src: "renaud.png", cls: "flip" },
    text: `Der var den ja, den er grei å ha når jeg skal ut i krigen. Nå som dere har funnet rustningen min, kan dere sjekke dybden på bassenget for meg — om det er for dypt kan jeg ikke bade med rustningen.

Hvor mange meter dypt er bassenget?`,
    answers: ["1.5", "1.50", "1,50", "150 cm", "150cm", "1,5"],
    hints: [
      "Svaret er et tall i meter.",
      "Det er ikke veldig dypt — tenk grunt basseng."
    ]
  },
  {
    chapter: "Scene 5",
    renaud: { src: "renaud.png", cls: "dim" },
    text: `Oi, det var jammen flaks — da kan jeg jo bade uten å drukne! Med mindre jeg faller, men det har jeg ikke gjort siden den ene gangen i Jerusalem. Huff det var flaut, men tres bon, gråt ikke over spilt vin.

Det er altså slik at noen nordboere vil gifte seg her hos meg. For at de skal få lov til det må dere løse TO oppgaver til. Om ikke vil jeg ule i trærne gjennom bryllupskvelden.

Det finnes et piano i huset. Hvilket merke er dette?`,
    answers: ["samick"],
    hints: [
      "Pianoet står i første etasje.",
      "Se etter merkenavnet på selve instrumentet."
    ]
  },
  {
    chapter: "Scene 6",
    renaud: { src: "renaud.png", cls: "" },
    text: `Jeg trodde kanskje dere ikke visste hva et piano var, barbariske nordboere som dere stort sett er (med noen unntak!).

Nu vel, til slutt — for at dette skal gå veien for brudeparet har jeg en siste oppgave.

Hvor mange østers kan man spise før man kreperer, slik tempelridderordenen gjorde ved slaget i Acre i 1291?`,
    answers: ["1", "én", "en"],
    hints: [
      "Det finnes informasjon om dette ved inngangen til slottet.",
      "Svaret er et svært lavt tall."
    ]
  },
  {
    chapter: "Finale",
    renaud: { src: "renaud.png", cls: "ghost" },
    text: `Gratulerer til dere, og condoléances til meg — dette blir nok et veldig leven. Dere har løst den store Renaud de Vichys gåter.

Jeg trekker meg tilbake i veggen der jeg kom fra.`,
    answers: ["_finish_"],
    hints: []
  }
];

/* ── STATE ── */
let currentScene = parseInt(sessionStorage.getItem('maulmont_scene') || '0');
let playerName   = sessionStorage.getItem('maulmont_name') || '';
let hintIndex    = 0;
let startTime    = parseInt(sessionStorage.getItem('maulmont_start') || Date.now());
sessionStorage.setItem('maulmont_start', startTime);

/* ── DOM ── */
const story     = document.getElementById('story');
const input     = document.getElementById('input');
const submitBtn = document.getElementById('submitBtn');
const hintBtn   = document.getElementById('hintBtn');
const renaudImg = document.getElementById('renaudImg');

/* ── INIT ── */
submitBtn.addEventListener('click', handleAnswer);
hintBtn.addEventListener('click', handleHint);
input.addEventListener('keydown', e => { if (e.key === 'Enter') handleAnswer(); });
renderScene();

/* ── RENDER ── */
function renderScene() {
  const s = scenes[currentScene];
  const isFinal = s.answers[0] === '_finish_';
  const isName  = s.answers[0] === '_name_';

  // illustration
  renaudImg.src = s.renaud.src;
  renaudImg.className = 'fade-in ' + s.renaud.cls;

  // text
  story.innerText = s.text.replace('{name}', playerName);

  // input + buttons
  input.style.display     = isFinal ? 'none' : '';
  hintBtn.style.display   = s.hints.length ? '' : 'none';
  input.placeholder       = isName ? 'Skriv navnet ditt...' : 'Skriv svar...';
  submitBtn.textContent   = isFinal ? 'Avslutt →' : 'SVAR';

  clearFeedback();
  hintIndex = 0;
}

/* ── ANSWER ── */
function handleAnswer() {
  const s   = scenes[currentScene];
  const val = input.value.trim();

  if (s.answers[0] === '_finish_') {
    finishGame();
    return;
  }

  if (s.answers[0] === '_name_') {
    if (!val) return;
    playerName = val;
    sessionStorage.setItem('maulmont_name', playerName);
    advance();
    return;
  }

  if (s.answers[0] === '_wedding_') {
    const a = val.toLowerCase();
    if (a.includes('jens') && a.includes('gudrun')) {
      advance();
    } else {
      setFeedback('wrong', '✕', 'Prøv igjen, eller trykk Hint.');
    }
    return;
  }

  const norm = val.toLowerCase().trim().replace(',', '.');
  const correct = s.answers.some(a => norm === a.replace(',', '.'));
  if (correct) {
    advance();
  } else {
    setFeedback('wrong', '✕', 'Ikke helt riktig — prøv igjen, eller trykk Hint.');
  }
}

function advance() {
  input.value = '';
  currentScene++;
  sessionStorage.setItem('maulmont_scene', currentScene);
  renderScene();
}

/* ── HINT ── */
function handleHint() {
  const s = scenes[currentScene];
  if (!s.hints.length) return;
  const hint = s.hints[Math.min(hintIndex, s.hints.length - 1)];
  hintIndex = Math.min(hintIndex + 1, s.hints.length);
  setFeedback('hint', '💡', hint);
}

/* ── FEEDBACK ── */
function clearFeedback() {
  story.querySelectorAll('.feedback').forEach(el => el.remove());
}

function setFeedback(type, icon, text) {
  clearFeedback();
  const fb = document.createElement('div');
  fb.className = 'feedback ' + type;
  fb.style.marginTop = '12px';
  fb.style.fontStyle = 'italic';
  fb.style.color = type === 'wrong' ? '#c00' : '#555';
  fb.textContent = icon + ' ' + text;
  story.appendChild(fb);
}

/* ── FINISH ── */
function finishGame() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  sessionStorage.removeItem('maulmont_scene');
  sessionStorage.removeItem('maulmont_name');
  sessionStorage.removeItem('maulmont_start');

  input.style.display   = 'none';
  hintBtn.style.display = 'none';
  submitBtn.style.display = 'none';

  story.innerHTML = `🎉 <b>Gratulerer!</b> Dere har løst den store Renaud de Vichys gåter.<br><br>
Tid brukt: <b>${mins}m ${secs}s</b><br><br>
Renaud trekker seg tilbake i veggen der han kom fra.<br><br>
<div class="share-row">
  <button class="share-btn share-x"  onclick="shareX()">Del på X</button>
  <button class="share-btn share-fb" onclick="shareFacebook()">Del på Facebook</button>
  <button class="share-btn share-wa" onclick="shareWhatsApp()">Del på WhatsApp</button>
</div>`;

  sendScore(playerName, elapsed);
}

/* ── SHARE ── */
const shareText = 'Jeg løste Escape from Chateau Maulmont! 🏰 Prøv selv!';
function shareX()         { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + ' ' + location.href)}`, '_blank'); }
function shareFacebook()  { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`, '_blank'); }
function shareWhatsApp()  { window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + location.href)}`, '_blank'); }

/* ── GOOGLE SHEETS ── */
function sendScore(playerName, completionTime) {
  fetch("https://script.google.com/macros/s/AKfycbxtvbDjAO1hwbxGwwzIKYgPgZ3GsZwzLO4RjfpmK6DQVmOOioCN2aa93vG4rU32wZpZ/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player: playerName, time: completionTime })
  })
  .then(res => res.text())
  .then(() => { story.innerHTML += `<br><br>✅ Score lagret!`; })
  .catch(() => { story.innerHTML += `<br><br>⚠️ Kunne ikke lagre score.`; });
}
