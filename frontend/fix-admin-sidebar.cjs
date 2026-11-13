
const fs = require("fs");

const pagePath = "app/admin/page.js";
const cssPath = "app/admin/admin.css";

let page = fs.readFileSync(pagePath, "utf8");
let css = fs.readFileSync(cssPath, "utf8");

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message + " No files were written.");
  }
}

// 1. Add desktop collapsed state
if (!page.includes("const [sidebarCollapsed, setSidebarCollapsed]")) {
  const statePattern =
    /const \[sidebarOpen,\s*setSidebarOpen\] = useState\(false\);/;

  ensure(statePattern.test(page), "sidebarOpen state not found.");

  page = page.replace(
    statePattern,
    (match) =>
      match + '\n  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);'
  );
}

// 2. Update selectPage
const selectPattern =
  /function selectPage\(id\)\s*\{[\s\S]*?\n\s*\}/;

ensure(selectPattern.test(page), "selectPage function not found.");

page = page.replace(
  selectPattern,
  `function selectPage(id) {
    setActivePage(id);

    if (window.matchMedia("(max-width: 760px)").matches) {
      setSidebarOpen(false);
    }
  }`
);

// 3. Add toggleSidebar
if (!page.includes("function toggleSidebar()")) {
  const logoutPattern = /(\n\s*async function handleLogout\(\)\s*\{)/;

  ensure(logoutPattern.test(page), "async handleLogout not found.");

  page = page.replace(
    logoutPattern,
    `
  function toggleSidebar() {
    if (window.matchMedia("(max-width: 760px)").matches) {
      setSidebarOpen((current) => !current);
    } else {
      setSidebarCollapsed((current) => !current);
    }
  }

  $1`
  );
}

// 4. Update root class
if (!page.includes('sidebarCollapsed ? "sidebar-collapsed"')) {
  const rootPattern = /<div className="md-admin">/;

  ensure(rootPattern.test(page), "md-admin root not found.");

  page = page.replace(
    rootPattern,
    '<div className={`md-admin ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>'
  );
}

// 5. Update menu button
if (page.includes('onClick={() => setSidebarOpen(true)}')) {
  const menuPattern =
    /<button\s+className="md-menu-button"\s+onClick=\{\(\) => setSidebarOpen\(true\)\}\s+aria-label="Ouvrir le menu"\s*>\s*<Menu size=\{22\} \/>\s*<\/button>/;

  ensure(menuPattern.test(page), "Menu button JSX not found.");

  page = page.replace(
    menuPattern,
    `<button
              type="button"
              className="md-menu-button"
              onClick={toggleSidebar}
              aria-label="Afficher ou masquer le menu"
              title="Afficher / masquer le menu"
            >
              <Menu size={22} />
            </button>`
  );
}

ensure(
  page.includes('className="md-menu-button"') &&
  page.includes("onClick={toggleSidebar}"),
  "Menu button was not updated."
);

// 6. Add CSS once
if (!css.includes(".md-admin.sidebar-collapsed .md-sidebar")) {
  css += `

/* SIDEBAR MANUAL TOGGLE - DESKTOP / TABLET */

.md-menu-button {
  display: inline-grid !important;
  place-items: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(7, 59, 92, 0.12);
  border-radius: 11px;
  background: #ffffff;
  color: var(--md-primary, #073b5c);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.md-menu-button:hover {
  background: #eaf7fc;
  border-color: rgba(7, 59, 92, 0.25);
}

@media (min-width: 761px) {
  .md-sidebar {
    transition: transform 0.28s ease;
  }

  .md-main {
    transition: margin-left 0.28s ease;
  }

  .md-admin.sidebar-collapsed .md-sidebar {
    transform: translateX(-100%);
    pointer-events: none;
  }

  .md-admin.sidebar-collapsed .md-main {
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 760px) {
  .md-menu-button {
    width: 37px;
    height: 37px;
    flex-basis: 37px;
  }
}
`;
}

// 7. Backup before writing
fs.copyFileSync(pagePath, pagePath + ".backup");
fs.copyFileSync(cssPath, cssPath + ".backup");

fs.writeFileSync(pagePath, page, "utf8");
fs.writeFileSync(cssPath, css, "utf8");

console.log("SUCCESS: Sidebar toggle updated.");
console.log("Backup files created.");
