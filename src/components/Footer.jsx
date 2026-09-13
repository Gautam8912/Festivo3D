import React from "react";
import { Brand } from "./Navbar";
import { Heart, ArrowUpRight } from "lucide-react";
export default function Footer() {
  return (
    <footer className="footer section">
      <div>
        <Brand />
        <p>A little festive. A lot of business.</p>
      </div>
      <div className="footer-links">
        <a href="#templates">Templates</a>
        <a href="#create">
          Create a poster <ArrowUpRight size={14} />
        </a>
        <a href="#privacy">Your privacy</a>
      </div>
      <span>
        Made with <Heart size={13} fill="#ed729b" color="#ed729b" /> for India
        🇮🇳
        <small>
          © {new Date().getFullYear()} Festivo3D. Celebrate your business.
        </small>
      </span>
    </footer>
  );
}
