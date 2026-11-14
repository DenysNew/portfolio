// Reproduce the portfolio crops from a local learning-admin checkout.
// Original evidence is never overwritten; opaque masks remove identifiers.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/prepare-admin-images.mjs /path/to/learning-admin');
const output = 'public/images/projects/admin';
mkdirSync(output, { recursive: true });
const dhcp = '10-admin/windows/active-directory/artifacts/dhcp-after-dc-promotion/';
const ca = '20-microsoft365/30-security/conditional-access-compliant-device/artifacts/';
const jobs = [
  ['entra-sync', '20-microsoft365/20-hybrid-identity/artifacts/ad-connect-sync-operations-success.png', '897x390+303+247', [[520,253,635,274],[304,370,424,625]]],
  ['intune-device', ca+'vm-device-info.png', '750x300+925+40', [[1045,145,1320,169]]],
  ['conditional-access', ca+'host-conditional-access.png', '750x350+934+40', []],
  ['dhcp-before', dhcp+'client-apipa-address-no-dhcp.png', '1114x390+182+248', [[535,504,803,524]]],
  ['dhcp-after', dhcp+'client-received-ip-from-dhcp.png', '1115x390+78+154', [[432,410,700,430]]],
  ['dns-result', dhcp+'nslookup-lab-local-success.png', '961x218+24+0', [[119,96,420,113]]],
  ['vpn-service', '30-vpn/30-network-access/artifacts/openvpn-server-running.png', '1265x405+0+76', [[0,78,319,95]]],
  ['vpn-client', '30-vpn/20-openvpn-client/artifacts/vpn-client-connected.png', '597x943+281+20', [[430,296,722,362],[713,675,805,709],[663,772,805,804]]],
  ['vpn-ping', '30-vpn/30-network-access/artifacts/ping-lab-success.png', '1060x510+0+16', [[0,168,212,196]]]
];
const manifest = jobs.map(([name, path, crop, masks]) => {
  const input = resolve(source,path), file = `${output}/${name}.png`;
  execFileSync('magick',[input,'-fill','#94a3b8',...masks.flatMap(m=>['-draw',`rectangle ${m[0]},${m[1]} ${m[2]},${m[3]}`]),'-crop',crop,'+repage','-strip',file]);
  return {file, source:path, crop, opaqueMasks:masks, sourceSha256:createHash('sha256').update(readFileSync(input)).digest('hex'), outputSha256:createHash('sha256').update(readFileSync(file)).digest('hex')};
});
writeFileSync('docs/admin-image-provenance.json',JSON.stringify({repository:'https://github.com/DenysNew/learning-admin',commit:'3f21bb384a6a637112d123389ffef9bf3ae3c258',method:'ImageMagick crop, opaque masks, metadata removal; no reconstructed or translated content.',images:manifest},null,2)+'\n');
console.log(`Prepared ${jobs.length} evidence screenshots.`);
