import fs from 'node:fs/promises';import vm from 'node:vm';
const ctx={};vm.createContext(ctx);vm.runInContext(await fs.readFile('public/data.js','utf8')+'\n'+await fs.readFile('public/rules.js','utf8')+'\nglobalThis.R=RULES;globalThis.games=gameCatalog',ctx);const catalog=[];
for(const [i,g] of ctx.games.entries())for(let level=1;level<=3;level++)for(let variant=0;variant<7;variant++){
 const seed=20260908+i*101+level*991+variant*47,c=ctx.R.config(g.id,level,seed),d={id:g.id+'_'+level+'_'+variant,game:g.id,level,seed,core:Object.keys(ctx.R.primary).find(k=>ctx.R.primary[k]===g.id)||'',n:0,limit:0,target:0,count:0,expected:[],blocked:[],allowed:[],edges:[],budget:0,metrics:[]};
 if(c.id==='pattern'){d.expected=c.lengths.flatMap(n=>c.sequence.slice(0,n))}
 if(c.id==='signal'){d.expected=c.rounds.map(r=>r[r.rule]);d.target=c.target;d.count=c.count}
 if(c.id==='decision'){d.expected=c.scenarios.map(s=>s.ok);d.target=c.target;d.count=c.count}
 if(c.id==='route'){d.n=c.n;d.limit=c.limit;d.blocked=c.blocked;d.allowed=Array.from({length:c.n*c.n},(_,i)=>i).filter(i=>!c.blocked.includes(i));d.edges=d.allowed.flatMap(i=>ctx.R.adjacent(i,c.n).filter(j=>d.allowed.includes(j)).map(j=>i*36+j))}
 if(c.id==='memory'){d.expected=c.cards.map((x,i)=>{const j=c.cards.findIndex((v,k)=>k>i&&v.pair===x.pair);return j<0?null:i*10+j}).filter(x=>x!==null)}
 if(c.id==='spot')d.expected=c.items.map((x,i)=>x[2]?i:null).filter(x=>x!==null);
 if(c.id==='word')d.expected=c.words;
 if(c.id==='remix'){d.budget=c.budget;const t=c.target;d.metrics=[t[0]*3+t[1],t[1]*3+t[2],t[2]*3+t[0]]}
 catalog.push(d);
}
if(catalog.some(c=>c.game==='route'&&c.limit>12))throw Error('Update bounded route validator before publishing this catalog');
await fs.writeFile('public/catalog.json',JSON.stringify(catalog));
for(const file of await fs.readdir('public'))if(file.endsWith('.js')&&!['firebase-client.js'].includes(file))new vm.Script(await fs.readFile('public/'+file,'utf8'),{filename:file});
const html=await fs.readFile('public/index.html','utf8');for(const [,asset]of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))(?:\?[^"]*)?"/g))await fs.access('public/'+asset);
console.log('Validated assets; generated '+catalog.length+' trusted game challenges.');
