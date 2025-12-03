import React from "react";
import "./Footer.css";
import { Instagram, Twitter, Facebook, Music2 } from "lucide-react"; // Ícones do Lucide

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>QueerCoded</h3>
          <p>
            Um projeto de apoio emocional para jovens LGBTQIAPN+ da região de
            Jundiaí. Promovendo acolhimento, empatia e visibilidade.
          </p>
        </div>

        <div className="footer-section">
          <h4>Links Rápidos</h4>
          <ul>
            <li><a href="#">Sobre nós</a></li>
            <li><a href="#">Termos de uso</a></li>
            <li><a href="#">Política de privacidade</a></li>
            <li><a href="#">Contato</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Redes Sociais</h4>
          <div className="social-icons" aria-label="Redes sociais">
            <a href="#" aria-label="Instagram"><Instagram size={22} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={22} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={22} /></a>
            <a href="#" aria-label="TikTok"><Music2 size={22} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} QueerCoded — Todos os direitos reservados.  
        </p>
      </div>
    </footer>
  );
};

export default Footer;
