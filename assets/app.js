// Duolinglight v3 — More questions, more themes, clearer listening, better TTS, success sound
// © 2025 MIT License
(function(){
'use strict';

// ---- Config (longer lessons by default) ----
const DEFAULT_LESSON_SIZE = 15;
const DEFAULT_PRACTICE_SIZE = 18;

// ---- Question builders ----
function qTranslate({src, prompt, tgt, answer}){ return {type:'translate', src, prompt, tgt, answer}; }
function qMC({prompt, options, answer}){ return {type:'mc', prompt, options, answer}; }
function qFill({text, gap}){ return {type:'fill', text, gap}; }
function qListen({tgt, text, phon}){ return {type:'listen', tgt, text, phon}; }

// ---- Curriculum (Beginner A0/A1 + Everyday + Travel + Work + IT) ----
// Keep items compact but plenty. Each skill ~12-20 items. We'll slice per session.
const DATA = [
  { id:"a0", title:"Starter A0", emoji:"🧩", description:"Alphabet, bonjour, je m’appelle", skills:[
    { id:"a0s1", title:"Bonjour & se présenter", items:[
      qTranslate({src:"fr", prompt:"Bonjour.", tgt:"en", answer:["Hello.","Hello"]}),
      qTranslate({src:"fr", prompt:"Salut !", tgt:"en", answer:["Hi!","Hi"]}),
      qTranslate({src:"fr", prompt:"Je m’appelle Marie.", tgt:"en", answer:["My name is Marie.","I'm Marie."]}),
      qTranslate({src:"fr", prompt:"Comment tu t’appelles ?", tgt:"en", answer:["What's your name?","What is your name?"]}),
      qTranslate({src:"fr", prompt:"Ravi de te rencontrer.", tgt:"en", answer:["Nice to meet you.","Pleased to meet you."]}),
      qFill({text:"Nice [to] meet you", gap:"to"}),
      qMC({prompt:"Traduire « Enchanté. »", options:["Nice to meet you.","Thank you.","See you."], answer:"Nice to meet you."}),
      qListen({tgt:"en", text:"Hello, I'm Anna.", phon:"heh-loh, aim a-na"}),
      qListen({tgt:"en", text:"What's your name?", phon:"wots your neim"}),
      qTranslate({src:"fr", prompt:"Merci.", tgt:"en", answer:["Thank you.","Thanks."]}),
      qTranslate({src:"fr", prompt:"S'il te plaît.", tgt:"en", answer:["Please.","Please"]}),
      qMC({prompt:"Traduire « Merci. »", options:["Hello.","Thank you.","Goodbye."], answer:"Thank you."})
    ]},
    { id:"a0s2", title:"Être & avoir (présent)", items:[
      qTranslate({src:"fr", prompt:"Je suis français.", tgt:"en", answer:["I am French.","I'm French."]}),
      qTranslate({src:"fr", prompt:"Tu es étudiant.", tgt:"en", answer:["You are a student.","You're a student."]}),
      qTranslate({src:"fr", prompt:"J'ai un chat.", tgt:"en", answer:["I have a cat.","I've got a cat."]}),
      qTranslate({src:"fr", prompt:"Nous sommes prêts.", tgt:"en", answer:["We are ready.","We're ready."]}),
      qFill({text:"I [am] happy", gap:"am"}),
      qFill({text:"She [has] a car", gap:"has"}),
      qMC({prompt:"Forme correcte", options:["He are happy","He is happy","He am happy"], answer:"He is happy"}),
      qListen({tgt:"en", text:"I am tired.", phon:"ai am tai-erd"}),
      qListen({tgt:"en", text:"They are at home.", phon:"dei ar at hohm"}),
      qTranslate({src:"fr", prompt:"Ils ont deux enfants.", tgt:"en", answer:["They have two children.","They've got two children."]})
    ]}
  ]},
  { id:"a1", title:"Basics 1", emoji:"📘", description:"Articles, pluriels, this/that", skills:[
    { id:"a1s1", title:"Articles & pluriels", items:[
      qTranslate({src:"fr", prompt:"Un livre.", tgt:"en", answer:["A book.","One book."]}),
      qTranslate({src:"fr", prompt:"Le livre.", tgt:"en", answer:["The book.","The book"]}),
      qTranslate({src:"fr", prompt:"Des livres.", tgt:"en", answer:["Books.","Some books."]}),
      qFill({text:"An [apple]", gap:"apple"}),
      qMC({prompt:"Pluriel de 'child'", options:["childs","children","childes"], answer:"children"}),
      qTranslate({src:"fr", prompt:"Ce chien est petit.", tgt:"en", answer:["This dog is small.","This dog is little."]}),
      qTranslate({src:"fr", prompt:"Ces chiens sont grands.", tgt:"en", answer:["These dogs are big.","These dogs are large."]}),
      qListen({tgt:"en", text:"This is an apple.", phon:"this iz an ap-l"}),
      qListen({tgt:"en", text:"Those are my keys.", phon:"zohz ar mai kiyz"}),
      qFill({text:"[These] are my friends", gap:"These"}),
      qMC({prompt:"Choisis l'article correct: ___ orange", options:["A","An","The"], answer:"An"})
    ]},
    { id:"a1s2", title:"Verbes courants (présent)", items:[
      qTranslate({src:"fr", prompt:"Je veux un café.", tgt:"en", answer:["I want a coffee.","I want coffee."]}),
      qTranslate({src:"fr", prompt:"Elle aime la musique.", tgt:"en", answer:["She likes music.","She likes the music."]}),
      qFill({text:"We [need] more time", gap:"need"}),
      qFill({text:"He [works] here", gap:"works"}),
      qMC({prompt:"3e personne de 'do'", options:["do","does","dose"], answer:"does"}),
      qListen({tgt:"en", text:"I don't understand.", phon:"ai dont an-der-staend"}),
      qListen({tgt:"en", text:"We need help.", phon:"oui niid help"}),
      qTranslate({src:"fr", prompt:"Ils ne comprennent pas.", tgt:"en", answer:["They don't understand.","They do not understand."]})
    ]}
  ]},
  { id:"everyday", title:"Vie quotidienne", emoji:"🏠", description:"Routines, maison, temps", skills:[
    { id:"evs1", title:"Routines", items:[
      qTranslate({src:"fr", prompt:"Je me réveille à 7h.", tgt:"en", answer:["I wake up at seven.","I wake up at 7."]}),
      qTranslate({src:"fr", prompt:"Je prends le petit-déjeuner.", tgt:"en", answer:["I have breakfast.","I eat breakfast."]}),
      qTranslate({src:"fr", prompt:"Je vais au travail en bus.", tgt:"en", answer:["I go to work by bus.","I take the bus to work."]}),
      qFill({text:"I [wash] my hands", gap:"wash"}),
      qMC({prompt:"Traduire « dîner » (verbe)", options:["to dine","to have dinner","to food"], answer:"to have dinner"}),
      qListen({tgt:"en", text:"I start work at nine.", phon:"ai start werk at nain"}),
      qListen({tgt:"en", text:"She finishes at five.", phon:"shi fini-shiz at faiv"}),
      qTranslate({src:"fr", prompt:"Je rentre à la maison vers 18h.", tgt:"en", answer:["I get home around six p.m.","I go home around 6 p.m."]})
    ]},
    { id:"evs2", title:"Maison & objets", items:[
      qTranslate({src:"fr", prompt:"La porte est ouverte.", tgt:"en", answer:["The door is open.","The door's open."]}),
      qTranslate({src:"fr", prompt:"Éteins la lumière, s'il te plaît.", tgt:"en", answer:["Turn off the light, please.","Switch off the light, please."]}),
      qFill({text:"Open the [window], please", gap:"window"}),
      qMC({prompt:"Traduire « clé »", options:["key","clay","clue"], answer:"key"}),
      qListen({tgt:"en", text:"Where is the remote?", phon:"ouer iz ze ri-moht"}),
      qTranslate({src:"fr", prompt:"Le frigo est vide.", tgt:"en", answer:["The fridge is empty.","The refrigerator is empty."]})
    ]}
  ]},
  { id:"travel", title:"Voyage", emoji:"✈️", description:"Aéroport, hôtel, directions", skills:[
    { id:"trs1", title:"Aéroport & douane", items:[
      qTranslate({src:"fr", prompt:"Où est la porte d’embarquement B12 ?", tgt:"en", answer:["Where is boarding gate B12?","Where is gate B12?"]}),
      qTranslate({src:"fr", prompt:"J’ai une valise et un sac.", tgt:"en", answer:["I have a suitcase and a bag.","I've got a suitcase and a bag."]}),
      qListen({tgt:"en", text:"Passport, please.", phon:"paas-port, pliz"}),
      qMC({prompt:"Traduire « bagage cabine »", options:["hand luggage","big luggage","cabine baggage"], answer:"hand luggage"}),
      qFill({text:"I am [travelling] for work", gap:"travelling"}),
      qListen({tgt:"en", text:"Enjoy your flight.", phon:"en-djoi yor flait"})
    ]},
    { id:"trs2", title:"Hôtel & ville", items:[
      qTranslate({src:"fr", prompt:"J’ai une réservation au nom de Dupont.", tgt:"en", answer:["I have a reservation under the name Dupont.","Reservation under the name Dupont."]}),
      qTranslate({src:"fr", prompt:"Le petit-déjeuner est inclus ?", tgt:"en", answer:["Is breakfast included?","Is the breakfast included?"]}),
      qFill({text:"How much per [night]?", gap:"night"}),
      qListen({tgt:"en", text:"I'd like to check in.", phon:"aid laik to chek in"}),
      qMC({prompt:"Demander son chemin :", options:["Where go street?","Where is the station?","Where I station?"], answer:"Where is the station?"})
    ]}
  ]},
  { id:"work", title:"Anglais au travail", emoji:"💼", description:"Réunions, emails, présentations", skills:[
    { id:"wks1", title:"Réunions", items:[
      qTranslate({src:"fr", prompt:"Peux-tu partager l’écran ?", tgt:"en", answer:["Can you share your screen?","Could you share your screen?"]}),
      qTranslate({src:"fr", prompt:"Désolé pour le retard.", tgt:"en", answer:["Sorry for being late.","Sorry I'm late."]}),
      qMC({prompt:"Poli pour interrompre :", options:["Stop!","May I add something?","Wait."], answer:"May I add something?"}),
      qFill({text:"Let's [start] with the agenda", gap:"start"}),
      qListen({tgt:"en", text:"Could you repeat that, please?", phon:"kud yu ri-pit dat, pliz"})
    ]},
    { id:"wks2", title:"E‑mails & chat", items:[
      qTranslate({src:"fr", prompt:"Veuillez trouver ci-joint le rapport.", tgt:"en", answer:["Please find the report attached.","Please find the attached report."]}),
      qTranslate({src:"fr", prompt:"Je reviens vers vous demain.", tgt:"en", answer:["I'll get back to you tomorrow.","I will get back to you tomorrow."]}),
      qMC({prompt:"Clôture polie :", options:["Regards,","Bye","Kisses"], answer:"Regards,"}),
      qFill({text:"As [discussed], see below", gap:"discussed"}),
      qListen({tgt:"en", text:"Any update on this?", phon:"eni up-deit on this"})
    ]}
  ]},
  { id:"pron", title:"Prononciation", emoji:"🔊", description:"/θ/ TH, R, H, voyelles", skills:[
    { id:"prs1", title:"Le son TH /θ/ /ð/", items:[
      qListen({tgt:"en", text:"Think. Thirty. Thank you.", phon:"thin-k, ther-ti, thank yu"}),
      qListen({tgt:"en", text:"This. That. These. Those.", phon:"dhis, dhat, dhiiz, dhoz"}),
      qMC({prompt:"Quel mot contient /θ/ sourd ?", options:["this","thing","those"], answer:"thing"}),
      qTranslate({src:"fr", prompt:"Merci.", tgt:"en", answer:["Thank you.","Thanks."]}),
      qFill({text:"[These] are great", gap:"These"})
    ]},
    { id:"prs2", title:"R & H", items:[
      qListen({tgt:"en", text:"Red, right, really.", phon:"red, rait, ri-ali"}),
      qListen({tgt:"en", text:"Happy, hello, how are you?", phon:"hapi, heh-loh, hao ar yu"}),
      qMC({prompt:"Quel mot commence par un H muet ?", options:["hour","house","happy"], answer:"hour"}),
      qFill({text:"[Right] here", gap:"Right"})
    ]}
  ]},
  { id:"food", title:"Commander & restaurant", emoji:"🍽️", description:"Menus, commandes, additions", skills:[
    { id:"fds1", title:"Commander", items:[
      qTranslate({src:"fr", prompt:"Je voudrais un café.", tgt:"en", answer:["I'd like a coffee.","I would like a coffee."]}),
      qTranslate({src:"fr", prompt:"Sans sucre, s'il vous plaît.", tgt:"en", answer:["No sugar, please.","Without sugar, please."]}),
      qMC({prompt:"Demander l’addition :", options:["The ticket, please.","The bill, please.","The invoice, please."], answer:"The bill, please."}),
      qFill({text:"A [table] for two", gap:"table"}),
      qListen({tgt:"en", text:"Could I see the menu?", phon:"kud ai si: ze me-nyu"})
    ]},
    { id:"fds2", title:"Allergies & préférences", items:[
      qTranslate({src:"fr", prompt:"Je suis allergique aux noix.", tgt:"en", answer:["I'm allergic to nuts.","I am allergic to nuts."]}),
      qTranslate({src:"fr", prompt:"Sans gluten.", tgt:"en", answer:["Gluten-free.","No gluten."]}),
      qMC({prompt:"Traduire « végétarien »", options:["vegan","vegetarian","vege"], answer:"vegetarian"}),
      qFill({text:"No [ice], please", gap:"ice"})
    ]}
  ]},
  { id:"it", title:"Anglais IT", emoji:"💻", description:"Helpdesk, incidents, cloud", skills:[
    { id:"its1", title:"Helpdesk", items:[
      qTranslate({src:"fr", prompt:"J'ai oublié mon mot de passe.", tgt:"en", answer:["I forgot my password.","I forgot my password"]}),
      qTranslate({src:"fr", prompt:"Mon ordinateur est lent.", tgt:"en", answer:["My computer is slow.","My computer is slow"]}),
      qMC({prompt:"SLA signifie…", options:["Service Level Agreement","System Log Analyzer","Secure Login App"], answer:"Service Level Agreement"}),
      qFill({text:"Please [restart] your PC", gap:"restart"}),
      qListen({tgt:"en", text:"Your ticket has been created.", phon:"yor ti-kit haz bin kri-ei-ted"})
    ]},
    { id:"its2", title:"Incidents & cloud", items:[
      qTranslate({src:"fr", prompt:"C'est un incident P1 (critique).", tgt:"en", answer:["This is a P1 incident (critical).","This is a P1 critical incident."]}),
      qTranslate({src:"fr", prompt:"Nous déployons sur Azure.", tgt:"en", answer:["We are deploying to Azure.","We're deploying to Azure"]}),
      qFill({text:"Health [checks] are failing", gap:"checks"}),
      qListen({tgt:"en", text:"The workaround is in place.", phon:"ze wohrk-around iz in pleis"})
    ]}
  ]}
];

// ---- DOM ----
const el = s => document.querySelector(s);
const els = s => Array.from(document.querySelectorAll(s));
const $profiles = el("#profiles");
const $profilesGrid = el("#profilesGrid");
const $btnAddProfile = el("#btnAddProfile");
const $home = el("#home");
const $who = el("#who");
const $units = el("#units");
const $xp = el("#xp");
const $streak = el("#streak");
const $heartsTop = el("#hearts");
const $kidBadge = el("#kidBadge");
const $btnNew = el("#btnStartNew");
const $btnPractice = el("#btnStartPractice");
const $btnPlacement = el("#btnStartPlacement");
const $btnSwitchProfile = el("#btnSwitchProfile");
const $session = el("#session");
const $card = el("#card");
const $actions = el("#actions");
const $summary = el("#summary");
const $progressBar = el("#progressBar");
const $sessionHearts = el("#sessionHearts");
const $sessionXp = el("#sessionXp");
const $btnExit = el("#btnExit");
const $btnSettings = el("#btnSettings");
const $btnReset = el("#btnReset");
const $modal = el("#modal");
const $modalBody = el("#modalBody");
const $modalTitle = el("#modalTitle");
const $modalOk = el("#modalOk");
const $modalCancel = el("#modalCancel");

// ---- Sounds ----
const sfxOk = new Audio('./assets/success.wav');

// ---- Storage (multi‑profiles) ----
const LS_PROFILES = "dl_profiles_v3_profiles";
const LS_ACTIVE = "dl_profiles_v3_active";
const LS_STATE_PREFIX = "dl_profiles_v3_state:";
const defaultState = {
  xp:0, streak:0, lastDay:null,
  settings:{ dailyGoal:30, lessonSize:DEFAULT_LESSON_SIZE, ttsVoice:null, ttsRate:0.9, ttsPitch:1.0, kidMode:false, sound:true, beginnerListenMC:true, slowListen:true },
  srs:{}, progress:{}, parentPin:null
};
function loadProfiles(){ try{ return JSON.parse(localStorage.getItem(LS_PROFILES))||[]; }catch{ return []; } }
function saveProfiles(p){ localStorage.setItem(LS_PROFILES, JSON.stringify(p)); }
function loadActive(){ return localStorage.getItem(LS_ACTIVE); }
function saveActive(id){ localStorage.setItem(LS_ACTIVE, id||""); }
function stateKey(id){ return LS_STATE_PREFIX + id; }
function loadState(id){ try{ const s=JSON.parse(localStorage.getItem(stateKey(id))); if(!s) return structuredClone(defaultState); return {...structuredClone(defaultState), ...s}; }catch{ return structuredClone(defaultState); } }
function saveState(id, st){ localStorage.setItem(stateKey(id), JSON.stringify(st)); }
let profiles = loadProfiles();
let activeId = loadActive();
let state = null;

// ---- Init ----
renderProfiles();
function renderProfiles(){
  $profiles.classList.remove('hidden');
  $home.classList.add('hidden'); $units.classList.add('hidden'); $summary.classList.add('hidden'); $session.classList.add('hidden');
  $profilesGrid.innerHTML = profiles.map(p=>`
    <div class="profile" data-id="${p.id}">
      <div class="avatar">${escapeHtml(p.emoji||"🙂")}</div>
      <div class="name">${escapeHtml(p.name)}</div>
      <div class="tag">${p.kid?'Mode enfant':'Standard'}</div>
    </div>`).join('');
  els('.profile').forEach(div=>div.addEventListener('click',()=>selectProfile(div.getAttribute('data-id'))));
}
$btnSwitchProfile.addEventListener('click', ()=>renderProfiles());
$btnAddProfile.addEventListener('click', ()=>{
  openModal("Nouveau profil", ()=>{
    const d=document.createElement('div');
    d.innerHTML = `<label class="switch">Nom: <input id="np_name" type="text" maxlength="20" placeholder="Prénom"></label>
    <div style="height:8px"></div>
    <label class="switch">Emoji avatar: <input id="np_emoji" type="text" maxlength="2" placeholder="🙂, 🐯, 🚀"></label>
    <div style="height:8px"></div>
    <label class="switch"><input id="np_kid" type="checkbox"> Mode enfant (QCM, vies infinies)</label>`;
    return d;
  }, ()=>{
    const name = el('#np_name').value.trim()||"Élève";
    const emoji = el('#np_emoji').value.trim()||"🙂";
    const kid = el('#np_kid').checked;
    const id = "p"+Math.random().toString(36).slice(2,8);
    profiles.push({id,name,emoji,kid}); saveProfiles(profiles);
    const st=structuredClone(defaultState); st.settings.kidMode=kid; saveState(id, st);
    selectProfile(id);
  });
});
function selectProfile(id){
  activeId=id; saveActive(id); state=loadState(id);
  tickStreak(); updateHeader();
  $who.textContent = (profiles.find(p=>p.id===id)||{}).name || '';
  $kidBadge.classList.toggle('hidden', !state.settings.kidMode);
  $profiles.classList.add('hidden'); $home.classList.remove('hidden'); renderUnits();
}

// ---- Stats ----
function todayKey(){ return new Date().toISOString().slice(0,10); }
function tickStreak(){
  const day=todayKey(); if(state.lastDay===day) return;
  const y=new Date(Date.now()-86400000).toISOString().slice(0,10);
  state.streak=(state.lastDay===y)?(state.streak+1):(state.xp>0?1:state.streak);
  state.lastDay=day; persist();
}
function updateHeader(){ $xp.textContent=state.xp|0; $streak.textContent=state.streak|0; $heartsTop.textContent = state.settings.kidMode ? "∞" : "❤"; }

// ---- Units ----
function renderUnits(){
  $units.classList.remove('hidden');
  $units.innerHTML='';
  DATA.forEach(unit=> unit.skills.forEach(skill=>{
    const seen=(state.progress[skill.id]?.seen)||0;
    const total=skill.items.length;
    const due=countDue(skill);
    const div=document.createElement('div'); div.className='unit';
    div.innerHTML = `
      <h3>${unit.emoji} ${unit.title} · <small>${skill.title}</small></h3>
      <p>${unit.description}</p>
      <div class="progressbar"><span style="width:${Math.min(100,(seen/total)*100)}%"></span></div>
      <div class="cta-row" style="justify-content:flex-start">
        <button class="btn primary" data-skill="${skill.id}">Commencer (${total} items)</button>
        <button class="btn" data-practice="${skill.id}">Réviser (${due})</button>
      </div>`;
    $units.appendChild(div);
  }));
  els('[data-skill]').forEach(b=>b.addEventListener('click', e=> startLesson(e.target.getAttribute('data-skill')) ));
  els('[data-practice]').forEach(b=>b.addEventListener('click', e=> startPractice(e.target.getAttribute('data-practice')) ));
}
function countDue(skill){
  const now=Date.now();
  return skill.items.filter((_,idx)=>{
    const s=state.srs[itemKey(skill.id,idx)];
    return s && s.due<=now;
  }).length;
}

// ---- Sessions ----
let session=null;
$btnNew.addEventListener('click', ()=> startLesson(DATA[0].skills[0].id));
$btnPractice.addEventListener('click', ()=> startPractice(DATA[0].skills[0].id));
$btnPlacement.addEventListener('click', startPlacement);
$btnExit.addEventListener('click', closeSession);

function startLesson(skillId){
  const skill=findSkill(skillId);
  const items=skill.items.slice();
  const seen=(state.progress[skillId]?.seen)||0;
  const chunk = state.settings.lessonSize || DEFAULT_LESSON_SIZE;
  const fresh=items.slice(seen, seen+chunk);
  const review=items.slice(0, seen).filter((_,i)=>isDue(skillId,i)).sort(()=>Math.random()-0.5).slice(0, Math.min(6, seen));
  const questions=shuffle([...fresh, ...review]).slice(0, chunk+Math.min(5, review.length)).map(it=>({skillId, idx:indexOfItem(skill,it), it}));
  runSession({mode:'lesson', questions});
}
function startPractice(skillId){
  const skill=findSkill(skillId);
  const due=skill.items.map((it,i)=>({it,i,meta:state.srs[itemKey(skillId,i)]})).filter(x=>x.meta && x.meta.due<=Date.now());
  const filler=skill.items.map((it,i)=>({it,i})).sort(()=>Math.random()-0.5).slice(0, DEFAULT_PRACTICE_SIZE-due.length);
  const pick=shuffle([...due, ...filler]).slice(0, DEFAULT_PRACTICE_SIZE);
  const questions=pick.map(x=>({skillId, idx:x.i, it:x.it}));
  runSession({mode:'practice', questions});
}
function startPlacement(){
  const pool=[]; DATA.forEach(u=>u.skills.forEach(s=> s.items.slice(0,3).forEach((it,idx)=>pool.push({skillId:s.id, idx, it})) ));
  runSession({mode:'placement', questions: shuffle(pool).slice(0,18)});
}
function runSession({mode,questions}){
  session={mode,questions,i:0,hearts: state.settings.kidMode? Infinity: 5, xp:0, answers:[]};
  el('.hero')?.classList.add('hidden'); $units.classList.add('hidden'); $summary.classList.add('hidden'); $session.classList.remove('hidden'); step();
}
function step(){
  const total=session.questions.length;
  $progressBar.style.width=((session.i)/total*100)+'%';
  $sessionHearts.textContent=`${session.hearts===Infinity?'∞':session.hearts} ❤`;
  $sessionXp.textContent=`${session.xp} XP`;
  $actions.innerHTML='';
  if(session.i>=total) return endSession();
  renderQuestion(session.questions[session.i]);
}
function endSession(){
  $session.classList.add('hidden');
  const gained=session.xp;
  state.xp += gained; state.lastDay=todayKey(); persist();
  $summary.innerHTML = `<div class="card"><h2>Session terminée</h2><p>Mode: <strong>${session.mode}</strong> • XP gagné: <strong>${gained}</strong></p><div class="actions"><button class="btn primary" id="sumHome">Accueil</button><button class="btn" id="sumAgain">Refaire</button></div></div>`;
  $summary.classList.remove('hidden');
  el('#sumHome').addEventListener('click', closeSession);
  el('#sumAgain').addEventListener('click', ()=>{ $summary.classList.add('hidden'); $units.classList.add('hidden'); $session.classList.remove('hidden'); session.i=0; session.hearts= state.settings.kidMode? Infinity:5; session.xp=0; session.answers=[]; step(); });
  renderUnits();
}
function closeSession(){ $session.classList.add('hidden'); $summary.classList.add('hidden'); el('.hero')?.classList.remove('hidden'); $units.classList.remove('hidden'); }

// ---- Render questions ----
function renderQuestion(q){
  const it=q.it; const kid=state.settings.kidMode;
  const btnCheck=button('Vérifier','primary'); const btnSkip=button('Passer');
  $actions.append(btnSkip,btnCheck);
  let inputEl=null, selected=null;

  const MC=(prompt, options, answerHTML, isCorrect)=>{
    $card.innerHTML = `<h2>Choisis la bonne réponse</h2><div class="prompt">${escapeHtml(prompt)}</div>
      <div class="choices">${options.map(o=>`<div class="choice" data-v="${escapeAttr(o)}">${escapeHtml(o)}</div>`).join('')}</div>`;
    els('.choice').forEach(c=>c.addEventListener('click',()=>{ els('.choice').forEach(x=>x.classList.remove('selected')); c.classList.add('selected'); selected=c.getAttribute('data-v'); }));
    btnCheck.addEventListener('click', ()=>{ if(!selected) return pulse($actions); const ok=isCorrect(selected); finish(ok, answerHTML); });
  };

  if(it.type==='translate' && !kid){
    $card.innerHTML=`<h2>Traduire en ${it.tgt.toUpperCase()}</h2><div class="prompt">${escapeHtml(it.prompt)}</div>
      <div class="field"><input id="answer" type="text" placeholder="Écris ta réponse…"/></div><div class="small">Astuce: <kbd>Entrée</kbd> pour valider</div>`;
    inputEl=el('#answer'); inputEl.addEventListener('keydown',e=>{ if(e.key==='Enter') btnCheck.click(); });
    btnCheck.addEventListener('click', ()=>{ const ok=validateFree(inputEl.value,it.answer); finish(ok, explainCorr(it.answer)); });
  }
  else if(it.type==='translate' && kid){
    const correct = displayAnswer(it.answer);
    const options=buildDistractors(correct);
    MC('Traduction ?', options, `Réponse: <strong>${escapeHtml(correct)}</strong>`, val=>norm(val)===norm(correct));
  }
  else if(it.type==='mc'){
    const options=shuffle(it.options.slice());
    MC(it.prompt, options, `Réponse: <strong>${escapeHtml(it.answer)}</strong>`, val=>norm(val)===norm(it.answer));
  }
  else if(it.type==='fill' && !kid){
    const parts=it.text.split('['); const mid=parts[1].split(']')[0]; const after=it.text.split(']')[1]||''; const before=parts[0];
    const options=shuffle(unique([mid, mid.toUpperCase(), mid.toLowerCase(), mid+'s']));
    $card.innerHTML=`<h2>Complète</h2><div class="prompt">${escapeHtml(before)} <strong>_____</strong> ${escapeHtml(after)}</div><div class="choices">${options.map(o=>`<div class="choice" data-v="${escapeAttr(o)}">${escapeHtml(o)}</div>`).join('')}</div>`;
    els('.choice').forEach(c=>c.addEventListener('click',()=>{ els('.choice').forEach(x=>x.classList.remove('selected')); c.classList.add('selected'); selected=c.getAttribute('data-v'); }));
    btnCheck.addEventListener('click', ()=>{ if(!selected) return pulse($actions); const ok=norm(selected)===norm(it.gap); finish(ok, `Il fallait: <strong>${escapeHtml(it.gap)}</strong>`); });
  }
  else if(it.type==='fill' && kid){
    const ans=it.gap; const options=buildDistractors(ans,true);
    MC('Complète :', options, `Il fallait: <strong>${escapeHtml(ans)}</strong>`, val=>norm(val)===norm(ans));
  }
  else if(it.type==='listen'){
    const showPhonBtn = it.phon ? `<button class="btn" id="btnPhon">🔎 Aide phonétique</button>` : '';
    if (kid || state.settings.beginnerListenMC){
      const correct = it.text;
      const options=buildDistractors(correct);
      $card.innerHTML = `<h2>Écoute et choisis</h2>
        <div class="prompt">
          <button class="btn" id="btnSpeak">🔊 Écouter</button>
          <button class="btn" id="btnSpeakSlow">🐢 Lent</button>
          ${showPhonBtn}
        </div>
        <div class="choices">${options.map(o=>`<div class="choice" data-v="${escapeAttr(o)}">${escapeHtml(o)}</div>`).join('')}</div>`;
      bindListening(it);
      els('.choice').forEach(c=>c.addEventListener('click',()=>{ els('.choice').forEach(x=>x.classList.remove('selected')); c.classList.add('selected'); selected=c.getAttribute('data-v'); }));
      btnCheck.addEventListener('click',()=>{ if(!selected) return pulse($actions); const ok=norm(selected)===norm(correct); finish(ok, `C'était: <strong>${escapeHtml(correct)}</strong>`); });
    } else {
      $card.innerHTML = `<h2>Écoute et écris</h2>
        <div class="prompt">
          <button class="btn" id="btnSpeak">🔊 Écouter</button>
          <button class="btn" id="btnSpeakSlow">🐢 Lent</button>
          ${showPhonBtn}
        </div>
        <div class="field"><input id="answer" type="text" placeholder="Tape ce que tu entends…"/></div>`;
      bindListening(it);
      const inputEl = el('#answer');
      btnCheck.addEventListener('click', ()=>{ const ok = norm(inputEl.value)===norm(it.text); finish(ok, `C'était: <strong>${escapeHtml(it.text)}</strong>`); });
    }
  }

  btnSkip.addEventListener('click', ()=> finish(false, 'Passé.'));

  function bindListening(it){
    el('#btnSpeak')?.addEventListener('click', ()=> speak(it.text, state.settings.ttsRate, state.settings.ttsPitch) );
    el('#btnSpeakSlow')?.addEventListener('click', ()=> speak(it.text, Math.max(0.6, state.settings.ttsRate-0.2), state.settings.ttsPitch) );
    el('#btnPhon')?.addEventListener('click', ()=>{
      const tip=document.createElement('div'); tip.className='feedback ok';
      tip.innerHTML = `Indice prononciation: <em>${escapeHtml(it.phon||'—')}</em>`;
      $card.appendChild(tip);
    });
  }

  function finish(ok, explain){
    // SFX on success
    if (ok && state.settings.sound){ try{ sfxOk.currentTime=0; sfxOk.play().catch(()=>{});}catch(e){} }
    feedback(ok, explain);
    updateSrs(q.skillId, q.idx, ok || state.settings.kidMode);
    if(ok || state.settings.kidMode){ bumpProgress(q.skillId); session.xp+=5; }
    else { session.hearts-=1; if(session.hearts<=0){ session.i=session.questions.length; return setTimeout(step,800); } }
    session.answers.push({ok,explain});
    session.i++; setTimeout(step,800);
  }
}

// ---- Utils ----
function displayAnswer(a){ return Array.isArray(a)? a[0]: a; }
function findSkill(skillId){ for(const u of DATA){ const s=u.skills.find(x=>x.id===skillId); if(s) return s; } throw new Error('Skill not found: '+skillId); }
function indexOfItem(skill,item){ return skill.items.indexOf(item); }
function button(label,variant){ const b=document.createElement('button'); b.className='btn'+(variant?(' '+variant):''); b.textContent=label; return b; }
function shuffle(a){ const arr=a.slice(); for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }
function unique(a){ return Array.from(new Set(a)); }
function norm(s){ return (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[“”"'.!?;:,()]/g,'').replace(/\s+/g,' ').trim(); }
function validateFree(input, answers){ if(!input) return false; const n=norm(input); const arr=Array.isArray(answers)?answers:[answers]; return arr.some(a=>norm(a)===n); }
function explainCorr(ans){ const a=displayAnswer(ans); return 'Réponse attendue: <strong>'+escapeHtml(a)+'</strong>'; }
function escapeHtml(s){ return (s||'').toString().replace(/[&<>\"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m])); }
function escapeAttr(s){ return escapeHtml(s).replace(/\"/g,'&quot;'); }
function pulse(node){ node.animate([{transform:'scale(1)'},{transform:'scale(1.02)'},{transform:'scale(1)'}],{duration:180}); }

// ---- SRS ----
const intervals=[0,1,2,4,8,16];
function itemKey(skillId,idx){ return skillId+'#'+idx; }
function days(d){ return d*86400000; }
function updateSrs(skillId,idx,ok){
  const key=itemKey(skillId,idx);
  const cur=state.srs[key]||{box:1,last:Date.now(),due:Date.now()};
  let box=cur.box; box = ok? Math.min(5,box+1) : Math.max(1,box-1);
  const due=Date.now()+days(intervals[box]);
  state.srs[key]={box,last:Date.now(),due}; persist();
}
function isDue(skillId,idx){ const s=state.srs[itemKey(skillId,idx)]; return s ? (s.due<=Date.now()) : false; }
function bumpProgress(skillId){
  const skill=findSkill(skillId);
  const p=state.progress[skillId]||{seen:0,total:skill.items.length};
  p.seen=Math.min(skill.items.length, p.seen+1);
  p.total=skill.items.length;
  state.progress[skillId]=p; persist();
}
function persist(){ saveState(activeId, state); }

// ---- TTS with better control ----
function speak(text, rate, pitch){
  try{
    const u=new SpeechSynthesisUtterance(text);
    u.lang = guessVoiceLocale();
    u.rate = rate || (state?.settings?.ttsRate || 0.9);
    u.pitch = pitch || (state?.settings?.ttsPitch || 1.0);
    const preferred = findPreferredVoice(state?.settings?.ttsVoice);
    if (preferred) u.voice = preferred;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }catch(e){ console.warn(e); }
}
function guessVoiceLocale(){
  // Try UK first for clarté, fallback US
  const vs=speechSynthesis.getVoices();
  const uk=vs.find(v=>/en-GB|UK English/i.test(v.name+v.lang));
  const us=vs.find(v=>/en-US|US English/i.test(v.name+v.lang));
  return uk? 'en-GB' : (us? 'en-US':'en');
}
function findPreferredVoice(name){
  const vs=speechSynthesis.getVoices();
  if (name){ const v=vs.find(v=>v.name===name); if(v) return v; }
  // Good defaults if available
  const prefer = [/Google UK English Female/i,/Google US English/i,/Samantha/i,/Daniel/i,/Victoria/i,/Alex/i];
  for (const rx of prefer){ const v=vs.find(v=> rx.test(v.name) ); if(v) return v; }
  return null;
}

// ---- Settings & PIN ----
$btnSettings.addEventListener('click', ()=>{
  if(!activeId) return;
  const kid=state.settings.kidMode;
  if (kid) requireParentGate(()=> openSettingsModal()); else openSettingsModal();
});
$btnReset.addEventListener('click', ()=>{
  if(!activeId) return;
  requireParentGate(()=>{
    state=structuredClone(defaultState); saveState(activeId,state); updateHeader(); renderUnits(); $kidBadge.classList.add('hidden');
  });
});
function requireParentGate(okCb){
  const pinSet=!!state.parentPin;
  openModal(pinSet?'Entrer le PIN parent':'Définir un PIN parent', ()=>{
    const d=document.createElement('div');
    d.innerHTML = `<label class="switch">PIN (4 chiffres): <input id="pin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4"></label>`;
    return d;
  }, ()=>{
    const pin=el('#pin').value.trim(); if(!/^\d{4}$/.test(pin)) return;
    if(!pinSet){ state.parentPin=pin; persist(); okCb(); } else if(pin===state.parentPin) okCb();
  });
}
function openSettingsModal(){ openModal('Réglages', renderSettings, applySettings); }
function renderSettings(){
  const w=document.createElement('div');
  const voices=speechSynthesis.getVoices().filter(v=>v.lang.startsWith('en'));
  w.innerHTML = `
    <label class="switch">Objectif quotidien (XP): <input type="number" id="inpGoal" min="5" max="300" step="5" value="${state.settings.dailyGoal}"></label>
    <div style="height:10px"></div>
    <label class="switch">Taille des leçons (questions): <input type="number" id="inpLen" min="10" max="30" step="1" value="${state.settings.lessonSize}"></label>
    <div style="height:10px"></div>
    <label class="switch">Voix TTS: <select id="inpVoice">${['(défaut)',...voices.map(v=>v.name)].map(n=>`<option ${n===state.settings.ttsVoice?'selected':''}>${n}</option>`).join('')}</select></label>
    <div style="height:10px"></div>
    <label class="switch">Vitesse (0.6–1.2): <input type="number" id="inpRate" min="0.6" max="1.2" step="0.05" value="${state.settings.ttsRate}"></label>
    <div style="height:10px"></div>
    <label class="switch">Hauteur (0.6–1.4): <input type="number" id="inpPitch" min="0.6" max="1.4" step="0.1" value="${state.settings.ttsPitch}"></label>
    <div style="height:10px"></div>
    <label class="switch"><input id="inpBeginnerMC" type="checkbox" ${state.settings.beginnerListenMC?'checked':''}> Écoute facile (QCM au lieu de saisie)</label>
    <div style="height:10px"></div>
    <label class="switch"><input id="inpSlow" type="checkbox" ${state.settings.slowListen?'checked':''}> Bouton « lecture lente »</label>
    <div style="height:10px"></div>
    <label class="switch"><input id="inpSound" type="checkbox" ${state.settings.sound?'checked':''}> Sons de réussite</label>
    <p class="small">Astuce: essaye les voix <em>Google UK English Female</em>, <em>Daniel</em> (UK) ou <em>Samantha</em> (US) si disponibles.</p>`;
  speechSynthesis.onvoiceschanged = ()=>{
    const vs=speechSynthesis.getVoices().filter(v=>v.lang.startsWith('en'));
    const sel=w.querySelector('#inpVoice'); const cur=sel.value;
    sel.innerHTML = ['(défaut)',...vs.map(v=>v.name)].map(n=>`<option ${n===cur?'selected':''}>${n}</option>`).join('');
  };
  return w;
}
function applySettings(){
  const goal=parseInt(el('#inpGoal').value,10)||30;
  let voice=el('#inpVoice').value; if(voice==='(défaut)') voice=null;
  const rate=Math.min(1.2, Math.max(0.6, parseFloat(el('#inpRate').value)||0.9));
  const pitch=Math.min(1.4, Math.max(0.6, parseFloat(el('#inpPitch').value)||1.0));
  const len=Math.min(30, Math.max(10, parseInt(el('#inpLen').value,10)||DEFAULT_LESSON_SIZE));
  state.settings.dailyGoal=goal; state.settings.ttsVoice=voice; state.settings.ttsRate=rate; state.settings.ttsPitch=pitch; state.settings.lessonSize=len;
  state.settings.beginnerListenMC = el('#inpBeginnerMC').checked;
  state.settings.slowListen = el('#inpSlow').checked;
  state.settings.sound = el('#inpSound').checked;
  $kidBadge.classList.toggle('hidden', !state.settings.kidMode);
  persist();
}

// ---- Modal ----
function openModal(title, renderBody, onOk){
  $modalTitle.textContent=title; $modalBody.innerHTML=''; $modalBody.appendChild(renderBody());
  $modal.classList.remove('hidden');
  const close=()=> $modal.classList.add('hidden');
  const ok=()=>{ onOk(); close(); };
  $modalOk.onclick=ok; $modalCancel.onclick=close;
}

})();