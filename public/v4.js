// ONE V4: the existing account and game engine remain the source of progress.
const v4MoodsMeta={
 spark:{icon:'⚡',label:'พร้อมลุย',quote:'พลังพร้อม ก้าวแรกวันนี้เริ่มได้เลย',micro:'ลองทำสิ่งใหม่เล็ก ๆ หนึ่งอย่าง แล้วเก็บความภูมิใจไว้เป็นแรงขับเคลื่อน',color:'#4fb9a3'},
 flow:{icon:'〰',label:'ไหลไปเรื่อย ๆ',quote:'จังหวะที่นิ่ง พาเราไปได้ไกลที่สุด',micro:'รักษาโฟลว์ในการทำงาน ทำตามสเต็ปของตัวเอง ไม่ต้องเร่ง ไม่ต้องเปรียบเทียบกับใคร',color:'#d9792f'},
 focus:{icon:'◎',label:'อยากโฟกัส',quote:'หนึ่งงาน หนึ่งช่วงเวลา พาใจสู่สมาธิ',micro:'จัดพื้นที่ให้ใจสงบ ตัดสิ่งรบกวน แล้วสะสางเรื่องสำคัญไปทีละเรื่อง',color:'#b5b6bb'},
 low:{icon:'◒',label:'ขอแรงใจหน่อย',quote:'ไม่ต้องแบกทุกอย่างไว้คนเดียวเสมอไป',micro:'แวะพักเติมใจได้ตรงนี้ มีเพื่อนร่วมทีมและพื้นที่ BAFS ONE คอยอยู่ข้าง ๆ เสมอ',color:'#cfb9e8'},
 cloud:{icon:'≋',label:'ขอพักหายใจ',quote:'วันนี้แค่ดูแลตัวเองให้ดี ก็ยอดเยี่ยมแล้ว',micro:'ผ่อนคลายร่างกาย วางงานลงสักครู่ มองออกไปไกล ๆ หรือจิบน้ำให้สดชื่นก่อนไปต่อ',color:'#f1b29e'}
};
moods.forEach((m,i)=>{const k=['spark','flow','focus','low','cloud'][i];const meta=v4MoodsMeta[k];m.label=meta.label;m.reply=meta.micro;m.quote=meta.quote;m.color=coreValues[i].color});

function groupType(isAuth=false){
 return `<div class="hero-group-display ${isAuth?'auth-hero-group':''}" aria-label="GROUP Core Values">
  <div class="group-ambient-light" aria-hidden="true"></div>
  <div class="group-letters">
   ${coreValues.map((c,i)=>`
    <div class="group-pillar pillar-${c.id}" style="${coreStyle(c)};--i:${i}" tabindex="0" role="button" aria-label="${c.id} - ${c.name} (${c.thai})">
     <div class="pillar-core">
      <span class="pillar-letter">${c.id}</span>
      <div class="pillar-glow" aria-hidden="true"></div>
     </div>
     <div class="pillar-info">
      <span class="pillar-name">${c.name}</span>
      <small class="pillar-thai">${c.thai}</small>
     </div>
    </div>
   `).join('')}
  </div>
 </div>`;
}

authFrame=function(content,kind='login'){
 return `<div class="auth-page v4-auth">
  <a class="auth-brand" href="#login"><span>BAFS GROUP</span><b>ONE<span>↗</span></b></a>
  <div class="auth-left">
   <span class="eyebrow">EVERY DAY, YOU MATTER.</span>
   <h1>ทุกวันของคุณ<br>มีความหมาย<span>ที่นี่.</span></h1>
   <p>พื้นที่ให้คุณได้พูด ส่งต่อคำขอบคุณ<br>และค้นพบสิ่งใหม่ไปด้วยกัน</p>
   ${groupType(true)}
   <div class="auth-caption">ห้าค่านิยม เชื่อมเราเป็นหนึ่งเดียว</div>
  </div>
  <section class="auth-right">${content}</section>
  <div class="auth-bottom"><span>BAFS GROUP ONE / YOUR EVERYDAY SPACE</span><span>เข้าสู่ระบบผ่าน ChatGPT · บันทึกในบัญชีของคุณ</span></div>
 </div>`;
};

const v4Welcome=views.welcome;
views.welcome=()=>v4Welcome().replace('วันนี้มีอีกก้าวเล็ก ๆ รอคุณอยู่','ยินดีที่คุณกลับมา วันนี้อยากเริ่มในจังหวะแบบไหน?').replace('ทำภารกิจต่อ <span>↗</span>','เลือกโหมดวันนี้ <span>↗</span>').replace("activeJourney=nextCore();go('journey')","go('home')");

function orbPanel(){
 const id=selectedMood||state.checkins[dateKey()]?.id||'flow';
 const m=moods.find(x=>x.id===id)||moods[1];
 const meta=v4MoodsMeta[id]||v4MoodsMeta.flow;
 const isSaved=state.checkins[dateKey()]?.id===id;
 return `<section class="orb-panel" style="--energy:${m.color}">
  <div class="orb-heading">
   <span class="eyebrow">01 / YOUR DAILY CHECK-IN</span>
   <a href="#checkin">ประวัติโหมด ↗</a>
  </div>
  <h2>วันนี้ อยากไป<br>ในจังหวะแบบไหน?</h2>
  <div class="orb-stage">
   <div class="crystal-core-wrapper">
    <div class="crystal-ambient-aura" aria-hidden="true"></div>
    <button class="energy-orb crystal-orb" aria-label="เปลี่ยนโหมดพลังงานวันนี้ หรือแตะเลือกด้านล่าง" onclick="cycleOrb()" onpointerdown="orbDown(event)">
     <div class="crystal-shell" aria-hidden="true"></div>
     <div class="crystal-nebula" aria-hidden="true"></div>
     <div class="orbit-gyroscopic gyroscopic-1" aria-hidden="true"></div>
     <div class="orbit-gyroscopic gyroscopic-2" aria-hidden="true"></div>
     <div class="crystal-sparks" aria-hidden="true">
      <span class="spark s1"></span>
      <span class="spark s2"></span>
      <span class="spark s3"></span>
     </div>
     <span class="crystal-glyph">${m.icon}</span>
    </button>
   </div>
   <span class="orbit-caption">แตะลูกแก้วเพื่อสลับโหมด · ลากซ้ายหรือขวา</span>
  </div>
  <div class="crystal-emotional-bar" aria-live="polite">
   <span class="emotional-quote">“${meta.quote}”</span>
   <p class="emotional-micro">${meta.micro}</p>
  </div>
  <div class="mode-choices">
   ${moods.map((x,i)=>`<button class="${id===x.id?'selected':''}" aria-pressed="${id===x.id}" onclick="chooseMood('${x.id}')"><span>0${i+1}</span>${x.label}</button>`).join('')}
  </div>
  <div id="mood-response" aria-live="polite">
   ${moodResponse(id,isSaved)}
  </div>
  <small class="local-note">โหมดวันนี้เก็บเฉพาะอุปกรณ์นี้ · ข้ามได้เสมอ</small>
 </section>`;
}
let orbDragged=false;
function orbDown(e){const b=e.currentTarget,start=e.clientX;orbDragged=false;b.setPointerCapture?.(e.pointerId);b.onpointerup=up=>{b.onpointerup=null;if(Math.abs(up.clientX-start)>28){orbDragged=true;cycleOrb(up.clientX>start?1:-1);setTimeout(()=>orbDragged=false,50)}};b.onpointercancel=()=>{b.onpointerup=null}}
function cycleOrb(delta=1){if(orbDragged&&delta===1&&arguments.length===0)return;const id=selectedMood||state.checkins[dateKey()]?.id,i=moods.findIndex(m=>m.id===id);chooseMood(moods[(i+delta+5)%5].id)}
chooseMood=function(id){if(!moods.some(m=>m.id===id))return;selectedMood=id;sound();const p=$('.orb-panel');if(p){p.outerHTML=orbPanel();applyAtmosphere()}else route()};
moodResponse=function(id,saved=false){const m=moods.find(x=>x.id===id);return `<div class="orb-reply"><b>${saved?'รับโหมดวันนี้แล้ว ✓':m.label}</b><p>${m.reply}</p>${saved?`<button class="link-button" onclick="modeNext('${id}')">${id==='low'?'เขียนคำขอบคุณ':id==='cloud'?'พักสัก 30 วินาที':'ดูกิจกรรมที่เหมาะกับจังหวะนี้'} ↗</button>`:`<button class="btn" onclick="recordMood('${id}')">เก็บโหมดนี้ไว้</button>`}</div>`};
recordMood=function(id){if(!moods.some(m=>m.id===id))return;const prev=state.checkins[dateKey()];state.checkins[dateKey()]={id,time:Date.now()};if(!save()){if(prev)state.checkins[dateKey()]=prev;else delete state.checkins[dateKey()];return}route();toast('รับโหมดวันนี้แล้ว ไปในจังหวะของคุณได้เลย');sound('win')};
function modeNext(id){if(id==='low')go('thanks');else if(id==='cloud')pauseMoment();else startGame(moods.find(m=>m.id===id).suggest)}
let pauseTimer;
function pauseMoment(){openModal('A MOMENT FOR YOU',`<div class="pause-moment"><div class="pause-mascot-wrap"><img src="mascot/termtem-front.png" alt="น้องเติมเต็ม" class="pause-mascot-img"></div><div class="pause-ring"></div><h2>พักสายตาจากจอสักนิด</h2><p>ขยับไหล่ มองไกล ๆ หรือจิบน้ำ<br>ช่วงเวลานี้เป็นของคุณ</p><b id="pause-time">30</b><p>ปิดเมื่อพร้อมได้เลย</p></div>`);clearInterval(pauseTimer);let n=30;pauseTimer=setInterval(()=>{if(!$('#pause-time'))return clearInterval(pauseTimer);$('#pause-time').textContent=--n?String(n):'พร้อมเมื่อไหร่ ค่อยไปต่อ';if(!n)clearInterval(pauseTimer)},1000)}
function applyAtmosphere(){const id=selectedMood||state.checkins[dateKey()]?.id||'flow';document.body.dataset.mode=id;const hour=Number(new Intl.DateTimeFormat('en-GB',{hour:'2-digit',hourCycle:'h23',timeZone:'Asia/Bangkok'}).format(new Date()));document.body.dataset.time=hour<12?'morning':hour<18?'day':'evening'}
function dailyHighlight(){const g=todayGame(),c=coreValues[dayNumber()%5];const kind=dayNumber()%3;return `<section class="daily-spotlight" style="${coreStyle(c)}"><div class="spot-meta"><span class="eyebrow">02 / TODAY'S HIGHLIGHT</span><span>${dateKey()}</span></div><div class="spot-symbol" aria-hidden="true">${kind===0?c.id:kind===1?'↗':'＋'}</div><div class="spot-copy"><span class="eyebrow">${kind===0?c.name:kind===1?'ONE PLAY / DAILY PICK':'ONE THANKS'}</span><h2>${kind===0?c.thai:kind===1?g.title:'คำขอบคุณของคุณ<br>อาจเติมเต็มวันของใคร'}</h2><p>${kind===0?c.desc:kind===1?g.desc:'นึกถึงหนึ่งคนที่ช่วยให้งานวันนี้เดินต่อได้ แล้วเก็บสิ่งที่คุณเห็นคุณค่าไว้ในการ์ด'}</p><button class="btn" onclick="${kind===0?`chooseChapter('${c.id}')`:kind===1?`startGame('${g.id}')`:`go('thanks')`}">${kind===0?'เปิดภารกิจนี้':kind===1?'ลองเล่นวันนี้':'เขียนการ์ดขอบคุณ'} ↗</button></div><div class="spot-foot">เรื่องใหม่ทุกวัน / กลับมาเมื่อคุณพร้อม</div></section>`}
const communityModes=[['thanks','ONE THANKS','คำเล็ก ๆ ที่มีความหมาย','＋','G'],['voice','ONE VOICE','สิ่งที่คุณอยากให้เราได้ยิน','“','R'],['change','ONE CHANGE','จากไอเดีย สู่ความเปลี่ยนแปลง','↗','O'],['talk','ONE TALK','เปิดบทสนทนาใหม่ไปด้วยกัน','⋯','P']];
function communityTiles(){return `<div class="community-world">${communityModes.map(([id,name,copy,symbol,core])=>{const c=coreValues.find(c=>c.id===core);return `<a class="community-door" href="#${id}" style="${coreStyle(c)}"><span class="door-symbol">${symbol}</span><div><span>${name}</span><h3>${copy}</h3></div><b>เปิดพื้นที่ ↗</b></a>`}).join('')}</div>`}
views.home=()=>`<div class="today-greeting"><div class="greeting-lead"><a href="#values" class="greeting-mascot" title="คลิกเพื่อทำความรู้จัก น้องเติมเต็ม และ GROUP Core Values" aria-label="น้องเติมเต็ม BAFS Group Core Value Mascot"><img src="mascot/termtem-front.png" alt="น้องเติมเต็ม" class="termtem-avatar"><span class="mascot-speech">เติมพลังใจไปด้วยกันนะ! ↗</span></a><div class="greeting-text"><span class="eyebrow">EVERY DAY, YOU MATTER.</span><h1>วันนี้ของเรา<span> สวัสดี ${esc(cloud.account.profile.display_name)}</span></h1></div></div><a class="my-space-link" href="#my">พื้นที่ของฉัน ↗</a></div><div class="today-experience">${orbPanel()}${dailyHighlight()}</div><section class="v4-journey"><div class="section-head"><div><span class="eyebrow">03 / YOUR GROUP JOURNEY</span><h2>ก้าวเล็ก ๆ ของคุณ มีความหมาย</h2></div><a class="link-button" href="#values">รู้จักค่านิยม GROUP ↗</a></div>${chapterRail()}<div class="journey-summary"><span>${fullProgress()} / 25 Checkpoints · ${collected().size} / 5 Stamps</span><button class="btn" onclick="chooseChapter(nextCore())">ไปต่อจากจุดเดิม ↗</button></div></section><div class="section-head"><div><span class="eyebrow">04 / CONNECT WITH ONE</span><h2>พื้นที่ดี ๆ เริ่มที่เรา</h2></div><a href="#community">สำรวจทั้งหมด ↗</a></div>${communityTiles()}<div class="under-grid">${missionBlock()}<section class="tomorrow"><span class="eyebrow">SEE YOU WHEN YOU'RE READY</span><h3>พรุ่งนี้มีอะไรให้ค้นพบอีก</h3><p>เกมแนะนำ: ${todayGame(1).title}<br>วันไหนไม่ได้แวะมา ความก้าวหน้าของคุณยังอยู่</p><a href="#play">สำรวจเกมทั้ง 8 แบบ ↗</a></section></div>`;
views.checkin=()=>`${title('YOUR DAILY CHECK-IN','ทุกจังหวะ มีพื้นที่ตรงนี้','ไม่ต้องอธิบาย แค่เลือกจังหวะที่เป็นคุณตอนนี้')}<div class="checkin-layout">${orbPanel()}<aside class="checkin-note"><span class="mono">YOUR PACE.<br>YOUR SPACE.</span><h2>วันนี้ไม่ต้อง<br>เหมือนเมื่อวาน</h2><p>เปลี่ยนใจหรือเปลี่ยนโหมดได้ตลอด ไม่มีการให้คะแนนความรู้สึก</p><button class="btn" onclick="pauseMoment()">พักสัก 30 วินาที</button><p class="helper">เก็บเฉพาะอุปกรณ์นี้ ผู้ใช้เครื่องเดียวกันอาจเห็นได้</p></aside></div><div class="section-head"><h2>สีสันของวันที่ผ่านมา</h2><button class="link-button" onclick="clearMoods()">ลบประวัติโหมด</button></div><div id="mood-history">${moodHistory()}</div>`;
views.community=()=>`${title('ONE COMMUNITY','มีพื้นที่ให้คุณเสมอ','ขอบคุณ แบ่งปัน ชวนคุย และค้นพบสิ่งที่เราอยากเปลี่ยนไปด้วยกัน')}${communityTiles()}<section class="personal-pulse"><h2>เรื่องเล็ก ๆ ที่คุณเก็บไว้</h2><div><span><b>${state.thanks.length}</b> การ์ดขอบคุณ</span><span><b>${state.voices.length}</b> ไอเดีย</span><span><b>${state.questions.length}</b> คำถาม</span></div><p>บันทึกส่วนตัวในอุปกรณ์นี้ ยังไม่ส่งถึงผู้รับหรือ HPE</p><a href="#my">ดูเรื่องราวของฉัน ↗</a></section>`;
const talkPrompts=['วันนี้อะไรทำให้งานของคุณง่ายขึ้น?','ใครทำให้คุณรู้สึกว่าไม่ได้ทำงานอยู่คนเดียว?','มีวิธีทำงานอะไรที่เราอยากลองใหม่?','สัปดาห์นี้คุณเรียนรู้อะไรจากเพื่อน?','ถ้าเปลี่ยนได้หนึ่งเรื่อง อยากเริ่มตรงไหน?','คำขอบคุณไหนที่คุณยังไม่ได้พูด?','เราแบ่งงานให้เห็นความถนัดของแต่ละคนได้อย่างไร?','ครั้งล่าสุดที่ได้ลองสิ่งใหม่ เป็นอย่างไรบ้าง?'];
let talkIndex=dayNumber()%talkPrompts.length;
function talkCard(){return `<section class="talk-deck"><div><span class="eyebrow">TEAM MOMENT / 3–5 MIN</span><h2>หนึ่งคำถาม<br>เปิดพื้นที่ให้กัน</h2><p>ชวนกันตอบทีละคน หรือขอผ่านก็ได้</p></div><button id="talk-flip" class="talk-flip" onclick="this.classList.toggle('flipped');this.setAttribute('aria-pressed',this.classList.contains('flipped'))" aria-pressed="false"><span class="talk-front">ONE<br>TALK<small>แตะเพื่อเปิดคำถาม</small></span><span class="talk-back">${talkPrompts[talkIndex]}</span></button><button class="link-button" onclick="nextTalkCard()">เปลี่ยนคำถาม ↻</button></section>`}
function nextTalkCard(){talkIndex=(talkIndex+1)%talkPrompts.length;$('.talk-deck').outerHTML=talkCard();sound()}
const v4Talk=views.talk;views.talk=()=>v4Talk();
const v4Change=views.change;views.change=()=>`<section class="change-lens"><span class="eyebrow">ONE CHANGE / ตัวอย่างแนวทาง</span><h2>เมื่อเสียงเล็ก ๆ<br>กลายเป็นก้าวที่มองเห็น</h2><div class="before-after" style="--reveal:50%"><div>ก่อน<br><b>กิจกรรมมีเวลาเดียว</b></div><div class="after-side">หลัง<br><b>ร่วมได้ในจังหวะของแต่ละกะ</b></div></div><label>เลื่อนเพื่อสำรวจ ก่อน / หลัง<input type="range" min="0" max="100" value="50" aria-label="เปรียบเทียบก่อนและหลัง" oninput="this.closest('.change-lens').querySelector('.before-after').style.setProperty('--reveal',this.value+'%')"></label><p>ภาพแนวคิดเพื่อสาธิต ยังไม่ใช่ผลดำเนินงานจริง</p></section>`+v4Change();
const v4My=views.my;views.my=()=>`<div class="memory-banner"><span class="eyebrow">MY ONE / EVERY LITTLE STEP COUNTS</span><h2>นี่คือเรื่องราวที่คุณค่อย ๆ สร้าง</h2><p>ทั้งสิ่งที่ได้ลอง และสิ่งที่คุณเห็นคุณค่า</p></div>`+v4My();
function switchMascotAngle(angle, btn){
 const img=$('#mascot-hero-img');
 if(!img)return;
 const file=angle==='side'?'mascot/termtem-side.png':angle==='back'?'mascot/termtem-back.png':'mascot/termtem-front.png';
 img.src=file;
 document.querySelectorAll('.angle-btn').forEach(b=>b.classList.remove('active'));
 if(btn)btn.classList.add('active');
 sound();
}
function mascotAmbassadorCard(){
 return `<section class="mascot-showcase-card">
  <div class="mascot-stage">
   <div class="mascot-img-box">
    <img id="mascot-hero-img" src="mascot/termtem-front.png" alt="น้องเติมเต็ม BAFS Group Core Value Mascot" class="mascot-hero-img">
   </div>
   <div class="mascot-angle-switch" role="group" aria-label="เลือกมุมมองน้องเติมเต็ม">
    <button class="angle-btn active" onclick="switchMascotAngle('front', this)">ด้านหน้า</button>
    <button class="angle-btn" onclick="switchMascotAngle('side', this)">ด้านข้าง</button>
    <button class="angle-btn" onclick="switchMascotAngle('back', this)">ด้านหลัง</button>
   </div>
  </div>
  <div class="mascot-bio">
   <div class="mascot-badge-row">
    <span class="eyebrow">CORE VALUE AMBASSADOR</span>
    <span class="mascot-tag">หมวก GROUP · เสื้อกั๊กสะท้อนแสง BAFS GROUP</span>
   </div>
   <h2>น้องเติมเต็ม</h2>
   <p class="mascot-intro">มาสคอตนกฮูกผู้เปี่ยมพลังบวกแห่ง <b>BAFS GROUP</b> ผู้สวมหมวก GROUP พร้อมเคียงข้างและส่งต่อพลังบวกให้เพื่อนพนักงานทุกคนในทุก ๆ วัน ผ่านค่านิยม <b>G · R · O · U · P</b></p>
   <div class="mascot-group-chips">
    <span><b>G</b> Growth</span>
    <span><b>R</b> Respect</span>
    <span><b>O</b> Optimization</span>
    <span><b>U</b> Unity</span>
    <span><b>P</b> Professional</span>
   </div>
  </div>
 </section>`;
}
const v4Values=views.values;
views.values=()=>`<div class="value-intro">${groupType()}<p>แตะค่านิยมเพื่อสำรวจความหมายและเริ่มภารกิจ</p></div>${mascotAmbassadorCard()}`+v4Values();
function floatingNav(){const items=[['home','วันนี้','◉'],['journey','Journey','◎'],['play','Play','▷'],['community','Community','＋'],['my','My ONE','○']];const active=['thanks','voice','change','talk'].includes(routeId)?'community':routeId==='values'?'journey':routeId==='checkin'?'home':routeId;$('#nav').innerHTML=items.map(([id,label,icon],i)=>`<a href="#${id}" class="${active===id?'active':''}" ${active===id?'aria-current="page"':''} style="--nav-color:${coreValues[i].color}"><span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span></a>`).join('')}
const v4Route=route;route=function(){v4Route();document.body.classList.add('one-v4');document.body.dataset.page=routeId;floatingNav();applyAtmosphere()};
const v4Boot=boot;boot=function(){pages.push(['community','ONE COMMUNITY','13']);v4Boot();document.addEventListener('pointermove',e=>{if(state.settings.reduced)return;const surface=e.target.closest?.('.v4-auth,.daily-spotlight,.community-door');if(!surface)return;const r=surface.getBoundingClientRect();surface.style.setProperty('--pointer-x',`${((e.clientX-r.left)/r.width-.5)*20}px`);surface.style.setProperty('--pointer-y',`${((e.clientY-r.top)/r.height-.5)*15}px`)});};
