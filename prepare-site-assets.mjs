#!/usr/bin/env node
/**
 * JC Informática — prepara os assets para o novo site.
 *
 * Uso:
 *   node prepare-site-assets.mjs "C:\caminho\para\jc-vendizap-scraper-api" "C:\caminho\para\novo-site"
 *
 * O primeiro caminho deve conter downloaded/products/.
 * O segundo é a raiz do novo projeto.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const scraperRoot = process.argv[2];
const projectRoot = process.argv[3];

if (!scraperRoot || !projectRoot) {
  console.error('Uso: node prepare-site-assets.mjs "<pasta-do-scraper>" "<pasta-do-site>"');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(path.join(here, "asset-manifest.json"), "utf8"));
const targetDir = path.join(projectRoot, "public", "images", "products");
const dataDir = path.join(projectRoot, "src", "data");
fs.mkdirSync(targetDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

let copied = 0;
let missing = 0;

for (const item of manifest) {
  const source = path.resolve(scraperRoot, item.source);
  const destination = path.join(projectRoot, item.destination);
  if (!fs.existsSync(source)) {
    console.warn("Faltando:", source);
    missing++;
    continue;
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  copied++;
}

for (const file of ["products.json", "categories.json", "homepage.json"]) {
  fs.copyFileSync(path.join(here, file), path.join(dataDir, file));
}

console.log(`\nConcluído: ${copied} imagens copiadas; ${missing} ausentes.`);
console.log(`Dados copiados para: ${dataDir}`);
console.log(`Imagens copiadas para: ${targetDir}`);
