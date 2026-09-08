import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
async function walk(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(async e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();}
const root='dist/client';const files=await walk(root);
const assets=files.filter(f=>/\.(js|css|woff2|png|webmanifest)$/.test(f)&&!f.endsWith('/sw.js')).map(f=>'/'+path.relative(root,f).split(path.sep).join('/'));
const hash=createHash('sha256');for(const f of files.filter(f=>!f.endsWith('/sw.js')).sort())hash.update(await readFile(f));
const worker=(await readFile('public/sw.js','utf8')).replace('__BUILD__',hash.digest('hex').slice(0,16)).replace(/\/\*PRECACHE\*\/\[[^;]+\]/,JSON.stringify(['/',...assets]));
await writeFile(root+'/sw.js',worker);console.log(`PWA: prepared offline shell and ${assets.length} local assets.`);
