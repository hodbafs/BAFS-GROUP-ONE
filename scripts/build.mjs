import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
const assets={};
for(const name of await fs.readdir('public')){const ext=path.extname(name);if(!mime[ext])continue;const body=await fs.readFile('public/'+name,'utf8');if(ext==='.js')new vm.Script(body,{filename:name});assets['/'+name]={body,type:mime[ext]}}
const rules=await fs.readFile('shared/rules.js','utf8');assets['/rules.js']={body:rules,type:mime['.js']};new vm.Script(rules);
const bundle='const ASSETS='+JSON.stringify(assets)+';\n'+await fs.readFile('public/data.js','utf8')+'\n'+rules+'\n'+await fs.readFile('server/worker.js','utf8');
await fs.mkdir('dist/server',{recursive:true});await fs.mkdir('dist/.openai',{recursive:true});await fs.writeFile('dist/server/index.js',bundle);await fs.copyFile('.openai/hosting.json','dist/.openai/hosting.json');await fs.cp('drizzle','dist/.openai/drizzle',{recursive:true});console.log('Built ONE Worker with '+Object.keys(assets).length+' assets and D1 migrations.');
