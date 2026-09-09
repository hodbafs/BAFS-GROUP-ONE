let cloud={status:'loading',account:null,error:''},deviceKey='',pendingSave=null;
const oldRoute=route,oldBoot=boot,oldState=JSON.parse(JSON.stringify(state));
function localApi(path,body){
 const storeKey='bafs-one-offline-v4';
 let data;try{data=JSON.parse(localStorage.getItem(storeKey)||'{}')}catch{data={}}
 data.profile??={display_name:'เพื่อนร่วมงาน BAFS',team:'BAFS GROUP',created_at:Date.now()};
 data.checkpoints=Array.isArray(data.checkpoints)?data.checkpoints:[];
 data.runs=Array.isArray(data.runs)?data.runs:[];
 const saveStore=()=>{try{localStorage.setItem(storeKey,JSON.stringify(data))}catch{}};
 const getAccount=()=>{
  const user={key:'offline-user',email:'user@bafs.test',name:data.profile?.display_name||'เพื่อนร่วมงาน BAFS'};
  if(!data.profile)return{user,profile:null,runs:[],journey:RULES.journey([],[]),xp:0,dailies:[]};
  const finishedRuns=data.runs.filter(r=>r.finished_at);
  const journey=RULES.journey(data.checkpoints,finishedRuns);
  const rewarded=new Set(finishedRuns.filter(r=>r.passed).map(r=>dateKey(new Date(r.created_at))+':'+r.game_id));
  const dailies=data.checkpoints.filter(c=>c.checkpoint.startsWith('daily:')).map(c=>c.checkpoint.slice(6));
  const xp=rewarded.size*20+dailies.length*10+Object.values(journey).filter(j=>j.stamp).length*100;
  return{user,profile:data.profile,runs:finishedRuns,journey,dailies,xp};
 };
 if(path==='me')return getAccount();
 if(path==='profile'){
  const name=String(body?.name||'').trim(),team=String(body?.team||'').trim();
  if(!name||name.length>60||team.length>80)throw new Error('กรุณาระบุชื่อ 1–60 ตัวอักษร และทีมไม่เกิน 80 ตัวอักษร');
  data.profile={display_name:name,team,created_at:Date.now()};
  saveStore();return getAccount();
 }
 if(path==='learn'){
  const q=RULES.quiz[body?.core];
  if(!q||body?.answer!==q.ok)throw new Error('ยังไม่ตรงกับค่านิยม ลองอ่านแล้วเลือกอีกครั้ง');
  const cp=body.core+':learn';
  if(!data.checkpoints.some(c=>c.checkpoint===cp)){data.checkpoints.push({checkpoint:cp,detail:'ผ่านคำถามทำความเข้าใจ',created_at:Date.now()});saveStore()}
  return getAccount();
 }
 if(path==='runs'){
  if(!gameCatalog.some(g=>g.id===body?.game)||![1,2,3].includes(body?.level))throw new Error('เกมหรือระดับไม่ถูกต้อง');
  const core=Object.keys(RULES.primary).find(c=>RULES.primary[c]===body.game);
  if(core&&!data.checkpoints.some(c=>c.checkpoint===core+':learn'))throw new Error('เริ่มจากทำความรู้จักค่านิยมนี้ก่อน');
  if(body.level>1){
   const prev=data.runs.some(r=>r.game_id===body.game&&r.level===body.level-1&&r.passed);
   if(!prev)throw new Error('ผ่านด่านก่อนหน้าเพื่อปลดล็อกระดับนี้');
  }
  const seed=Math.floor(Date.parse(dateKey()+'T00:00:00Z')/86400000)*47+gameCatalog.findIndex(g=>g.id===body.game)*101+body.level*991;
  const id='run-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
  data.runs.unshift({id,user_id:'offline-user',game_id:body.game,level:body.level,seed,created_at:Date.now()});
  saveStore();return{id,config:RULES.config(body.game,body.level,seed)};
 }
 if(path==='finish'){
  const run=data.runs.find(r=>r.id===body?.run);
  if(!run)throw new Error('ไม่พบรอบเกมของคุณ');
  if(run.finished_at)return{result:{passed:!!run.passed,summary:run.summary},account:getAccount()};
  const cfg=RULES.config(run.game_id,run.level,run.seed);
  const result=RULES.check(cfg,body?.proof);
  run.finished_at=Date.now();run.passed=result.passed?1:0;run.summary=result.summary;run.proof=JSON.stringify(body?.proof||{});
  saveStore();return{result:{passed:!!run.passed,summary:run.summary},account:getAccount()};
 }
 if(path==='apply'){
  if(!RULES.primary[body?.core])throw new Error('ค่านิยมไม่ถูกต้อง');
  const a=getAccount();
  if(!a.journey[body.core].steps.slice(0,4).every(Boolean))throw new Error('ผ่านด่านทั้ง 3 ระดับก่อนบันทึกการนำไปใช้');
  const detail=String(body?.detail||'').trim();
  if(!body?.confirmed||detail.length<15||detail.length>500)throw new Error('เล่าสิ่งที่คุณได้ลองทำ 15–500 ตัวอักษร และยืนยันว่าได้ทำแล้ว');
  const cp=body.core+':apply';
  if(!data.checkpoints.some(c=>c.checkpoint===cp)){data.checkpoints.push({checkpoint:cp,detail,created_at:Date.now()});saveStore()}
  return getAccount();
 }
 if(path==='daily'){
  if(!body?.confirmed)throw new Error('ยืนยันเมื่อได้ลองทำภารกิจแล้ว');
  const cp='daily:'+dateKey();
  if(!data.checkpoints.some(c=>c.checkpoint===cp)){data.checkpoints.push({checkpoint:cp,detail:'บันทึกการทำภารกิจรายวันด้วยตนเอง',created_at:Date.now()});saveStore()}
  return getAccount();
 }
 if(path==='reset'){
  if(body?.confirm!=='DELETE_MY_PROGRESS')throw new Error('กรุณายืนยันการล้างข้อมูล');
  data.checkpoints=[];data.runs=[];saveStore();return getAccount();
 }
 throw new Error('ไม่พบรายการที่ขอ');
}
async function apiCall(path,body){if(typeof location!=='undefined'&&location.protocol==='file:')return localApi(path,body);const opts={credentials:'same-origin',cache:'no-store'};if(body!==undefined){opts.method='POST';opts.headers={'Content-Type':'application/json'};opts.body=JSON.stringify(body)}let r;try{r=await fetch('/api/'+path,opts)}catch{return localApi(path,body)}if(r.status===404)return localApi(path,body);let data;try{data=await r.json()}catch{throw new Error('ระบบตอบกลับไม่สมบูรณ์ กรุณาลองอีกครั้ง')}if(!r.ok){if(r.status===401){cloud.status='anonymous';cloud.account=null}throw new Error(data.error||'ทำรายการไม่สำเร็จ')}return data}
function useAccount(a){const nextKey='bafs-one-device-v3:'+a.user.key;if(deviceKey!==nextKey){deviceKey=nextKey;let local={};try{local=JSON.parse(localStorage.getItem(deviceKey)||'{}')}catch{}for(const k of ['voices','thanks','questions'])state[k]=Array.isArray(local[k])?local[k]:[];state.checkins=local.checkins&&typeof local.checkins==='object'?local.checkins:{};selectedMood=null}cloud.account=a;cloud.status='ready';state.games=a.runs.map(r=>({id:r.game_id,run:r.id,title:(gameCatalog.find(g=>g.id===r.game_id)?.title||r.game_id)+' · '+RULES.names[r.level-1],body:r.summary,day:dateKey(new Date(r.created_at)),time:r.finished_at,level:r.level,passed:!!r.passed,cores:[]}));state.missions=Object.fromEntries(a.dailies.map(d=>[d,true]));updateHeader()}
async function loadAccount(){cloud.status='loading';cloud.error='';route();try{useAccount(await apiCall('me'));if(cloud.account.profile&&!location.hash)location.hash='welcome';route()}catch(e){cloud.error=e.message;if(cloud.status!=='anonymous')cloud.status='error';route()}}
save=function(){const local={settings:state.settings,checkins:state.checkins,voices:state.voices,thanks:state.thanks,questions:state.questions};try{if(deviceKey)localStorage.setItem(deviceKey,JSON.stringify(local));localStorage.setItem('bafs-one-settings-v3',JSON.stringify(state.settings));return true}catch{toast('บันทึกข้อมูลในเครื่องนี้ไม่ได้ กรุณาอย่าปิดหน้าหากยังมีข้อความที่ต้องการเก็บ');return false}};
xp=function(){return cloud.account?.xp||0};
collected=function(){return new Set(Object.entries(cloud.account?.journey||{}).filter(([k,v])=>v.stamp).map(([k])=>k))};
function checkpoint(c){return cloud.account?.journey?.[c]||{steps:[false,false,false,false,false],stamp:false}}
function nextCore(){return coreValues.find(c=>!checkpoint(c.id).stamp)?.id||'G'}
route=function(){const desired=location.hash.slice(1)||'welcome';if(cloud.status==='loading'){document.body.classList.add('auth-mode');$('#main').innerHTML='<div class="account-loading"><b>ONE<span>↗</span></b><p>กำลังเปิดพื้นที่ของคุณ…</p><div class="loading-line"></div></div>';return}if(cloud.status==='error'){document.body.classList.add('auth-mode');$('#main').innerHTML=`<div class="account-loading"><b>ONE↗</b><h2>ยังเชื่อมต่อพื้นที่ของคุณไม่ได้</h2><p>${esc(cloud.error)}</p><button class="btn" onclick="loadAccount()">ลองเชื่อมต่ออีกครั้ง</button></div>`;return}if(cloud.status==='anonymous'){document.body.classList.add('auth-mode');routeId='login';$('#main').innerHTML=views.login();return}if(!cloud.account?.profile){document.body.classList.add('auth-mode');routeId=desired==='login'?'login':'signup';$('#main').innerHTML=views[routeId]();return}document.body.classList.toggle('auth-mode',['login','signup','welcome'].includes(desired));oldRoute()};
boot=function(){const more=[['journey','ภารกิจ GROUP','02'],['login','เข้าสู่ระบบ','10'],['signup','สร้างโปรไฟล์','11'],['welcome','Welcome back','12']];pages.splice(1,0,more[0]);pages.push(...more.slice(1));oldBoot();document.addEventListener('pointermove',e=>{if(state.settings.reduced)return;const tile=e.target.closest?.('.chapter-tile,.journey-hero');if(!tile)return;const r=tile.getBoundingClientRect();tile.style.setProperty('--px',((e.clientX-r.left)/r.width-.5).toFixed(3));tile.style.setProperty('--py',((e.clientY-r.top)/r.height-.5).toFixed(3))});loadAccount()};
async function signup(e){e.preventDefault();const form=e.target,button=form.querySelector('button[type=submit]');button.disabled=true;$('#signup-error').textContent='';try{const data=new FormData(form);useAccount(await apiCall('profile',{name:data.get('name'),team:data.get('team')}));go('welcome')}catch(err){$('#signup-error').textContent=err.message;button.disabled=false}}
function showLearn(c){const v=coreValues.find(v=>v.id===c),q=RULES.quiz[c];openModal('CHECKPOINT 01 / '+v.name,`<div class="learn-banner" style="--core:${v.color};--core-ink:${v.ink}"><b>${c}</b><div><h2>${v.thai}</h2><p>${v.desc}</p></div></div><h3>${q.q}</h3><div class="learn-options">${q.a.map((a,i)=>`<button class="decision-option" onclick="answerLearn('${c}',${i},this)"><span>${String.fromCharCode(65+i)}</span><b>${a}</b></button>`).join('')}</div><p id="learn-feedback" role="status"></p>`)}
async function answerLearn(c,answer,button){button.disabled=true;try{useAccount(await apiCall('learn',{core:c,answer}));closeModal();activeJourney=c;go('journey');if(routeId==='journey')route();celebrate();toast('Checkpoint 01 ผ่านแล้ว ด่านเริ่มต้นเปิดให้คุณแล้ว')}catch(e){$('#learn-feedback').textContent=e.message;button.disabled=false}}
function showApply(c){const v=coreValues.find(v=>v.id===c),j=checkpoint(c);if(!j.steps.slice(0,4).every(Boolean)){toast('ผ่านด่านทั้ง 3 ระดับก่อนบันทึกภารกิจนี้');return}openModal('CHECKPOINT 05 / MAKE IT REAL',`<div class="apply-heading" style="--core:${v.color}"><span>${c}</span><div><h2>ลองใช้จริง เก็บเรื่องของคุณ</h2><p>${v.action}</p></div></div><form onsubmit="submitApply(event,'${c}')"><label for="apply-detail">คุณได้ลองทำอะไร และเกิดอะไรขึ้น?</label><textarea id="apply-detail" name="detail" required minlength="15" maxlength="500" placeholder="เล่าเหตุการณ์สั้น ๆ โดยไม่ระบุข้อมูลอ่อนไหวของผู้อื่น"></textarea><label class="check-label"><input type="checkbox" name="confirmed" required><span>ฉันได้ลองทำสิ่งนี้แล้ว และบันทึกจากประสบการณ์ของฉัน</span></label><p class="helper">ขั้นนี้เป็นบันทึกด้วยตนเอง ไม่ใช่การรับรองจากหัวหน้างานหรือ HPE</p><p id="apply-error" role="status"></p><button class="btn" type="submit">เก็บภารกิจและรับ ${c} Stamp ↗</button></form>`)}
async function submitApply(e,c){e.preventDefault();const b=e.target.querySelector('button[type=submit]'),data=new FormData(e.target);b.disabled=true;try{useAccount(await apiCall('apply',{core:c,detail:data.get('detail'),confirmed:data.get('confirmed')==='on'}));closeModal();activeJourney=c;route();showStamp(c,true);celebrate()}catch(err){$('#apply-error').textContent=err.message;b.disabled=false}}
function showStamp(c,newlyEarned=false){const v=coreValues.find(v=>v.id===c);openModal('GROUP / MISSION COMPLETE',`<div class="stamp-award" style="--core:${v.color};--core-ink:${v.ink}"><div class="stamp-rings"><strong>${c}</strong><span>5 CHECKPOINTS / COMPLETE</span></div><h2>${v.name} Stamp</h2><p>รู้จักค่านิยม ผ่านครบ 3 ระดับ<br>และเก็บประสบการณ์ที่ได้ลองใช้จริงแล้ว</p><div class="stamp-story"><span>บันทึกการนำไปใช้ของคุณ</span><p>${esc(checkpoint(c).detail)}</p><small>${checkpoint(c).date?new Date(checkpoint(c).date).toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Bangkok'}):''}</small></div><b>${newlyEarned?'+100 แต้มภารกิจ':'100 แต้มของภารกิจนี้เก็บแล้ว'}</b><div class="actions"><button class="btn" onclick="closeModal();go('my')">เปิดสมุดสะสม ↗</button><button class="link-button" onclick="closeModal();activeJourney=nextCore();go('journey');route()">ภารกิจถัดไป</button></div></div>`)}
confirmMission=async function(){if(!pendingMissionDay)return;if(pendingMissionDay!==dateKey()){closeModal();route();toast('เริ่มวันใหม่แล้ว ลองเลือกภารกิจของวันนี้อีกครั้ง');return;}const b=$('#modal-body button.btn');if(b)b.disabled=true;try{useAccount(await apiCall('daily',{confirmed:true}));closeModal();route();celebrate();toast('บันทึกภารกิจรายวันในบัญชีแล้ว')}catch(e){toast(e.message);if(b)b.disabled=false}};
resetData=async function(){const b=$('#modal-body button.btn:last-child');if(b)b.disabled=true;try{const a=await apiCall('reset',{confirm:'DELETE_MY_PROGRESS'});state.checkins={};state.voices=[];state.thanks=[];state.questions=[];selectedMood=null;save();useAccount(a);closeModal();route();toast('ล้างประวัติกิจกรรมแล้ว โปรไฟล์ของคุณยังอยู่')}catch(e){toast(e.message);if(b)b.disabled=false}};
function oldHistory(){openModal('MY ONE / รุ่นก่อน',`<h2>ข้อมูลที่เคยเก็บในเครื่องนี้</h2><p class="helper">ประวัติเดิมไม่ใช้แทนการผ่าน Checkpoint ใหม่</p>${[...oldState.games,...oldState.voices,...oldState.thanks,...oldState.questions].map(x=>`<div class="entry"><b>${esc(x.title)}</b><p>${esc(x.body)}</p></div>`).join('')||'<p>ไม่มีข้อมูลจากรุ่นก่อนในเครื่องนี้</p>'}`)}
if(typeof document!=='undefined'){document.addEventListener('click',e=>{const a=e.target.closest?.('a');if(!a)return;const h=a.getAttribute('href')||'';if(location.protocol==='file:'||location.hostname==='localhost'||location.hostname==='127.0.0.1'){if(h.includes('signin-with-chatgpt')){e.preventDefault();go('signup')}else if(h.includes('signout-with-chatgpt')){e.preventDefault();go('login');toast('โหมดออฟไลน์: บันทึกข้อมูลเฉพาะเครื่องนี้')}}})}
