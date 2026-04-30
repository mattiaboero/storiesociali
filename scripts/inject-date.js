const fs = require("fs");
const path = require("path");

const today = new Date().toISOString().split("T")[0];
const file = path.join(__dirname, "../index.html");

let html = fs.readFileSync(file, "utf-8");
html = html.replace(
  /"dateModified":\s*"\d{4}-\d{2}-\d{2}"/g,
  `"dateModified": "${today}"`
);

fs.writeFileSync(file, html);
console.log(`[inject-date] dateModified aggiornato a ${today}`);
