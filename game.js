/* ══════════════════════════════════════════
   Escape from Chateau Maulmont – game.js
   Languages: no / en / fr
══════════════════════════════════════════ */

const SHEET_URL = "https://script.google.com/macros/s/AKfycbxtvbDjAO1hwbxGwwzIKYgPgZ3GsZwzLO4RjfpmK6DQVmOOioCN2aa93vG4rU32wZpZ/exec";

let lang        = 'no';
let playerName  = sessionStorage.getItem('maulmont_name') || '';
let currentScene= parseInt(sessionStorage.getItem('maulmont_scene') || '0');
let hintIndex   = 0;
let skipped     = 0;   // number of scenes skipped
let startTime   = parseInt(sessionStorage.getItem('maulmont_start') || Date.now());
sessionStorage.setItem('maulmont_start', startTime);

/* ══════════════════════════════════════════
   SCENE DATA
══════════════════════════════════════════ */
const script = {
  no: [
    { renaud:"img/renaud0.png", cls:"",
      text:"Bienvenue, étranger ! Je suis Renaud de Vichy, le plus grand Templier de tous les temps. Mais vous ne comprenez peut-être pas ce que je dis, quelle langue parlez-vous ?",
      answers:["_lang_"], hints:[] },
    { renaud:"img/renaud1.png", cls:"",
      text:"Velkommen til mitt slott, jeg heter Renaud de Vichy! Jeg døde i 1256, men før den tid var jeg tempelridder i Jerusalem, og grunnla min residens her kort tid før jeg døde.\n\nHeldigvis er ikke døden slutten, og jeg lever videre som et spøkelse.\n\nMen hvem er dere? (SKRIV NAVNET DERES)",
      answers:["_name_"], hints:[] },
    { renaud:"img/renaud2.png", cls:"flip",
      text:"Hei {name}, det var hyggelig. Men hvorfor er dere her hos et gammelt spøkelse, som bare vil hvile i fred — er det kanskje noen som skal gifte seg?\n\nHva er navnet på disse barbarene?",
      answers:["_wedding_"], hints:["Hva heter de som skal gifte seg?","Det er to navn — ett mannsnavn og ett kvinnenavn."] },
    { renaud:"img/renaud3.png", cls:"",
      text:"Gudrun og Jens ja, barbarer slik jeg trodde — det kunne ikke vært Pierre, eller Louis, eller Michelle eller Edith eller lignende.\n\nHvor er det disse hedningene kommer fra da?",
      answers:["skjåk","skjaak"], hints:["Hva heter stedet Gudrun og Jens kommer fra?","Det er et sted i Oppland."] },
    { renaud:"img/renaud4.png", cls:"",
      text:"Ja, jeg har snakket med en annen helligmann — Olav den Hellig var det vel. Det er synd å brenne så fager ei bygd, skal han ha sagt om Skjåk. Vel vel, biensur og nok om det.\n\nJeg har helt glemt rustningen min, kan dere si meg hvor jeg har lagt den?",
      answers:["resepsjonen","resepsjon","foajeen","inngangen"], hints:["Hva heter dette rommet i hotellverden?","Det er stedet du sjekker inn når du ankommer et hotell."] },
    { renaud:"img/renaud5.png", cls:"flip",
      text:"Der var den ja, den er grei å ha når jeg skal ut i krigen. Nå som dere har funnet rustningen min, kan dere sjekke dybden på bassenget for meg — om det er for dypt kan jeg ikke bade med rustningen.\n\nHvor mange meter dypt er bassenget?",
      answers:["1.5","1.50","1,50","150 cm","150cm","1,5"], hints:["Svaret er et tall i meter.","Det er ikke veldig dypt."] },
    { renaud:"img/renaud6.png", cls:"",
      text:"Oi, det var jammen flaks — da kan jeg jo bade uten å drukne! Med mindre jeg faller, men det har jeg ikke gjort siden den ene gangen i Jerusalem. Huff det var flaut, men tres bon, gråt ikke over spilt vin.\n\nDet er altså slik at noen nordboere vil gifte seg her hos meg. For at de skal få lov til det må dere løse TO oppgaver til. Om ikke vil jeg ule i trærne gjennom bryllupskvelden.\n\nDet finnes et piano i huset. Hvilket merke er dette?",
      answers:["samick"], hints:["Pianoet står i første etasje.","Se etter merkenavnet på selve instrumentet."] },
    { renaud:"img/renaud7.png", cls:"dim",
      text:"Jeg trodde kanskje dere ikke visste hva et piano var, barbariske nordboere som dere stort sett er (med noen unntak!). Jeg elsker pianomusikk, særlig av nyere type. Har dere kanskje hørt om «Für Elise»? Den var det egentlig jeg som skrev først.\n\nNu vel, til slutt — for at dette skal gå veien for brudeparet har jeg en siste oppgave. Hvor mange østers kan man spise før man kreperer, slik tempelridderordenen gjorde ved slaget i Acre i 1291?",
      answers:["1","én","en"], hints:["Det finnes informasjon om dette ved inngangen til slottet.","Svaret er et svært lavt tall."] },
    { renaud:"img/renaud8.png", cls:"",
      text:"Gratulerer til dere, og condoléances til meg — dette blir nok et veldig leven. Dere har løst den store Renaud de Vichys gåter.\n\nJeg trekker meg tilbake i veggen der jeg kom fra.\n\nSpillet er slutt.",
      answers:["_finish_"], hints:[] }
  ],
  en: [
    { renaud:"img/renaud0.png", cls:"",
      text:"Bienvenue, étranger ! Je suis Renaud de Vichy, le plus grand Templier de tous les temps. Mais vous ne comprenez peut-être pas ce que je dis, quelle langue parlez-vous ?",
      answers:["_lang_"], hints:[] },
    { renaud:"img/renaud1.png", cls:"",
      text:"Welcome to my castle! My name is Renaud de Vichy. I died in 1256, but before that I was a Knights Templar in Jerusalem, and founded my residence here shortly before my death.\n\nFortunately, death is not the end, and I live on as a ghost.\n\nBut who are you? (WRITE YOUR NAME)",
      answers:["_name_"], hints:[] },
    { renaud:"img/renaud2.png", cls:"flip",
      text:"Hello {name}, how delightful. But why are you here visiting an old ghost who only wishes to rest in peace — could it be that someone is getting married?\n\nWhat are the names of these barbarians?",
      answers:["_wedding_"], hints:["What are the names of the couple getting married?","Two names — one male, one female."] },
    { renaud:"img/renaud3.png", cls:"",
      text:"Gudrun and Jens — barbarians, just as I suspected. It couldn't have been Pierre, or Louis, or Michelle or Edith or anything civilised.\n\nAnd where exactly do these heathens come from?",
      answers:["skjåk","skjaak"], hints:["What is the name of the place where Gudrun and Jens come from?","It is a place in the Oppland region of Norway."] },
    { renaud:"img/renaud4.png", cls:"",
      text:"Yes, I once spoke with another holy man — Olav the Holy, it was. 'What a shame to burn so fair a village,' he said of Skjåk. Well, biensur, enough of that.\n\nI have completely forgotten where I left my armour — could you tell me where it is?",
      answers:["reception","the reception","lobby","the lobby","entrance","the entrance"], hints:["What do hotels call this room?","It is where you check in when you arrive at a hotel."] },
    { renaud:"img/renaud5.png", cls:"flip",
      text:"There it is — very handy when heading off to war. Now that you have found my armour, could you check the depth of the swimming pool for me? If it is too deep, I cannot bathe with my armour on.\n\nHow many metres deep is the pool?",
      answers:["1.5","1.50","150 cm","150cm","1,5","1,50"], hints:["The answer is a number in metres.","It is not very deep."] },
    { renaud:"img/renaud6.png", cls:"",
      text:"Oh, what luck — I can bathe without drowning! Unless I fall, but that hasn't happened since that one time in Jerusalem. How embarrassing. Tres bon, no use crying over spilt wine.\n\nSo — some northerners wish to marry here at my castle. For me to allow it, you must solve TWO more tasks. Otherwise I shall howl through the trees all wedding night.\n\nThere is a piano in the house. What is its brand?",
      answers:["samick"], hints:["The piano is on the ground floor.","Look for the brand name on the instrument itself."] },
    { renaud:"img/renaud7.png", cls:"dim",
      text:"I rather thought you might not know what a piano was, barbaric northerners that you mostly are (with some exceptions!). I adore piano music, particularly of the modern variety. Have you perhaps heard of 'Für Elise'? I actually wrote that one first.\n\nNow then, finally — for the sake of the bridal couple, I have one last task. How many oysters can one eat before one perishes, just as the Knights Templar did at the Battle of Acre in 1291?",
      answers:["1","one"], hints:["There is information about this near the entrance of the castle.","The answer is a very low number."] },
    { renaud:"img/renaud8.png", cls:"",
      text:"Congratulations to you, and condolences to me — this will no doubt be quite a racket. You have solved the great Renaud de Vichy's riddles.\n\nI withdraw into the wall from whence I came.\n\nGame over.",
      answers:["_finish_"], hints:[] }
  ],
  fr: [
    { renaud:"img/renaud0.png", cls:"",
      text:"Bienvenue, étranger ! Je suis Renaud de Vichy, le plus grand Templier de tous les temps. Mais vous ne comprenez peut-être pas ce que je dis, quelle langue parlez-vous ?",
      answers:["_lang_"], hints:[] },
    { renaud:"img/renaud1.png", cls:"",
      text:"Bienvenue dans mon château ! Je m'appelle Renaud de Vichy. Je suis mort en 1256, mais avant cela j'étais chevalier templier à Jérusalem, et j'ai fondé ma résidence ici peu avant ma mort.\n\nHeureusement, la mort n'est pas la fin, et je vis toujours en tant que fantôme.\n\nMais qui êtes-vous ? (ÉCRIVEZ VOTRE NOM)",
      answers:["_name_"], hints:[] },
    { renaud:"img/renaud2.png", cls:"flip",
      text:"Bonjour {name}, quel plaisir. Mais pourquoi venez-vous rendre visite à un vieux fantôme qui ne désire que la paix — serait-ce que quelqu'un se marie ?\n\nQuels sont les noms de ces barbares ?",
      answers:["_wedding_"], hints:["Quels sont les noms des mariés ?","Deux prénoms — un masculin, un féminin."] },
    { renaud:"img/renaud3.png", cls:"",
      text:"Gudrun et Jens — des barbares, comme je le pensais. Ça ne pouvait pas être Pierre, ou Louis, ou Michelle ou Édith ou quelque chose de civilisé.\n\nEt d'où viennent exactement ces païens ?",
      answers:["skjåk","skjaak"], hints:["Comment s'appelle l'endroit d'où viennent Gudrun et Jens ?","C'est un endroit dans la région d'Oppland en Norvège."] },
    { renaud:"img/renaud4.png", cls:"",
      text:"Oui, j'ai parlé une fois à un autre homme saint — Olav le Saint, c'était lui. « Quel dommage de brûler un si beau village », dit-il à propos de Skjåk. Enfin, biensur, n'en parlons plus.\n\nJ'ai complètement oublié où j'ai laissé mon armure — pourriez-vous me dire où elle est ?",
      answers:["réception","la réception","reception","entrée","hall"], hints:["Comment appelle-t-on cette pièce dans un hôtel ?","C'est là où vous vous enregistrez à votre arrivée."] },
    { renaud:"img/renaud5.png", cls:"flip",
      text:"La voilà — bien pratique pour partir en guerre. Maintenant que vous avez trouvé mon armure, pourriez-vous vérifier la profondeur de la piscine ? Si elle est trop profonde, je ne peux pas me baigner avec mon armure.\n\nQuelle est la profondeur de la piscine en mètres ?",
      answers:["1.5","1.50","150 cm","150cm","1,5","1,50"], hints:["La réponse est un nombre en mètres.","Ce n'est pas très profond."] },
    { renaud:"img/renaud6.png", cls:"",
      text:"Oh, quelle chance — je peux me baigner sans me noyer ! À moins que je ne tombe, mais ça n'est pas arrivé depuis cette fois à Jérusalem. Quelle honte. Tres bon, inutile de pleurer sur le vin renversé.\n\nDonc — des nordiques souhaitent se marier dans mon château. Pour que je l'autorise, vous devez résoudre DEUX tâches supplémentaires. Sinon, je hurlerai dans les arbres toute la nuit des noces.\n\nIl y a un piano dans la maison. Quelle est sa marque ?",
      answers:["samick"], hints:["Le piano se trouve au rez-de-chaussée.","Cherchez le nom de la marque sur l'instrument lui-même."] },
    { renaud:"img/renaud7.png", cls:"dim",
      text:"Je pensais bien que vous ne sauriez pas ce qu'est un piano, barbares du Nord que vous êtes pour la plupart (avec quelques exceptions !). J'adore la musique de piano, surtout la moderne. Avez-vous entendu parler de « Für Elise » ? C'est moi qui l'ai écrite en premier, en réalité.\n\nBien, enfin — pour le bien des mariés, j'ai une dernière tâche. Combien d'huîtres peut-on manger avant de périr, comme les Templiers lors de la bataille d'Acre en 1291 ?",
      answers:["1","une","un"], hints:["Il y a des informations à ce sujet près de l'entrée du château.","La réponse est un nombre très bas."] },
    { renaud:"img/renaud8.png", cls:"",
      text:"Félicitations à vous, et condoléances à moi — ce sera sans doute un sacré vacarme. Vous avez résolu les énigmes du grand Renaud de Vichy.\n\nJe me retire dans le mur d'où je suis venu.\n\nFin du jeu.",
      answers:["_finish_"], hints:[] }
  ]
};

/* ── UI strings ── */
const ui = {
  no: { submit:"SVAR", hint:"HINT", skip:"HOPP OVER", wrong:"Ikke helt riktig — prøv igjen.", finish:"Avslutt →", placeholder:"Skriv svar...", namePlaceholder:"Skriv navnet ditt...",
        leaderboard:"Resultater", rank:"#", name:"Navn", time:"Tid", skips:"Hopp", loadMore:"Vis flere →" },
  en: { submit:"ANSWER", hint:"HINT", skip:"SKIP", wrong:"Not quite — try again.", finish:"Finish →", placeholder:"Type your answer...", namePlaceholder:"Write your name...",
        leaderboard:"Results", rank:"#", name:"Name", time:"Time", skips:"Skips", loadMore:"Load more →" },
  fr: { submit:"RÉPONDRE", hint:"INDICE", skip:"PASSER", wrong:"Pas tout à fait — réessayez.", finish:"Terminer →", placeholder:"Écrivez votre réponse...", namePlaceholder:"Écrivez votre nom...",
        leaderboard:"Résultats", rank:"#", name:"Nom", time:"Temps", skips:"Sauts", loadMore:"Charger plus →" }
};

/* ── DOM ── */
const story     = document.getElementById('story');
const input     = document.getElementById('input');
const submitBtn = document.getElementById('submitBtn');
const hintBtn   = document.getElementById('hintBtn');
const skipBtn   = document.getElementById('skipBtn');
const renaudImg = document.getElementById('renaudImg');
const langBtns  = document.getElementById('langBtns');

submitBtn.addEventListener('click', handleAnswer);
hintBtn.addEventListener('click', handleHint);
skipBtn.addEventListener('click', handleSkip);
input.addEventListener('keydown', e => { if (e.key === 'Enter') handleAnswer(); });

renderScene();

/* ── RENDER ── */
function renderScene() {
  const scenes = script[lang];
  const s = scenes[currentScene];
  const u = ui[lang];
  const isFinal = s.answers[0] === '_finish_';
  const isName  = s.answers[0] === '_name_';
  const isLang  = s.answers[0] === '_lang_';
  const isSkippable = !isFinal && !isName && !isLang;

  renaudImg.src = s.renaud;
  renaudImg.className = 'fade-in ' + s.cls;
  story.innerText = s.text.replace('{name}', playerName);

  if (isLang) {
    langBtns.style.display  = 'flex';
    input.style.display     = 'none';
    submitBtn.style.display = 'none';
    hintBtn.style.display   = 'none';
    skipBtn.style.display   = 'none';
  } else {
    langBtns.style.display  = 'none';
    input.style.display     = isFinal ? 'none' : '';
    submitBtn.style.display = '';
    hintBtn.style.display   = s.hints.length ? '' : 'none';
    skipBtn.style.display   = isSkippable ? '' : 'none';
    input.placeholder       = isName ? u.namePlaceholder : u.placeholder;
    submitBtn.textContent   = isFinal ? u.finish : u.submit;
    hintBtn.textContent     = u.hint;
    skipBtn.textContent     = u.skip;
  }

  clearFeedback();
  hintIndex = 0;
}

/* ── LANGUAGE SELECT ── */
function selectLang(l) {
  lang = l;
  currentScene = 1;
  sessionStorage.setItem('maulmont_scene', currentScene);
  renderScene();
}

/* ── ANSWER ── */
function handleAnswer() {
  const s   = script[lang][currentScene];
  const val = input.value.trim();

  if (s.answers[0] === '_finish_') { finishGame(); return; }

  if (s.answers[0] === '_name_') {
    if (!val) return;
    playerName = val;
    sessionStorage.setItem('maulmont_name', playerName);
    advance(); return;
  }

  if (s.answers[0] === '_wedding_') {
    const a = val.toLowerCase();
    if (a.includes('jens') && a.includes('gudrun')) { advance(); }
    else { setFeedback(ui[lang].wrong); }
    return;
  }

  const norm = val.toLowerCase().trim().replace(',', '.');
  const correct = s.answers.some(a => norm === a.replace(',', '.') || norm.includes(a));
  if (correct) { advance(); }
  else { setFeedback(ui[lang].wrong); }
}

function advance() {
  input.value = '';
  currentScene++;
  sessionStorage.setItem('maulmont_scene', currentScene);
  renderScene();
}

/* ── SKIP ── */
function handleSkip() {
  const s = script[lang][currentScene];
  if (s.answers[0] === '_finish_' || s.answers[0] === '_name_' || s.answers[0] === '_lang_') return;
  skipped++;
  advance();
}

/* ── HINT ── */
function handleHint() {
  const s = script[lang][currentScene];
  if (!s.hints.length) return;
  const hint = s.hints[Math.min(hintIndex, s.hints.length - 1)];
  hintIndex = Math.min(hintIndex + 1, s.hints.length);
  setFeedback('💡 ' + hint, 'hint');
}

/* ── FEEDBACK ── */
function clearFeedback() {
  story.querySelectorAll('.feedback').forEach(el => el.remove());
}
function setFeedback(text, type = 'wrong') {
  clearFeedback();
  const fb = document.createElement('div');
  fb.className = 'feedback';
  fb.style.marginTop = '12px';
  fb.style.fontStyle = 'italic';
  fb.style.color = type === 'hint' ? '#7a5530' : '#8b0000';
  fb.textContent = (type === 'wrong' ? '✕ ' : '') + text;
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

  input.style.display     = 'none';
  hintBtn.style.display   = 'none';
  skipBtn.style.display   = 'none';
  submitBtn.style.display = 'none';
  langBtns.style.display  = 'none';

  const timeStr = lang === 'fr'
    ? `Temps : <b>${mins}m ${secs}s</b> — Sauts : <b>${skipped}</b>`
    : lang === 'en'
    ? `Time: <b>${mins}m ${secs}s</b> — Skips: <b>${skipped}</b>`
    : `Tid brukt: <b>${mins}m ${secs}s</b> — Hopp: <b>${skipped}</b>`;

  story.innerHTML = `🎉 ${story.innerHTML}<br><br>${timeStr}`;

  sendScore(playerName, elapsed, skipped);
}

/* ── GOOGLE SHEETS: POST score ── */
function sendScore(name, time, skips) {
  fetch(SHEET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player: name, lang: lang, time: time, skipped: skips })
  })
  .then(res => res.text())
  .then(() => loadLeaderboard())
  .catch(() => loadLeaderboard());
}

/* ── GOOGLE SHEETS: GET leaderboard ── */
let lbPage = 0;
const PAGE_SIZE = 10;
let allRows = [];

function loadLeaderboard() {
  const board = document.getElementById('leaderboard');
  board.style.display = 'block';
  const u = ui[lang];
  board.innerHTML = `<div class="lb-title">⚔ ${u.leaderboard} ⚔</div><div class="lb-loading">...</div>`;

  fetch(SHEET_URL)
    .then(res => res.json())
    .then(data => {
      allRows = data;
      lbPage = 0;
      renderLeaderboard();
    })
    .catch(() => {
      board.innerHTML += `<div class="lb-error">Could not load results.</div>`;
    });
}

function renderLeaderboard() {
  const board = document.getElementById('leaderboard');
  const u = ui[lang];
  const start = lbPage * PAGE_SIZE;
  const page  = allRows.slice(start, start + PAGE_SIZE);

  let html = `<div class="lb-title">⚔ ${u.leaderboard} ⚔</div>`;
  html += `<table class="lb-table">
    <thead><tr>
      <th>${u.rank}</th>
      <th>${u.name}</th>
      <th>${u.time}</th>
      <th>${u.skips}</th>
    </tr></thead><tbody>`;

  page.forEach((row, i) => {
    const rank  = start + i + 1;
    const mins  = Math.floor(row.time / 60);
    const secs  = row.time % 60;
    const tStr  = `${mins}m ${String(secs).padStart(2,'0')}s`;
    const isMe  = row.player === playerName;
    html += `<tr class="${isMe ? 'lb-me' : ''}">
      <td>${rank}</td>
      <td>${row.player}</td>
      <td>${tStr}</td>
      <td>${row.skipped ?? 0}</td>
    </tr>`;
  });

  html += `</tbody></table>`;

  if (start + PAGE_SIZE < allRows.length) {
    html += `<button class="lb-more" onclick="lbPage++;renderLeaderboard()">${u.loadMore}</button>`;
  }
  if (lbPage > 0) {
    html += `<button class="lb-more" onclick="lbPage--;renderLeaderboard()">← ${lang === 'fr' ? 'Précédent' : lang === 'en' ? 'Previous' : 'Forrige'}</button>`;
  }

  board.innerHTML = html;
}
