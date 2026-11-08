import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const dir='docs/monetizacao/consentimento-adsense';
fs.mkdirSync(dir,{recursive:true});
const commands=[['estados','node --import tsx --test scripts/consent.test.ts'],['lint','npm run lint'],['typecheck','npx --no-install tsc --noEmit'],['build','npm run build']];
const results=[];
for(const [name,command] of commands){
  const startedAt=new Date().toISOString();
  const result=spawnSync(process.env.ComSpec||'cmd.exe',['/d','/s','/c',command],{encoding:'utf8',windowsHide:true,maxBuffer:10*1024*1024});
  fs.writeFileSync(dir+'/'+name+'.log',(result.stdout||'')+(result.stderr||''),'utf8');
  results.push({name,command,startedAt,exitCode:result.status,error:result.error?.message});
  console.log(name+': '+result.status);
  if(result.status!==0){console.log((result.stdout||'')+(result.stderr||''));break;}
}
fs.writeFileSync(dir+'/validacoes.json',JSON.stringify({node:process.version,results},null,2)+'\n','utf8');
if(results.length!==commands.length||results.some(r=>r.exitCode!==0))process.exitCode=1;
