// Duolinglight Mobile — IT & Business pack (multi-profiles + Kid Mode)
// Minimal but functional runtime
(function(){
'use strict';
function qTranslate(o){o.type='translate';return o}
function qMC(o){o.type='mc';return o}
function qFill(o){o.type='fill';return o}
function qListen(o){o.type='listen';return o}

const DATA = [
  { id:"it1", title:"IT Helpdesk", emoji:"🖥️", description:"Tickets, demandes fréquentes", skills:[
    { id:"it1s1", title:"Demandes courantes", items:[
      qTranslate({src:"fr", prompt:"J'ai oublié mon mot de passe.", tgt:"en", answer:["I forgot my password.","I forgot my password"]}),
      qTranslate({src:"fr", prompt:"Mon ordinateur est lent.", tgt:"en", answer:["My computer is slow.","My computer is slow"]}),
      qMC({prompt:"Choisis la bonne suggestion pour un PC figé.", options:["Please restart your computer","I will ignore it","Delete System32","Unplug the monitor"], answer:"Please restart your computer"}),
      qFill({text:"Please [restart] your PC", gap:"restart"}),
      qListen({tgt:"en", text:"Your ticket has been created."})
    ]}
  ]},
  { id:"biz2", title:"E-mails & Chat", emoji:"✉️", description:"Formules polies, relances", skills:[
    { id:"biz2s1", title:"Politesse", items:[
      qTranslate({src:"fr", prompt:"Pourriez-vous, s'il vous plaît, partager le rapport ?", tgt:"en", answer:["Could you please share the report?","Could you share the report, please?"]}),
      qMC({prompt:"Clôture polie :", options:["Regards,","Bye.","See ya!","Later."], answer:"Regards,"}),
      qListen({tgt:"en", text:"Please find the attachment below."})
    ]}
  ]}
];

// DOM
const el=s=>document.querySelector(s), els=s=>Array.from(document.querySelectorAll(s));
const $profiles=el("#profiles"), $profilesGrid=el("#profilesGrid"), $btnAddProfile=el("#btnAddProfile");
const $home=el("#home"), $who=el("#who"), $units=el("#units"), $xp=el("#xp"), $streak=el("#streak"), $heartsTop=el("#hearts"), $kidBadge=el("#kidBadge");
const $btnNew=el("#btnStartNew"), $btnPractice=el("#btnStartPractice"), $btnPlacement=el("#btnStartPlacement"), $btnSwitchProfile=el("#btnSwitchProfile");
const $session=el("#session"), $card=el("#card"), $actions=el("#actions"), $summary=el("#summary"), $progressBar=el("#progressBar"), $sessionHearts=el("#sessionHearts"), $sessionXp=el("#sessionXp"), $btnExit=el("#btnExit");
const $btnSettings=el("#btnSettings"), $btnReset=el("#btnReset"), $modal=el("#modal"), $modalBody=el("#modalBody"), $modalTitle=el("#modalTitle"), $modalOk=el("#modalOk"), $modalCancel=el("#modalCancel");

// Storage
const LS_PROFILES='dl_profiles_v1', LS_ACTIVE='dl_active_profile_v1', LS_STATE_PREFIX='dl_state_v1:';
const defaultState={xp:0,streak:0,lastDay:null,settings:{dailyGoal:20,ttsVoice:null,haptic:true,kidMode:false},srs:{},progress:{},parentPin:null};
function loadProfiles(){ try{return JSON.parse(localStorage.getItem(LS_PROFILES))||[]}catch{return[]} }
function saveProfiles(p){ localStorage.setItem(LS_PROFILES, JSON.stringify(p)) }
function loadActive(){ return localStorage.getItem(LS_ACTIVE) }
function saveActive(id){ localStorage.setItem(LS_ACTIVE, id||"") }
function stateKey(id){ return LS_STATE_PREFIX+id }
function loadState(id){ try{const s=JSON.parse(localStorage.getItem(stateKey(id))); return s?{...structuredClone(defaultState),...s}:structuredClone(defaultState);}catch{return structuredClone(defaultState)} }
function saveState(id,st){ localStorage.setItem(stateKey(id), JSON.stringify(st)) }

let profiles=loadProfiles(), activeId=loadActive(), state=null;
renderProfiles();

function renderProfiles(){
  $profiles.classList.remove('hidden'); $home.classList.add('hidden'); $units.classList.add('hidden'); $summary.classList.add('hidden'); $session.classList.add('hidden');
  $profilesGrid.innerHTML = profiles.map(p=>`<div class="profile" data-id="${p.id}"><div class="avatar">${(p.emoji||"🙂")}</div><div class="name">${p.name}</div><div class="tag">${p.kid?"Mode enfant":"Standard"}</div></div>`).join('');
  els('.profile').forEach(div=>div.addEventListener('click',()=>selectProfile(div.getAttribute('data-id'))));
}
$btnSwitchProfile.addEventListener('click', ()=>renderProfiles());
$btnAddProfile.addEventListener('click', ()=>{
  openModal("Nouveau profil", ()=>{ const d=document.createElement('div'); d.innerHTML=`<label class="switch">Nom:<input id="np_name" type="text" maxlength="20" placeholder="Prénom"></label><div style="height:8px"></div><label class="switch">Emoji:<input id="np_emoji" type="text" maxlength="2" placeholder="🙂"></label><div style="height:8px"></div><label class="switch"><input id="np_kid" type="checkbox"> Mode enfant</label>`; return d; }, ()=>{
    const name=el('#np_name').value.trim()||"Élève"; const emoji=el('#np_emoji').value.trim()||"🙂"; const kid=el('#np_kid').checked; const id='p'+Math.random().toString(36).slice(2,8);
    profiles.push({id,name,emoji,kid}); saveProfiles(profiles); const st=structuredClone(defaultState); st.settings.kidMode=kid; saveState(id,st); selectProfile(id);
  })
});
function selectProfile(id){ activeId=id; saveActive(id); state=loadState(id); tickStreak(); updateHeader(); $who.textContent=(profiles.find(p=>p.id===id)||{}).name||''; $kidBadge.classList.toggle('hidden', !state.settings.kidMode); $profiles.classList.add('hidden'); $home.classList.remove('hidden'); renderUnits(); }
function todayKey(){ return new Date().toISOString().slice(0,10) }
function tickStreak(){ const d=todayKey(); if(state.lastDay===d) return; const y=new Date(Date.now()-86400000).toISOString().slice(0,10); state.streak=(state.lastDay===y)?(state.streak+1):(state.xp>0?1:state.streak); state.lastDay=d; persist(); }
function updateHeader(){ $xp.textContent=state.xp|0; $streak.textContent=state.streak|0; $heartsTop.textContent = state.settings.kidMode ? "∞" : "❤"; }

function renderUnits(){
  $units.classList.remove('hidden'); $units.innerHTML='';
  DATA.forEach(unit=>unit.skills.forEach(skill=>{
    const seen=(state.progress[skill.id]?.seen)||0, total=skill.items.length, due=countDue(skill);
    const div=document.createElement('div'); div.className='unit';
    div.innerHTML=`<h3>${unit.emoji} ${unit.title} · <small>${skill.title}</small></h3><p>${unit.description}</p><div class="progressbar"><span style="width:${Math.min(100,(seen/total)*100)}%"></span></div><div class="cta-row" style="justify-content:flex-start"><button class="btn primary" data-skill="${skill.id}">Commencer</button><button class="btn" data-practice="${skill.id}">Réviser (${due})</button></div>`;
    $units.appendChild(div);
  }));
  els('[data-skill]').forEach(b=>b.addEventListener('click', e=>startLesson(e.target.getAttribute('data-skill'))));
  els('[data-practice]').forEach(b=>b.addEventListener('click', e=>startPractice(e.target.getAttribute('data-practice'))));
}
function countDue(skill){ const now=Date.now(); return skill.items.filter((_,i)=>{const s=state.srs[itemKey(skill.id,i)]; return s && s.due<=now}).length }

let session=null; $btnNew.addEventListener('click', ()=>startLesson(DATA[0].skills[0].id)); $btnPractice.addEventListener('click', ()=>startPractice(DATA[0].skills[0].id)); $btnPlacement.addEventListener('click', startPlacement); $btnExit.addEventListener('click', closeSession);
function startLesson(skillId){ const skill=findSkill(skillId), items=skill.items.slice(); const seen=(state.progress[skillId]?.seen)||0; const fresh=items.slice(seen,seen+8); const review=items.slice(0,seen).filter((_,i)=>isDue(skillId,i)).sort(()=>Math.random()-0.5).slice(0,4); const questions=shuffle([...fresh,...review]).slice(0,10).map(it=>({skillId,idx:indexOfItem(skill,it),it})); runSession({mode:'lesson',questions}); }
function startPractice(skillId){ const skill=findSkill(skillId); const due=skill.items.map((it,i)=>({it,i,meta:state.srs[itemKey(skillId,i)]})).filter(x=>x.meta && x.meta.due<=Date.now()); const filler=skill.items.map((it,i)=>({it,i})).sort(()=>Math.random()-0.5).slice(0,12-due.length); const pick=shuffle([...due,...filler]).slice(0,12); const questions=pick.map(x=>({skillId,idx:x.i,it:x.it})); runSession({mode:'practice',questions}); }
function startPlacement(){ const pool=[]; DATA.forEach(u=>u.skills.forEach(s=> s.items.slice(0,2).forEach((it,idx)=>pool.push({skillId:s.id,idx,it})) )); runSession({mode:'placement',questions:shuffle(pool).slice(0,12)}); }
function runSession({mode,questions}){ session={mode,questions,i:0,hearts: state.settings.kidMode ? Infinity : 5, xp:0, answers:[]}; el('.hero')?.classList.add('hidden'); $units.classList.add('hidden'); $summary.classList.add('hidden'); $session.classList.remove('hidden'); step(); }
function step(){ const total=session.questions.length; $progressBar.style.width=((session.i)/total*100)+'%'; $sessionHearts.textContent=`${session.hearts===Infinity?'∞':session.hearts} ❤`; $sessionXp.textContent=`${session.xp} XP`; $actions.innerHTML=''; if(session.i>=total) return endSession(); renderQuestion(session.questions[session.i]); }
function endSession(){ $session.classList.add('hidden'); const gained=session.xp; state.xp+=gained; state.lastDay=todayKey(); persist(); $summary.innerHTML=`<div class="card"><h2>Session terminée</h2><p>Mode: <strong>${session.mode}</strong> • XP gagné: <strong>${gained}</strong></p><div class="actions"><button class="btn primary" id="sumHome">Accueil</button><button class="btn" id="sumAgain">Refaire</button></div></div>`; $summary.classList.remove('hidden'); el('#sumHome').addEventListener('click', closeSession); el('#sumAgain').addEventListener('click', ()=>{ $summary.classList.add('hidden'); $units.classList.add('hidden'); $session.classList.remove('hidden'); session.i=0; session.hearts= state.settings.kidMode ? Infinity : 5; session.xp=0; session.answers=[]; step(); }); renderUnits(); }
function closeSession(){ $session.classList.add('hidden'); $summary.classList.add('hidden'); el('.hero')?.classList.remove('hidden'); $units.classList.remove('hidden'); }

function renderQuestion(q){
  const it=q.it, kid=state.settings.kidMode; const btnCheck=button('Vérifier','primary'), btnSkip=button('Passer'); $actions.append(btnSkip,btnCheck);
  let inputEl=null, selected=null;
  const MC=(prompt,options,answerHTML,isCorrect)=>{ $card.innerHTML=`<h2>Choisis la bonne réponse</h2><div class="prompt">${prompt}</div><div class="choices">${options.map(o=>`<div class="choice" data-v="${o}">${o}</div>`).join('')}</div>`; els('.choice').forEach(c=>c.addEventListener('click',()=>{els('.choice').forEach(x=>x.classList.remove('selected')); c.classList.add('selected'); selected=c.getAttribute('data-v'); })); btnCheck.addEventListener('click',()=>{ if(!selected) return; const ok=isCorrect(selected); finish(ok, answerHTML); }); };
  if(it.type==='translate' && !kid){ $card.innerHTML=`<h2>Traduire en ${it.tgt.toUpperCase()}</h2><div class="prompt">${it.prompt}</div><div class="field"><input id="answer" type="text" placeholder="Écris ta réponse…"/></div><div class="small">Astuce: Entrée pour valider</div>`; inputEl=el('#answer'); inputEl.addEventListener('keydown',e=>{if(e.key==='Enter') btnCheck.click()}); btnCheck.addEventListener('click',()=>{ const ok=validateFree(inputEl.value,it.answer); finish(ok, explainCorr(it.answer)); }); }
  else if(it.type==='translate' && kid){ const correct=Array.isArray(it.answer)?it.answer[0]:it.answer; const options=buildDistractors(correct); MC("Traduction ?", options, `Réponse: <strong>${correct}</strong>`, v=>norm(v)===norm(correct)); }
  else if(it.type==='mc'){ const options=shuffle(it.options.slice()); MC(it.prompt, options, `Réponse: <strong>${it.answer}</strong>`, v=>norm(v)===norm(it.answer)); }
  else if(it.type==='fill' && !kid){ const parts=it.text.split('['); const mid=parts[1].split(']')[0]; const after=it.text.split(']')[1]||''; const before=parts[0]; const options=shuffle([mid, mid.toUpperCase(), mid.toLowerCase(), mid+'s']); $card.innerHTML=`<h2>Complète</h2><div class="prompt">${before} <strong>_____</strong> ${after}</div><div class="choices">${options.map(o=>`<div class="choice" data-v="${o}">${o}</div>`).join('')}</div>`; els('.choice').forEach(c=>c.addEventListener('click',()=>{els('.choice').forEach(x=>x.classList.remove('selected')); c.classList.add('selected'); selected=c.getAttribute('data-v'); })); btnCheck.addEventListener('click',()=>{ if(!selected) return; const ok=norm(selected)===norm(it.gap); finish(ok, `Il fallait: <strong>${it.gap}</strong>`); }); }
  else if(it.type==='fill' && kid){ const ans=it.gap; const options=buildDistractors(ans,true); MC("Complète :", options, `Il fallait: <strong>${ans}</strong>`, v=>norm(v)===norm(ans)); }
  else if(it.type==='listen'){ if(kid){ const correct=it.text; const options=buildDistractors(correct); $card.innerHTML=`<h2>Écoute et choisis</h2><div class="prompt"><button class="btn" id="btnSpeak">🔊 Écouter</button></div><div class="choices">${options.map(o=>`<div class="choice" data-v="${o}">${o}</div>`).join('')}</div>`; el('#btnSpeak').addEventListener('click',()=>speak(it.text)); els('.choice').forEach(c=>c.addEventListener('click',()=>{els('.choice').forEach(x=>x.classList.remove('selected')); c.classList.add('selected'); selected=c.getAttribute('data-v'); })); btnCheck.addEventListener('click',()=>{ if(!selected) return; const ok=norm(selected)===norm(correct); finish(ok, `C'était: <strong>${correct}</strong>`); }); } else { $card.innerHTML=`<h2>Écoute et écris</h2><div class="prompt"><button class="btn" id="btnSpeak">🔊 Écouter</button></div><div class="field"><input id="answer" type="text" placeholder="Tape ce que tu entends…"/></div>`; const input=el('#answer'); el('#btnSpeak').addEventListener('click',()=>speak(it.text)); btnCheck.addEventListener('click',()=>{ const ok=norm(input.value)===norm(it.text); finish(ok, `C'était: <strong>${it.text}</strong>`); }); } }
  btnSkip.addEventListener('click', ()=> finish(false, "Passé."));
  function finish(ok, explain){ feedback(ok, explain); updateSrs(q.skillId,q.idx, ok || state.settings.kidMode); if(ok || state.settings.kidMode){ bumpProgress(q.skillId); session.xp+=5; } else { session.hearts-=1; if(session.hearts<=0){ session.i=session.questions.length; return setTimeout(step,800); } } session.answers.push({ok,explain}); session.i++; setTimeout(step,800); }
}

function buildDistractors(correct,short){ const pool=collectAnswers(); const set=new Set([correct]); if(!short){ set.add(correct.replace(/[.?!]$/,'')); set.add(correct.toLowerCase()); set.add(correct.toUpperCase()); } const arr=[...set,...pool].slice(0,4); while(arr.length<4) arr.push(arr[0]+" "); return shuffle(arr) }
function collectAnswers(){ const res=[]; DATA.forEach(u=>u.skills.forEach(s=>s.items.forEach(it=>{ if(it.type==='translate'){res.push(Array.isArray(it.answer)?it.answer[0]:it.answer)} else if(it.type==='listen'){res.push(it.text)} else if(it.type==='mc'){res.push(it.answer)} else if(it.type==='fill'){res.push(it.gap)} }))); return Array.from(new Set(res)) }

function findSkill(id){ for(const u of DATA){ const s=u.skills.find(x=>x.id===id); if(s) return s; } throw new Error("Skill not found") }
function indexOfItem(skill,item){ return skill.items.indexOf(item) }
function button(label,variant){ const b=document.createElement('button'); b.className='btn'+(variant?(' '+variant):''); b.textContent=label; return b }
function shuffle(a){ const arr=a.slice(); for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr }
function norm(s){ return (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[“”"'.!?;:,()]/g,'').replace(/\s+/g,' ').trim() }
function validateFree(input, answers){ if(!input) return false; const n=norm(input); return (Array.isArray(answers)?answers:[answers]).some(a=>norm(a)===n) }
function explainCorr(ans){ const a=Array.isArray(ans)?ans[0]:ans; return `Réponse attendue: <strong>${a}</strong>` }
function feedback(ok, explain){ const d=document.createElement('div'); const kid=state.settings.kidMode; d.className='feedback '+(ok?'ok':'ko'); d.innerHTML= ok ? (kid?'✅ Bien joué !':'✅ Bravo !') : (kid?'🙂 On continue !':'❌ Oups !'); if(!kid && explain) d.innerHTML+=' '+explain; $card.appendChild(d) }

const intervals=[0,1,2,4,8,16]; function itemKey(s,i){return s+'#'+i} function days(d){return d*86400000}
function updateSrs(s,i,ok){ const key=itemKey(s,i); const cur=state.srs[key]||{box:1,last:Date.now(),due:Date.now()}; let box=cur.box; box= ok? Math.min(5,box+1):Math.max(1,box-1); const due=Date.now()+days(intervals[box]); state.srs[key]={box,last:Date.now(),due}; persist() }
function isDue(s,i){ const x=state.srs[itemKey(s,i)]; return x? x.due<=Date.now(): false }
function bumpProgress(s){ const skill=findSkill(s); const p=state.progress[s]||{seen:0,total:skill.items.length}; p.seen=Math.min(skill.items.length,p.seen+1); p.total=skill.items.length; state.progress[s]=p; persist() }
function persist(){ saveState(activeId,state) }

function speak(text){ try{ const u=new SpeechSynthesisUtterance(text); u.lang='en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(e){} }

$btnSettings.addEventListener('click', ()=> openModal('Réglages', ()=>{ const d=document.createElement('div'); d.innerHTML=`<label class="switch">Objectif quotidien (XP): <input type="number" id="inpGoal" min="5" max="200" step="5" value="20"></label><div style="height:10px"></div><label class="switch"><input id="inpKid" type="checkbox"> Activer le mode enfant</label><p class="small">Le mode enfant remplace les saisies par des QCM.</p>`; return d; }, ()=>{ const kid=el('#inpKid').checked; state.settings.kidMode=kid; persist(); $kidBadge.classList.toggle('hidden', !kid); }));
$btnReset.addEventListener('click', ()=>{ state={...structuredClone(defaultState)}; saveState(activeId,state); updateHeader(); renderUnits(); $kidBadge.classList.add('hidden'); });

function openModal(title, renderBody, onOk){ $modalTitle.textContent=title; $modalBody.innerHTML=''; $modalBody.appendChild(renderBody()); $modal.classList.remove('hidden'); const close=()=> $modal.classList.add('hidden'); const ok=()=>{ onOk(); close(); }; $modalOk.onclick=ok; $modalCancel.onclick=close; }

})();