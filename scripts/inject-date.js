const fs = require("fs");
const path = require("path");

const today = new Date().toISOString().split("T")[0];
const indexFile = path.join(__dirname, "../index.html");
const sitemapFile = path.join(__dirname, "../sitemap.xml");

let html = fs.readFileSync(indexFile, "utf-8");
html = html.replace(
  /"dateModified":\s*"\d{4}-\d{2}-\d{2}"/g,
  `"dateModified": "${today}"`
);
fs.writeFileSync(indexFile, html);
console.log(`[inject-date] index dateModified aggiornato a ${today}`);

let sitemap = fs.readFileSync(sitemapFile, "utf-8");
sitemap = sitemap.replace(
  /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
  `<lastmod>${today}</lastmod>`
);
fs.writeFileSync(sitemapFile, sitemap);
console.log(`[inject-date] sitemap lastmod aggiornato a ${today}`);
