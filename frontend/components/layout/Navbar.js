import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const links = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  { label: "Nos produits", href: "/produits" },
  { label: "Galerie", href: "/galerie" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">M</span>
          <span className="brand-name">
            MONT DJURDJURA
            <small>EAU DE SOURCE</small>
          </span>
        </Link>

        <nav className="nav-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="nav-cta">
          Nous contacter
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </header>
  );
}