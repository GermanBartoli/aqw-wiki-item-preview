import { copyFileSync, cpSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));
if (manifest.manifest_version !== 3 || !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
  throw new Error('Manifest o versión inválidos');
}

for (const file of manifest.content_scripts.flatMap(script => [...script.js, ...script.css])) {
  if (file.endsWith('.js')) execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  readFileSync(file);
}

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
copyFileSync('manifest.json', 'dist/manifest.json');
cpSync('src', 'dist/src', { recursive: true });
cpSync('assets', 'dist/assets', { recursive: true });
console.log(`Extensión v${manifest.version} generada en dist/`);
