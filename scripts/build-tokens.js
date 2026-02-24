import fs from "fs";
import path from "path";

const tokens = JSON.parse(
  fs.readFileSync("src/tokens/design-tokens.json", "utf-8")
);

const g = tokens.global;
const s = tokens.semantic;

const lines = [];

const add = (prop, value) => lines.push(`  ${prop}: ${value};`);

// ── Breakpoints ──
add("--breakpoint-sm", "375px");
add("--breakpoint-md", "768px");
add("--breakpoint-lg", "1440px");

// ── Global Color Primitives ──
for (const [name, value] of Object.entries(g.color)) {
  add(`--color-${name}`, value);
}

// ── Semantic: Background ──
for (const [name, token] of Object.entries(s.color.bg)) {
  add(`--color-bg-${name}`, token.value);
}

// ── Semantic: Content ──
for (const [name, token] of Object.entries(s.color.content)) {
  add(`--color-content-${name}`, token.value);
}

// ── Semantic: Border ──
for (const [name, token] of Object.entries(s.color.border)) {
  add(`--color-border-${name}`, token.value);
}

// ── Spacing ──
for (const [name, value] of Object.entries(g.spacing)) {
  add(`--spacing-${name}`, value);
}

// ── Border Radius ──
for (const [name, value] of Object.entries(g["border-radius"])) {
  add(`--radius-${name}`, value);
}

// ── Border Width ──
for (const [name, value] of Object.entries(g["border-width"])) {
  add(`--border-width-${name}`, value);
}

// ── Shadows ──
const sm = g.shadow.small;
const def = g.shadow.default;
add("--shadow-sm", `${sm.x} ${sm.y} ${sm.blur} var(--color-border-default)`);
add("--shadow-default", `${def.x} ${def.y} ${def.blur} var(--color-border-default)`);

// ── Font Families ──
add("--font-display", g.typography["font-family"].display);
add("--font-sans", g.typography["font-family"].sans);

const theme = `/* AUTO-GENERATED — do not edit by hand */
/* Run \`node scripts/build-tokens.js\` to regenerate */

@theme {
${lines.join("\n")}
}
`;

const outPath = path.resolve("src/styles/generated-theme.css");
fs.writeFileSync(outPath, theme, "utf-8");
console.log(`✓ Theme written to ${outPath}`);