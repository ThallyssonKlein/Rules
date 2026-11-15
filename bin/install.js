#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PREFIX = 'rules-';
const DEFAULT_DEST = '.claude/rules';

const listPacks = () =>
  readdirSync(ROOT).filter(
    (name) => name.startsWith(PREFIX) && statSync(join(ROOT, name)).isDirectory(),
  );

const listFiles = (dir, base = dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full, base) : [full.slice(base.length + 1)];
  });

const parseArgs = (argv) => {
  const args = { positional: [], dest: DEFAULT_DEST, force: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--force') args.force = true;
    else if (argv[i] === '--dest') args.dest = argv[++i];
    else args.positional.push(argv[i]);
  }
  return args;
};

const usage = () => {
  console.log(`Uso:
  rules list                          Lista os pacotes disponíveis
  rules install <pacote> [opções]     Copia as regras para o projeto atual

Opções:
  --dest <dir>   Diretório de destino (padrão: ${DEFAULT_DEST})
  --force        Sobrescreve arquivos existentes`);
};

const list = () => {
  console.log('Pacotes disponíveis:');
  listPacks().forEach((name) => console.log(`  ${name.slice(PREFIX.length)}`));
};

const install = ({ positional, dest, force }) => {
  const input = positional[1];
  if (!input) {
    usage();
    process.exit(1);
  }
  const pack = input.startsWith(PREFIX) ? input : `${PREFIX}${input}`;
  if (!listPacks().includes(pack)) {
    console.error(`Pacote "${input}" não encontrado.\n`);
    list();
    process.exit(1);
  }

  const source = join(ROOT, pack);
  const target = resolve(process.cwd(), dest);
  let copied = 0;
  let skipped = 0;

  for (const file of listFiles(source)) {
    const to = join(target, file);
    if (existsSync(to) && !force) {
      skipped++;
      continue;
    }
    mkdirSync(dirname(to), { recursive: true });
    cpSync(join(source, file), to);
    copied++;
  }

  console.log(`${copied} arquivo(s) copiado(s) para ${dest}`);
  if (skipped) console.log(`${skipped} já existia(m) e foi(ram) ignorado(s). Use --force para sobrescrever.`);
};

const args = parseArgs(process.argv.slice(2));
const command = args.positional[0];

if (command === 'list') list();
else if (command === 'install') install(args);
else {
  usage();
  process.exit(command ? 1 : 0);
}
