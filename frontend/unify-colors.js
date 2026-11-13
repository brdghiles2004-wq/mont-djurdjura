
const fs = require("fs");

const files = [
  "app/a-propos/page.module.css",
  "app/processus-production/page.module.css",
];

const colors = {
  "#123b46": "#073b5c",
  "#0b2c35": "#073b5c",
  "#092b33": "#073b5c",
  "#1d5a61": "#08749c",
  "#174c54": "#08749c",
  "#55a9a0": "#08749c",
  "#55a99f": "#08749c",
  "#438f87": "#073b5c",
  "#8ed1c4": "#159bc4",
  "#8bd0c5": "#159bc4",
  "#eaf4f1": "#eaf7fc",
  "#f2f7f5": "#f3f9fc",
  "#f4f8f7": "#f3f9fc",
  "#203238": "#18394c",
  "#68777a": "#718894",
  "#718083": "#718894",

  "#286b70": "#4c9ab7",
  "#75b5ac": "#a9d3e2",
  "#c5e6dd": "#d7edf4",
  "#dceee8": "#eaf7fc",
  "#a7d1c5": "#a9d3e2",
  "#4f9891": "#4c9ab7",
  "#8ebfb2": "#a9d3e2",
  "#397c77": "#0c668d",
  "#477e77": "#0c668d",
  "#b8d4cc": "#9cc9d9",
  "#f7faf9": "#f7fcfe",
  "#e5eeeb": "#e6f0f4",
  "#dce7e4": "#e6f0f4",
  "#d9e4e2": "#e8f0f4",
  "#c2d6d3": "#d0e9f2",
  "#d2e1e0": "#d0e9f2",
  "#d9efea": "#d0e9f2",
  "#a9c4c3": "#9cc9d9",
};

const rgba = {
  "rgba(85,169,160": "rgba(8,116,156",
  "rgba(85, 169, 159": "rgba(8, 116, 156",
  "rgba(139,208,197": "rgba(21,155,196",
  "rgba(142,209,196": "rgba(21,155,196",
  "rgba(18,59,70": "rgba(7,59,92",
  "rgba(18, 59, 70": "rgba(7, 59, 92",
  "rgba(9, 43, 51": "rgba(7, 59, 92",
};

for (const file of files) {
  let css = fs.readFileSync(file, "utf8");
  let changes = 0;

  for (const [oldColor, newColor] of Object.entries(colors)) {
    const regex = new RegExp(
      oldColor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "gi"
    );

    css = css.replace(regex, () => {
      changes++;
      return newColor;
    });
  }

  for (const [oldColor, newColor] of Object.entries(rgba)) {
    const regex = new RegExp(
      oldColor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "gi"
    );

    css = css.replace(regex, () => {
      changes++;
      return newColor;
    });
  }

  fs.writeFileSync(file, css, "utf8");
  console.log(`Updated: ${file} | ${changes} color replacements`);
}
