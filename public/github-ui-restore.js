// GitHub owns the signed-in presentation. Firebase continues to own identity,
// authorization, persistence, private community records and HPE operations.
const githubUI=window.GITHUB_UI_MASTER;
if(githubUI){
 orbPanel=githubUI.helpers.orbPanel;
 cycleOrb=githubUI.helpers.cycleOrb;
 chooseMood=githubUI.helpers.chooseMood;
 moodResponse=githubUI.helpers.moodResponse;
 recordMood=githubUI.helpers.recordMood;
 modeNext=githubUI.helpers.modeNext;
 pauseMoment=githubUI.helpers.pauseMoment;
 applyAtmosphere=githubUI.helpers.applyAtmosphere;
 dailyHighlight=githubUI.helpers.dailyHighlight;
 communityTiles=githubUI.helpers.communityTiles;
 floatingNav=githubUI.helpers.floatingNav;
 views.home=githubUI.views.home;
 views.checkin=githubUI.views.checkin;
 const cloudNotice='<div class="notice">พื้นที่สำหรับสมาชิกที่ได้รับอนุมัติ · ONE THANKS ส่งถึงผู้รับโดยตรง · ONE VOICE ส่งถึง HPE และติดตามคำตอบได้</div>';
 views.community=()=>githubUI.views.community().replace(notice,cloudNotice).replace('บันทึกส่วนตัวในอุปกรณ์นี้ ยังไม่ส่งถึงผู้รับหรือ HPE','ข้อมูลแต่ละพื้นที่ถูกส่งและมองเห็นตามสิทธิ์ที่ระบุ');
 views.thanks=()=>githubUI.views.thanks().replace(notice,cloudNotice)
  .replace(/<input id="recipient"[^>]*>/,`<select id="recipient" name="recipient" required onchange="updatePostcard()"><option value="">เลือกเพื่อนที่ต้องการขอบคุณ</option>${oneData.directory.filter(p=>p.id!==FB.auth.currentUser.uid).map(p=>`<option value="${p.id}">${esc(p.name)}${p.team?' · '+esc(p.team):''}</option>`).join('')}</select>`)
  +`<section class="wall-section"><div class="section-head"><div><span class="eyebrow">MY FIREBASE INBOX</span><h2>คำขอบคุณที่เดินทางมาถึง</h2></div><button class="link-button" onclick="refreshCommunity()">อัปเดต ↻</button></div>${thanksInbox()}</section>`;
 views.voice=()=>githubUI.views.voice().replace(notice,cloudNotice)
  +`<section class="wall-section"><div class="section-head"><div><span class="eyebrow">MY ONE VOICE</span><h2>เรื่องที่คุณฝากไว้กับ HPE</h2></div><button class="link-button" onclick="refreshCommunity()">อัปเดต ↻</button></div>${oneData.voices.map(v=>`<article class="voice-thread"><span class="status">${voiceStatus(v.status)}</span><h3>${esc(v.topic)}</h3><p>${esc(v.body)}</p>${v.reply?`<div class="hpe-answer"><b>HPE ตอบกลับ</b><p>${esc(v.reply)}</p></div>`:'<p class="helper">ส่งถึงพื้นที่ HPE แล้ว ยังไม่มีคำตอบ</p>'}</article>`).join('')||'<p class="empty">ยังไม่มีเรื่องที่ส่งถึง HPE</p>'}</section>`;
 views.change=()=>githubUI.views.change().replace(notice,cloudNotice)
  +`<section class="wall-section"><div class="section-head"><div><span class="eyebrow">HPE / LIVE UPDATE</span><h2>ความคืบหน้าที่เผยแพร่จริง</h2></div></div>${oneData.changes.map(c=>`<article class="roadmap-item-card"><span class="status">${{listening:'รับฟังแล้ว',working:'กำลังดำเนินการ',done:'เกิดขึ้นแล้ว'}[c.stage]||c.stage}</span><h3>${esc(c.title)}</h3><p>${esc(c.before)}</p><div class="card-outcome-box"><b>ความคืบหน้า</b><p>${esc(c.after)}</p></div></article>`).join('')||'<p class="empty">เมื่อ HPE เผยแพร่ความคืบหน้า ข้อมูลจะปรากฏตรงนี้</p>'}</section>`;
 views.talk=()=>githubUI.views.talk().replace(notice,cloudNotice)
  +`<section class="wall-section"><div class="section-head"><div><span class="eyebrow">LIVE DIALOGUE</span><h2>วงสนทนาของสมาชิก</h2></div><button class="link-button" onclick="refreshCommunity()">อัปเดต ↻</button></div><div id="talk-list">${talkList()}</div></section>`;
 const githubMy=githubUI.views.my;
 views.my=()=>githubMy()
  .replace(/<a[^>]+signout-with-chatgpt[^>]*>[^<]*<\/a>/,'')
  +`<div class="account-actions">${oneRole==='hpe'?'<a href="#admin">HPE Studio ↗</a>':''}<button class="link-button" onclick="oneSignOut()">ออกจากระบบ</button></div>`;

 updatePostcard=function(){
  if(!$('#postcard'))return;
  const coreInput=document.querySelector('input[name="category"]:checked');
  const c=coreValues.find(x=>x.id===(coreInput?.value||'U'))||coreValues[3];
  $('#postcard').style.setProperty('--core',c.color);$('#postcard').style.setProperty('--core-ink',c.ink);
  $('#postcard-letter').textContent=c.id;$('#postcard-value').textContent=`${c.name} (${c.thai})`;
  $('#postcard-to').textContent=$('#recipient')?.selectedOptions?.[0]?.textContent||'เพื่อนที่อยากขอบคุณ';
  $('#postcard-text').textContent=$('#tbody')?.value.trim()||'ขอบคุณที่ทำให้เราเห็นว่า การไปด้วยกันมีความหมายแค่ไหน';
 };

 submitEntry=async function(e,key){
  e.preventDefault();const data=new FormData(e.target),button=e.target.querySelector('button[type="submit"]');
  const title=String(data.get('title')||'').trim(),body=String(data.get('body')||'').trim(),category=String(data.get('category')||'').trim();
  if(body.length<(key==='thanks'?5:10))return toast('กรุณาใส่ข้อความให้ครบ ไม่ใช้เฉพาะช่องว่าง');
  if(key==='thanks'){
   const recipient=String(data.get('recipient')||'');if(!recipient)return toast('กรุณาเลือกเพื่อนที่ต้องการขอบคุณ');
   await safeAction(button,()=>FB.addDoc(FB.collection(FB.db,'thanks'),{sender:FB.auth.currentUser.uid,recipient,core:category||'U',body,public:false,createdAt:FB.serverTimestamp()}));
  }else if(key==='voices'){
   if(!title)return toast('กรุณาระบุหัวข้อไอเดีย');
   await safeAction(button,()=>FB.addDoc(FB.collection(FB.db,'voices'),{author:FB.auth.currentUser.uid,topic:`${category}${category&&title?' · ':''}${title}`,body,status:'received',reply:'',createdAt:FB.serverTimestamp()}));
  }else if(key==='questions'){
   await safeAction(button,()=>FB.addDoc(FB.collection(FB.db,'talks'),{author:FB.auth.currentUser.uid,body:`${title}${title&&body?'\n':''}${body}`,createdAt:FB.serverTimestamp(),updatedAt:FB.serverTimestamp()}));
  }
 };
}
