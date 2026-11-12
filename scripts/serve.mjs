import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('dist');
const arg=process.argv.indexOf('--port');
const port=Number(process.env.PORT || (arg>=0?process.argv[arg+1]:3000));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.pdf':'application/pdf','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
http.createServer(async(req,res)=>{
  let path;
  try {path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);} catch {res.writeHead(400);res.end();return;}
  const target=resolve(root,'.'+(path==='/'?'/index.html':path));
  if(!target.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  try {if(!(await stat(target)).isFile())throw new Error('not file');res.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(target));}
  catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(resolve(root,'404.html')));}
}).listen(port,'0.0.0.0',()=>console.log(`Portfolio preview listening on ${port}`));
