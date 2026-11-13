import { readFile, stat } from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const profile=JSON.parse(await readFile('content/profile.json','utf8'));
const projects=JSON.parse(await readFile('content/projects.json','utf8'));
const ids=projects.map(p=>p.id);
assert.equal(ids.length,new Set(ids).size,'Project ids must be unique');
for(const track of profile.tracks){
  assert(track.order.length>0);
  for(const id of track.order)assert(ids.includes(id),`Unknown project ${id}`);
}
for(const p of projects){
  assert(p.name && p.summary && p.roles.length && p.details.length,`Incomplete project ${p.id}`);
  for(const link of p.links)assert(new URL(link.url).protocol==='https:',`External URL must use HTTPS: ${link.url}`);
  for(const image of p.images){assert(image.alt && image.caption,`Image needs alt and caption: ${p.id}`);assert(image.src.startsWith('/images/'));await stat('public'+image.src);}
}
const html=await readFile('dist/index.html','utf8');
const htmlIds=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(htmlIds.length,new Set(htmlIds).size,'Duplicate HTML ids');
for(const match of html.matchAll(/(?:href|src|data-image)="(\/[^"#?]*)[^\"]*"/g)){
 const path=match[1];
 if(path==='/')continue;
 assert((await stat(resolve('dist','.'+path))).isFile(),`Missing asset: ${path}`);
}
for(const match of html.matchAll(/href="#([^"]+)"/g))assert(htmlIds.includes(match[1]),`Broken anchor ${match[1]}`);
for(const match of html.matchAll(/<img\b[^>]+>/g))assert(/alt="[^"]+"/.test(match[0]),'Image missing useful alt text');
assert(!/DenysOS|TODO|Lorem ipsum/.test(html),'Unfinished or retired content in public page');
const pdf=await readFile('dist'+profile.cv.url);
assert.equal(pdf.subarray(0,5).toString(),'%PDF-','Download must be a PDF');
console.log(`PASS: ${projects.length} projects, 3 tracks, unique anchors, image metadata and local assets including CV.`);
