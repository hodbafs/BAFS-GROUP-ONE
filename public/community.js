const changes=[
 {title:'กิจกรรมที่เพื่อนกะกลางคืนก็ร่วมได้',desc:'ตัวอย่างการเปิดกิจกรรมแบบไม่ต้องเข้าร่วมพร้อมกัน',stage:2,team:'HPE',result:'แนวทางตัวอย่าง: เปิดกิจกรรมให้เข้าร่วมตามเวลาที่สะดวก พร้อมทบทวนการเข้าถึงของพนักงานแต่ละกะ',date:'ก.ย. 2569'},
 {title:'รวมข่าวกิจกรรมไว้ในที่เดียว',desc:'ตัวอย่างการจัดพื้นที่ให้ค้นหาข่าวและกิจกรรมได้ง่ายขึ้น',stage:1,team:'HPE และทีมสื่อสาร',result:'ขั้นตอนตัวอย่าง: รวบรวมรูปแบบข่าวและทดลองหน้าแสดงกิจกรรมกับพนักงาน',date:'ส.ค. 2569'},
 {title:'พื้นที่พักระหว่างกะที่สะดวกขึ้น',desc:'ตัวอย่างข้อเสนอเรื่องประสบการณ์การทำงานในพื้นที่ปฏิบัติการ',stage:0,team:'ทีมดูแลสถานที่',result:'ขั้นตอนตัวอย่าง: รับฟังความต้องการและสำรวจพื้นที่ก่อนเสนอแนวทาง',date:'ส.ค. 2569'}
];
const stageNames=['รับฟังแล้ว','กำลังดำเนินการ','เกิดขึ้นแล้ว'];

function miniChanges(){
 return changes.slice(0,2).map(c=>`
  <div class="change-row">
   <span class="step-marker">${c.stage===2?'✓':'↗'}</span>
   <div>
    <h3>${c.title}</h3>
    <p>${c.desc}</p>
    <span class="status">${stageNames[c.stage]}</span>
   </div>
  </div>
 `).join('');
}

function thanksNotes(){
 const sampleThanks=[
  {initials:'OP',name:'เพื่อนทีมปฏิบัติการ',team:'Operation Shift A',core:'P',coreName:'Professional',body:'ขอบคุณที่ช่วยส่งต่องานอย่างละเอียดทุกจุด ทำให้กะถัดไปเริ่มงานได้อย่างมั่นใจและสบายใจ'},
  {initials:'HR',name:'พี่ฝ่ายประสานงาน',team:'People & Culture',core:'U',coreName:'Unity',body:'ขอบคุณที่คอยรับฟังและช่วยประสานงานข้ามทีม แม้ในช่วงที่ทุกคนกำลังมีงานด่วน'},
  {initials:'IT',name:'ทีมสนับสนุนระบบ',team:'Digital Support',core:'O',coreName:'Optimization',body:'ขอบคุณที่ช่วยปรับปรุงขั้นตอนการกรอกข้อมูลให้รวดเร็วและลดขั้นตอนซ้ำซ้อนได้จริง'},
  {initials:'TC',name:'เพื่อนร่วมโปรเจกต์',team:'Innovation Taskforce',core:'G',coreName:'Growth Mindset',body:'ขอบคุณที่เปิดใจลองเครื่องมือใหม่ ๆ ไปด้วยกัน แม้เริ่มต้นจะติดขัดแต่ก็ร่วมมือจนสำเร็จ'}
 ];
 return `<div class="wall-of-thanks">
  ${sampleThanks.map(t=>{
   const c=coreValues.find(v=>v.id===t.core)||coreValues[0];
   return `
    <article class="gratitude-wall-card" style="${coreStyle(c)}">
     <div class="wall-card-head">
      <span class="wall-card-avatar">${t.initials}</span>
      <div>
       <b>${t.name}</b>
       <small>${t.team}</small>
      </div>
      <span class="wall-core-badge">${t.core} • ${t.coreName}</span>
     </div>
     <p class="wall-card-quote">“${t.body}”</p>
     <div class="wall-card-foot">
      <span>BAFS GROUP ONE</span>
      <span class="wall-heart">♡ ส่งต่อพลังใจ</span>
     </div>
    </article>
   `;
  }).join('')}
 </div>`;
}

views.thanks=()=>`${title('ONE THANKS / GRATITUDE STUDIO','หนึ่งคำขอบคุณ เติมเต็มวันของใครบางคน','เลือกค่านิยมที่คุณเห็นในเพื่อน แล้วเขียนสิ่งที่คุณเห็นคุณค่า')}${notice}
<div class="thanks-studio-layout">
 <div class="thanks-studio-left">
  <form class="panel card-creator-panel" onsubmit="submitEntry(event,'thanks');updatePostcard()" oninput="updatePostcard()">
   <div class="creator-step-label">
    <span class="step-num">01</span>
    <div>
     <h3>เลือกค่านิยม GROUP ที่สะท้อนในตัวเพื่อน</h3>
     <p>การ์ดจะเปลี่ยนธีมสีและสัญลักษณ์ตามค่านิยมที่เลือก</p>
    </div>
   </div>
   <div class="thanks-core-selector" role="radiogroup" aria-label="เลือกค่านิยมสำหรับคำขอบคุณ">
    ${coreValues.map(c=>`
     <label class="core-choice-pill" style="${coreStyle(c)}">
      <input type="radio" name="category" value="${c.id}" ${c.id==='U'?'checked':''} onchange="updatePostcard()">
      <span class="choice-ring"><b>${c.id}</b></span>
      <div class="choice-text">
       <strong>${c.name}</strong>
       <small>${c.thai}</small>
      </div>
     </label>
    `).join('')}
   </div>

   <div class="creator-step-label" style="margin-top:28px">
    <span class="step-num">02</span>
    <div>
     <h3>ส่งถึงใคร และอยากขอบคุณเรื่องอะไร?</h3>
     <p>พิมพ์ชื่อเพื่อนหรือทีม พร้อมเล่าสิ่งดี ๆ ที่เกิดขึ้น</p>
    </div>
   </div>

   <div class="form-field">
    <label for="recipient">อยากส่งคำขอบคุณถึงใคร?</label>
    <input id="recipient" name="title" required maxlength="100" placeholder="เช่น พี่มานน์ / ทีมปฏิบัติการกะเช้า">
   </div>

   <div class="prompt-suggestions">
    <span>💡 ไอเดียคำขอบคุณด่วน:</span>
    <div class="prompt-chips">
     <button type="button" class="prompt-chip" onclick="applyPrompt('ขอบคุณที่ช่วยส่งต่องานอย่างละเอียด ทำให้กะถัดไปเริ่มงานได้อย่างมั่นใจ')">+ ขอบคุณที่ส่งต่องานละเอียด</button>
     <button type="button" class="prompt-chip" onclick="applyPrompt('ขอบคุณที่คอยรับฟังและเปิดพื้นที่ให้ทุกคนได้แสดงความคิดเห็น')">+ ขอบคุณที่คอยรับฟัง</button>
     <button type="button" class="prompt-chip" onclick="applyPrompt('ขอบคุณที่ช่วยคิดหาวิธีแก้ปัญหาใหม่ ๆ ทำให้งานเดินหน้าต่อได้')">+ ขอบคุณที่ร่วมมือแก้ปัญหา</button>
    </div>
   </div>

   <div class="form-field">
    <label for="tbody">ข้อความคำขอบคุณของคุณ</label>
    <textarea id="tbody" name="body" required minlength="5" maxlength="700" placeholder="ขอบคุณที่… สิ่งนั้นช่วยให้ทีมหรือวันทำงานของเราดีขึ้นอย่างไร…"></textarea>
   </div>

   <div class="creator-actions">
    <button class="btn btn-gratitude" type="submit">ส่งการ์ดคำขอบคุณนี้ ♡</button>
    <button type="button" class="btn outline" onclick="flipStudioCard()">พลิกดูหน้า/หลังการ์ด ↻</button>
   </div>
  </form>
 </div>

 <div class="thanks-studio-right">
  <div class="card-preview-stage">
   <div class="preview-header">
    <span class="eyebrow">LIVE 3D PREVIEW</span>
    <span class="helper">การ์ดจำลองแบบ Real-time</span>
   </div>
   <div class="postcard-wrapper" onclick="flipStudioCard()" title="คลิกเพื่อพลิกการ์ด">
    <div class="postcard" id="postcard" style="--core:#000000;--core-ink:#ffffff">
     <div class="postcard-inner">
      <div class="postcard-face postcard-front">
       <div class="postcard-foil-border"></div>
       <div class="postcard-topline">
        <span class="mono">BAFS GROUP ONE / GRATITUDE NOTE</span>
        <div class="postcard-stamp-seal" id="postcard-letter">U</div>
       </div>
       <div class="postcard-message">
        <span class="postcard-dear">DEAR</span>
        <h3 id="postcard-to">เพื่อนที่อยากขอบคุณ</h3>
        <p id="postcard-text">ขอบคุณที่ทำให้เราเห็นว่า การไปด้วยกันและร่วมมือกันมีความหมายแค่ไหน</p>
       </div>
       <div class="postcard-footer">
        <div>
         <small>INSPIRED BY</small>
         <b id="postcard-value">Unity (รู้คุณค่าสามัคคี)</b>
        </div>
        <div class="stamp-verified-mark">✓ ONE HEART</div>
       </div>
      </div>
      <div class="postcard-face postcard-back">
       <div class="postcard-foil-border"></div>
       <div class="back-post-mark">
        <span>BANGKOK</span>
        <b>EVERYDAY SPACE</b>
       </div>
       <div class="back-lines">
        <div></div><div></div><div></div>
       </div>
       <p class="back-quote">“สิ่งเล็ก ๆ ที่เราขอบคุณกันในวันนี้ จะกลายเป็นพลังของทีมในวันพรุ่งนี้”</p>
       <span class="back-logo">BAFS GROUP ONE</span>
      </div>
     </div>
    </div>
   </div>
   <p class="flip-hint">👆 แตะหรือคลิกที่การ์ดเพื่อพลิกดูด้านหน้า / ด้านหลัง</p>
  </div>
 </div>
</div>

<section class="wall-section">
 <div class="section-head">
  <div>
   <span class="eyebrow">WALL OF GRATITUDE</span>
   <h2>เสียงขอบคุณจากเพื่อนร่วมทาง</h2>
  </div>
  <span class="helper">ตัวอย่างการส่งต่อความรู้สึกดี ๆ ในองค์กร</span>
 </div>
 ${thanksNotes()}
</section>`;

function applyPrompt(text){
 const t=$('#tbody');
 if(t){t.value=text;t.focus();updatePostcard()}
}

function flipStudioCard(){
 const c=$('#postcard');
 if(c)c.classList.toggle('flipped');
}

function updatePostcard(){
 if(!$('#postcard'))return;
 const coreInput=document.querySelector('input[name="category"]:checked');
 const c=coreValues.find(x=>x.id===(coreInput?.value||'U'))||coreValues[3];
 $('#postcard').style.setProperty('--core',c.color);
 $('#postcard').style.setProperty('--core-ink',c.ink);
 $('#postcard-letter').textContent=c.id;
 $('#postcard-value').textContent=`${c.name} (${c.thai})`;
 $('#postcard-to').textContent=$('#recipient')?.value.trim()||'เพื่อนที่อยากขอบคุณ';
 $('#postcard-text').textContent=$('#tbody')?.value.trim()||'ขอบคุณที่ทำให้เราเห็นว่า การไปด้วยกันมีความหมายแค่ไหน';
}

views.voice=()=>`${title('ONE VOICE / IDEA CANVAS','ทุกเสียงของคุณ เริ่มต้นความเปลี่ยนแปลงได้','แบ่งปันไอเดีย อุปสรรค หรือสิ่งที่คุณอยากเห็นใน BAFS GROUP')}${notice}
<div class="voice-canvas-layout">
 <div class="voice-canvas-main">
  <form class="panel sticky-creator-panel" onsubmit="submitEntry(event,'voices')" oninput="updateStickyPreview()">
   <div class="creator-step-label">
    <span class="step-num">01</span>
    <div>
     <h3>เลือกหมวดหมู่ไอเดียที่คุณอยากร่วมแชร์</h3>
     <p>ช่วยให้เรื่องราวถูกจัดกลุ่มไปยังทีมที่เกี่ยวข้องได้ตรงจุด</p>
    </div>
   </div>

   <div class="voice-category-grid" role="radiogroup" aria-label="หมวดหมู่ความคิดเห็น">
    ${[
     {id:'work',name:'ประสบการณ์ทำงาน',icon:'🌱',color:'#4fb9a3',desc:'ขั้นตอนการทำงาน การส่งต่องาน'},
     {id:'engage',name:'กิจกรรมและความผูกพัน',icon:'💡',color:'#d9792f',desc:'กิจกรรมองค์กร เวลาที่สะดวก'},
     {id:'place',name:'สภาพแวดล้อมและสถานที่',icon:'🏢',color:'#3b82f6',desc:'พื้นที่พัก อุปกรณ์ เครื่องมือ'},
     {id:'comm',name:'การสื่อสารและการรับฟัง',icon:'🤝',color:'#cfb9e8',desc:'การเปิดใจรับฟัง การคุยในทีม'},
     {id:'other',name:'ข้อเสนอแนะสร้างสรรค์',icon:'✨',color:'#f1b29e',desc:'ไอเดียใหม่ที่อยากชวนทดลอง'}
    ].map((cat,i)=>`
     <label class="voice-cat-card" style="--cat-color:${cat.color}">
      <input type="radio" name="category" value="${cat.name}" ${i===0?'checked':''} onchange="updateStickyPreview()">
      <span class="cat-icon">${cat.icon}</span>
      <strong>${cat.name}</strong>
      <small>${cat.desc}</small>
     </label>
    `).join('')}
   </div>

   <div class="creator-step-label" style="margin-top:28px">
    <span class="step-num">02</span>
    <div>
     <h3>เขียนไอเดียของคุณลงบนกระดาน</h3>
     <p>เขียนให้กระชับ ชัดเจน และเป็นมิตร</p>
    </div>
   </div>

   <div class="form-field">
    <label for="vtitle">หัวข้อไอเดียสั้น ๆ</label>
    <input id="vtitle" name="title" required maxlength="100" placeholder="เช่น อยากให้มีกิจกรรมยืดเส้นสั้น ๆ ช่วงเปลี่ยนกะ">
   </div>

   <div class="form-field">
    <label for="vbody">เล่าสิ่งที่อยากให้ดีขึ้น และแนวทางที่อยากเสนอ</label>
    <textarea id="vbody" name="body" required minlength="10" maxlength="1500" placeholder="เล่าสถานการณ์ปัจจุบัน สิ่งที่ติดขัด และถ้าปรับได้อยากให้เป็นแบบไหน…"></textarea>
    <p class="helper">10–1,500 ตัวอักษร • ใช้ข้อความจำลองสำหรับการทดสอบระบบ</p>
   </div>

   <div class="creator-actions">
    <button class="btn" type="submit">แปะไอเดียลงกระดาน ↗</button>
   </div>
  </form>
 </div>

 <aside class="voice-canvas-aside">
  <div class="sticky-preview-stage">
   <span class="eyebrow">STICKY NOTE PREVIEW</span>
   <div class="sticky-note-card" id="sticky-note">
    <div class="sticky-tape" aria-hidden="true"></div>
    <div class="sticky-cat-tag" id="sticky-cat">🌱 ประสบการณ์ทำงาน</div>
    <h4 id="sticky-title">อยากให้มีกิจกรรมสั้น ๆ ช่วงเปลี่ยนกะ</h4>
    <p id="sticky-body">เพื่อช่วยให้เพื่อนร่วมงานได้รีเฟรชพลังกายและคุยส่งต่องานด้วยความพร้อม</p>
    <div class="sticky-foot">
     <span>BAFS ONE VOICE</span>
     <small>IDEA CANVAS</small>
    </div>
   </div>
  </div>

  <div class="voice-pulse-card">
   <div class="pulse-icon">🤝</div>
   <h3>ทุกเสียง มีพื้นที่เสมอ</h3>
   <p>สิ่งเล็ก ๆ ที่คุณแชร์ อาจเป็นจุดประกายความเปลี่ยนแปลงครั้งใหญ่ของเพื่อนร่วมองค์กร</p>
   <div class="pulse-metrics">
    <div><b>18+</b><small>ไอเดียที่เริ่มทดลอง</small></div>
    <div><b>100%</b><small>รับฟังด้วยความเคารพ</small></div>
   </div>
   <a class="link-button" href="#change">ดูความเปลี่ยนแปลงที่เกิดขึ้น ↗</a>
  </div>
 </aside>
</div>`;

function updateStickyPreview(){
 const catInput=document.querySelector('input[name="category"]:checked');
 if($('#sticky-cat'))$('#sticky-cat').textContent=catInput?.value||'🌱 ประสบการณ์ทำงาน';
 if($('#sticky-title'))$('#sticky-title').textContent=$('#vtitle')?.value.trim()||'หัวข้อไอเดียของคุณ';
 if($('#sticky-body'))$('#sticky-body').textContent=$('#vbody')?.value.trim()||'รายละเอียดของสิ่งที่คุณอยากให้เกิดขึ้นจะแสดงตรงนี้…';
}

views.change=()=>`${title('ONE CHANGE / IMPACT ROADMAP','เสียงของเรา กำลังเปลี่ยนอะไรบ้าง','จากการรับฟัง สู่การลงมือทดลอง และสื่อสารผลลัพธ์กลับให้ทุกคนเห็น')}${notice}
<div class="change-pipeline-container">
 <div class="roadmap-summary-bar">
  <div class="summary-stat">
   <span class="stat-number">3</span>
   <span>โครงการตัวอย่างที่ขับเคลื่อน</span>
  </div>
  <div class="pipeline-legend">
   <span class="stage-tag stage-0">● รับฟังแล้ว</span>
   <span class="stage-tag stage-1">● กำลังดำเนินการ</span>
   <span class="stage-tag stage-2">● เกิดขึ้นแล้ว</span>
  </div>
 </div>

 <div class="tabs roadmap-filter-tabs" aria-label="กรองตามสถานะ">
  <button class="tab active" onclick="filterChanges(-1,this)" aria-pressed="true">ทั้งหมด (3)</button>
  ${stageNames.map((t,i)=>`
   <button class="tab" onclick="filterChanges(${i},this)" aria-pressed="false">${t} (${changes.filter(c=>c.stage===i).length})</button>
  `).join('')}
 </div>

 <div id="change-list" class="roadmap-cards-grid">
  ${changeCards(-1)}
 </div>
</div>`;

function changeCards(stage){
 return changes.filter(c=>stage<0||c.stage===stage).map(c=>`
  <article class="roadmap-item-card stage-${c.stage}">
   <div class="card-status-badge">
    <span class="status-indicator"></span>
    <b>${stageNames[c.stage]}</b>
    <small>${c.date||'ปี 2569'}</small>
   </div>
   <h3>${c.title}</h3>
   <p class="card-desc">${c.desc}</p>
   <div class="roadmap-milestone-track">
    <div class="milestone-line">
     <div class="milestone-progress" style="width:${c.stage===0?'20%':c.stage===1?'65%':'100%'}"></div>
    </div>
    <div class="milestone-nodes">
     <span class="node ${c.stage>=0?'active':''}">1. รับฟังแล้ว</span>
     <span class="node ${c.stage>=1?'active':''}">2. กำลังดำเนินการ</span>
     <span class="node ${c.stage>=2?'active':''}">3. เกิดขึ้นแล้ว ✓</span>
    </div>
   </div>
   <div class="card-outcome-box">
    <span class="outcome-label">ผลลัพธ์ / แนวทางดำเนินการ:</span>
    <p>${c.result}</p>
   </div>
   <div class="card-dept-tag">
    <span>ทีมรับผิดชอบ:</span>
    <b>${c.team}</b>
   </div>
  </article>
 `).join('');
}

function filterChanges(i,btn){
 document.querySelectorAll('.tab').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false')});
 btn.classList.add('active');
 btn.setAttribute('aria-pressed','true');
 $('#change-list').innerHTML=changeCards(i);
}

views.talk=()=>`${title('ONE TALK / DIALOGUE LOUNGE','ถามได้ เปิดใจคุยได้ และเชื่อมความเข้าใจกัน','พื้นที่สำหรับคำถามที่อยากชวนผู้นำและทีมที่เกี่ยวข้องมาพูดคุย')}${notice}
<div class="talk-lounge-layout">
 <div class="talk-deck-section">
  ${talkCard()}
 </div>

 <div class="talk-inquiry-grid">
  <form class="panel talk-ask-panel" onsubmit="submitEntry(event,'questions')">
   <div class="creator-step-label">
    <span class="step-num">💬</span>
    <div>
     <h3>ฝากคำถามที่อยากชวนพูดคุย</h3>
     <p>เลือกทีมที่อยากคุยด้วย และเขียนคำถามของคุณ</p>
    </div>
   </div>

   <div class="form-field">
    <label for="qteam">อยากชวนทีมไหนพูดคุย?</label>
    <div class="team-choice-pills">
     ${['ผู้บริหารองค์กร','ทีม HPE (ความผูกพันองค์กร)','ทีมสื่อสารองค์กร','ทีมดูแลสถานที่และปฏิบัติการ'].map((team,i)=>`
      <label class="team-choice-pill">
       <input type="radio" name="title" value="${team}" ${i===0?'checked':''}>
       <span>${team}</span>
      </label>
     `).join('')}
    </div>
   </div>

   <div class="form-field">
    <label for="qbody">คำถามหรือข้อสงสัยของคุณ</label>
    <textarea id="qbody" name="body" required minlength="10" maxlength="1000" placeholder="อยากรู้ อยากเสนอ หรืออยากเข้าใจนโยบายและเรื่องใดมากขึ้น…"></textarea>
    <p class="helper">ทุกคำถามคือโอกาสในการสร้างความเข้าใจร่วมกัน</p>
   </div>

   <button class="btn" type="submit">ส่งคำถามเข้าสู่วงสนทนา ↗</button>
  </form>

  <section class="panel talk-faq-panel">
   <span class="eyebrow">DIALOGUE ARCHIVE</span>
   <h3>ตัวอย่างหัวข้อพูดคุยที่ผ่านมา</h3>
   <div class="talk-faq-list">
    <details open>
     <summary>พนักงานต่างกะจะเข้าร่วมกิจกรรมองค์กรได้อย่างไร?</summary>
     <p>แนวทางของ BAFS ONE คือการออกแบบกิจกรรมที่เล่นได้ตามเวลาที่สะดวก และขยายกรอบเวลากิจกรรมให้พนักงานทุกกะเข้าถึงได้อย่างเท่าเทียม</p>
    </details>
    <details>
     <summary>จะรู้ได้อย่างไรว่าไอเดียได้รับการพิจารณา?</summary>
     <p>ทีมงานจะอัปเดตสถานะและแนวทางดำเนินการผ่านหน้า ONE CHANGE เป็นระยะ เพื่อความโปร่งใสและให้ทุกคนเห็นผลลัพธ์ร่วมกัน</p>
    </details>
    <details>
     <summary>ค่านิยม GROUP นำมาใช้ในงานประจำวันอย่างไร?</summary>
     <p>เริ่มจากก้าวเล็ก ๆ ในด่านภารกิจ Checkpoint เช่น การรับฟังเพื่อนต่างทีม (Unity) หรือการตรวจความถูกต้องก่อนส่งต่องาน (Professional)</p>
    </details>
   </div>
  </section>
 </div>
</div>`;

function myEntries(){
 const all=[...state.games.map(x=>({...x,kind:'ONE PLAY'})),...state.voices.map(x=>({...x,kind:'ONE VOICE'})),...state.thanks.map(x=>({...x,kind:'ONE THANKS'})),...state.questions.map(x=>({...x,kind:'ONE TALK'}))].sort((a,b)=>b.time-a.time);
 return all.length?all.map(x=>`<div class="entry"><small>${x.kind} · ${new Date(x.time).toLocaleDateString('th-TH')}</small><br><b>${esc(x.title)}</b><p>${esc(x.body)}</p></div>`).join(''):'<div class="empty">ยังไม่มีกิจกรรมที่บันทึกไว้<br>ลองเล่นเกม หรือเขียนคำขอบคุณแรกของคุณ</div>';
}

function submitEntry(e,key){
 e.preventDefault();
 const data=new FormData(e.target);
 const v={title:String(data.get('title')).trim(),body:String(data.get('body')).trim(),category:data.get('category')||'',time:Date.now()};
 if(!v.title||v.body.length<(key==='thanks'?5:10)){toast('กรุณาใส่ข้อความให้ครบ ไม่ใช้เฉพาะช่องว่าง');return}
 state[key].push(v);
 save();
 e.target.reset();
 openModal('บันทึกแล้ว',`<span class="success-mark">✓</span><h2>บันทึกไว้ในพื้นที่ของคุณแล้ว</h2><p>ข้อมูลนี้อยู่ในเบราว์เซอร์นี้เท่านั้น ยังไม่ได้ส่งถึงผู้รับ</p><button class="btn" onclick="closeModal();go('my')">ดูใน MY ONE</button>`);
}
