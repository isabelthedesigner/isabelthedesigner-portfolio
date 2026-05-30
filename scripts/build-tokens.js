import fs from "fs";
import path from "path";


// ── Read design tokens ──
const tokens = JSON.parse(
  fs.readFileSync("src/tokens/design-tokens.json", "utf-8")
);

const g = tokens.global;
const s = tokens.semantic;

// ── Generate Theme ──
const lines = [];
const add = (prop, value) => lines.push(`  ${prop}: ${value};`);

// ── Breakpoints ──
add("--breakpoint-sm", "375px");
add("--breakpoint-md", "768px");
add("--breakpoint-desktop", "1024px");
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

// ── Semantic: Button ──
for (const [variant, groups] of Object.entries(s.color.button)) {
  for (const [group, states] of Object.entries(groups)) {
    for (const [state, token] of Object.entries(states)) {
      add(`--color-button-${variant}-${group}-${state}`, token.value);
    }
  }
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

fs.writeFileSync(path.resolve("src/styles/generated-theme.css"), theme, "utf-8");
console.log(`✓ Theme written to src/styles/generated-theme.css`);

// ── Generate Typography Utilities ──
const utilityLines = [];

for (const [category, variants] of Object.entries(s.typography)) {
  utilityLines.push(`/* ── ${category} ── */`);
  for (const [variant, props] of Object.entries(variants)) {
    const className = `text-${category}-${variant}`;
    const family = props["font-family"].includes("font-display")
      ? "var(--font-display)"
      : "var(--font-sans)";

    utilityLines.push(`@utility ${className} {`);
    utilityLines.push(`  font-family: ${family};`);
    utilityLines.push(`  font-size: ${props["font-size"]};`);
    utilityLines.push(`  font-weight: ${props["font-weight"]};`);
    utilityLines.push(`  line-height: ${props["line-height"]};`);
    utilityLines.push(`  letter-spacing: ${props["letter-spacing"]};`);
    if (props["text-case"] === "uppercase") {
      utilityLines.push(`  text-transform: uppercase;`);
    }
    utilityLines.push(`}`);
    utilityLines.push(``);
  }
}

// ── Border: dotted line ──
const dotted = g["border-style"].dotted;
const dottedColor = `var(--color-${dotted["color-ref"].replace("color.", "").replace(".", "-")})`;
const dottedWidth = dotted.width;
const dottedDash = dotted.dash;
const dottedPeriod = `${parseFloat(dotted.dash) + parseFloat(dotted.gap)}px`;
const dottedGradient = (deg) =>
  `repeating-linear-gradient(${deg}, ${dottedColor}, ${dottedColor} ${dottedDash}, transparent ${dottedDash}, transparent ${dottedPeriod})`;

utilityLines.push(`/* ── border ── */`);
utilityLines.push(`@utility border-dotted-line {`);
utilityLines.push(`  background-image:`);
utilityLines.push(`    ${dottedGradient("90deg")},`);
utilityLines.push(`    ${dottedGradient("180deg")},`);
utilityLines.push(`    ${dottedGradient("90deg")},`);
utilityLines.push(`    ${dottedGradient("180deg")};`);
utilityLines.push(`  background-position: left top, right top, left bottom, left top;`);
utilityLines.push(`  background-repeat: repeat-x, repeat-y, repeat-x, repeat-y;`);
utilityLines.push(`  background-size: 100% ${dottedWidth}, ${dottedWidth} 100%, 100% ${dottedWidth}, ${dottedWidth} 100%;`);
utilityLines.push(`}`);
utilityLines.push(``);

const utilities = `/* AUTO-GENERATED — do not edit by hand */
/* Run \`yarn build:tokens\` to regenerate */

${utilityLines.join("\n")}`;

fs.writeFileSync(path.resolve("src/styles/generated-utilities.css"), utilities, "utf-8");
console.log(`✓ Utilities written to src/styles/generated-utilities.css`);