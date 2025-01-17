import { minify } from "npm:terser";
import fs from "node:fs";

const script = fs.readFileSync("script.js", "utf8");

const minified = await minify(script);

const prefixed =
  "data:text/html,<script>" + encodeURIComponent(minified.code) + "</script>";

console.log(prefixed);
console.log("paste this into qrcode-monkey.com");
