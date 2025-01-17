import qr from "npm:qr-image";
import { minify } from "npm:terser";
import fs from "node:fs";

function getByteLength(str) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return bytes.length;
}

const script = fs.readFileSync("script.js", "utf8");

console.log(`Original size: ${script.length} bytes`);

const minified = await minify(script);

const prefixed =
  "data:text/html,<script>" + encodeURI(minified.code) + "</script>";

console.log(`Minified size: ${getByteLength(prefixed)} bytes`);

const qrcode = qr.image(prefixed, { type: "png", ec_level: "L" });
qrcode.pipe(fs.createWriteStream("qrcode.png"));
