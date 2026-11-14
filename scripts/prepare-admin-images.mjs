// Reproduce the portfolio crops from a local learning-admin checkout.
// Originals are never overwritten. Lab addresses, test accounts and VM names remain visible.
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
  ['ad-structure', '20-microsoft365/10-onprem-identity/artifacts/OU_structure.png', '754x531+100+152', []],
  ['rsat-tools', '10-admin/windows/artifacts/admin-workstation/rsat-tools-visible-in-windows-tools.png', '1304x825+0+79', []],
  ['teams-license', '20-microsoft365/10-user-management/artifacts/11-teams-disabled-in-license.png', '910x820+470+220', []],
  ['teams-denied', '20-microsoft365/10-user-management/artifacts/12-teams-access-denied.png', '900x460+260+330', []],
  ['linux-permissions', '10-admin/linux/artifacts/permissions/01-basic-permissions.png', '1098x620+38+101', []],
  ['virtualbox-network', 'images/lab-virtualization/vm-settings/ubuntu-server-network-lab-net.png', '940x527+390+132', []],
  ['entra-sync', '20-microsoft365/20-hybrid-identity/artifacts/ad-connect-sync-operations-success.png', '897x390+303+247', []],
  ['intune-device', ca+'vm-device-info.png', '750x300+925+40', []],
  ['conditional-access', ca+'host-conditional-access.png', '750x350+934+40', []],
  ['dhcp-before', dhcp+'client-apipa-address-no-dhcp.png', '1114x390+182+248', []],
  ['dhcp-after', dhcp+'client-received-ip-from-dhcp.png', '1115x390+78+154', []],
  ['dns-result', dhcp+'nslookup-lab-local-success.png', '961x218+24+0', []],
  ['vpn-service', '30-vpn/30-network-access/artifacts/openvpn-server-running.png', '1265x405+0+76', []],
  ['vpn-client', '30-vpn/20-openvpn-client/artifacts/vpn-client-connected.png', '597x943+281+20', []],
  ['vpn-ping', '30-vpn/30-network-access/artifacts/ping-lab-success.png', '1060x510+0+16', []]
];
const manifest = jobs.map(([name, path, crop, masks]) => {
  const input = resolve(source,path), file = `${output}/${name}.png`;
  execFileSync('magick',[input,'-fill','#94a3b8',...masks.flatMap(m=>['-draw',`rectangle ${m[0]},${m[1]} ${m[2]},${m[3]}`]),'-crop',crop,'+repage','-strip',file]);
  return {file, source:path, crop, opaqueMasks:masks, sourceSha256:createHash('sha256').update(readFileSync(input)).digest('hex'), outputSha256:createHash('sha256').update(readFileSync(file)).digest('hex')};
});
writeFileSync('docs/admin-image-provenance.json',JSON.stringify({repository:'https://github.com/DenysNew/learning-admin',commit:'3f21bb384a6a637112d123389ffef9bf3ae3c258',method:'ImageMagick crop and metadata removal. Lab identifiers retained at owner request; no reconstructed or translated content.',images:manifest},null,2)+'\n');
console.log(`Prepared ${jobs.length} evidence screenshots.`);
