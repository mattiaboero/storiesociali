#!/usr/bin/env node

const key = "2f7cb2b59b2b4e9ca0f4fba5f8d89a4c";
const host = "storiesociali.org";

const inputUrls = process.argv.slice(2);

if (!inputUrls.length) {
  console.error("Uso: node scripts/indexnow-submit.mjs <url1> <url2> ...");
  process.exit(1);
}

const urlList = inputUrls.map((url) => {
  if (!/^https:\/\//i.test(url)) {
    throw new Error(`URL non valida (serve https): ${url}`);
  }
  return url;
});

const payload = {
  host,
  key,
  keyLocation: `https://${host}/indexnow-${key}.txt`,
  urlList
};

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
});

if (!response.ok) {
  const text = await response.text();
  console.error(`Errore IndexNow: ${response.status} ${response.statusText}`);
  console.error(text);
  process.exit(1);
}

console.log("IndexNow inviato con successo per", urlList.length, "URL.");
