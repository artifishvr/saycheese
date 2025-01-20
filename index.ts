import qr from "npm:qr-image";
import { minify } from "npm:terser";
import fs from "node:fs";

function getByteLength(str: string): number {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return bytes.length;
}

const script = fs.readFileSync("script.js", "utf8");

console.log(`Original size: ${script.length} bytes`);

const minified = await minify(script);

function customURIEncode(str: string): string {
  str = encodeURIComponent(str);
  return str.replace(/#/g, "%23");
}

const prefixed =
  'data:text/html,<meta charset="UTF-8"/><script>' +
  customURIEncode(minified.code) +
  "</script>";

console.log(`Minified size: ${getByteLength(prefixed)} bytes`);

const qrcode = qr.image(prefixed, { type: "png", ec_level: "L" });
qrcode.pipe(fs.createWriteStream("qrcode.png"));
