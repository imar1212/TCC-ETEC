
import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Inicio from '../../../../assets/Inicio.gif'
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  // Refs para os elementos que serão animados
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const communityRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));

    if (token && userData) {
      if (userData.tipo === 'usuario') {
        navigate('/inicio_usuario');
      } else if (userData.tipo === 'administrador') {
        navigate('/inicio_admin');
      }
    }
  }, [navigate, token]);

  useEffect(() => {
    // Configuração do Intersection Observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observer para seções principais
    const sections = [heroRef.current, featuresRef.current, communityRef.current];
    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    // Observer para cards com delay escalonado
    cardRefs.current.forEach((card, index) => {
      if (card) {
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Função para adicionar refs aos cards
  const addCardRef = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  return (
      <div className="home-container">
        <section className="hero scroll-element" ref={heroRef}>
          <div className="hero-content">
            <h1 className='Titulo'>Bem-vinda(o) à <span className="highlight">Plataforma de Apoio</span></h1>
            <p className='Teste'>Um espaço seguro, acolhedor e inclusivo para jovens LGBTQIAPN+ da região de Jundiaí. Compartilhe suas histórias, receba apoio e fortaleça sua autoestima.</p>
            <div className="hero-buttons">
              <Link to="/cadastro" className="btn btn-primary btn-large">Começar Agora</Link>
              <Link to="/sobre" className="btn btn-secondary btn-large">Saiba Mais</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="placeholder-image">
              <img src={Inicio} alt="" width={400} />
            </div>
          </div>
        </section>

        <section className="features scroll-element" ref={featuresRef}>
          <h2>O que você encontra aqui?</h2>
          <div className="features-grid">
            <div className="feature-card scroll-card" ref={addCardRef}>
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-bandaid" viewBox="0 0 16 16">
                  <path d="M14.121 1.879a3 3 0 0 0-4.242 0L8.733 3.026l4.261 4.26 1.127-1.165a3 3 0 0 0 0-4.242M12.293 8 8.027 3.734 3.738 8.031 8 12.293zm-5.006 4.994L3.03 8.737 1.879 9.88a3 3 0 0 0 4.241 4.24l.006-.006 1.16-1.121ZM2.679 7.676l6.492-6.504a4 4 0 0 1 5.66 5.653l-1.477 1.529-5.006 5.006-1.523 1.472a4 4 0 0 1-5.653-5.66l.001-.002 1.505-1.492z" />
                  <path d="M5.56 7.646a.5.5 0 1 1-.706.708.5.5 0 0 1 .707-.708Zm1.415-1.414a.5.5 0 1 1-.707.707.5.5 0 0 1 .707-.707M8.39 4.818a.5.5 0 1 1-.708.707.5.5 0 0 1 .707-.707Zm0 5.657a.5.5 0 1 1-.708.707.5.5 0 0 1 .707-.707ZM9.803 9.06a.5.5 0 1 1-.707.708.5.5 0 0 1 .707-.707Zm1.414-1.414a.5.5 0 1 1-.706.708.5.5 0 0 1 .707-.708ZM6.975 9.06a.5.5 0 1 1-.707.708.5.5 0 0 1 .707-.707ZM8.39 7.646a.5.5 0 1 1-.708.708.5.5 0 0 1 .707-.708Zm1.413-1.414a.5.5 0 1 1-.707.707.5.5 0 0 1 .707-.707" />
                </svg>
              </div>
              <h3>Apoio Emocional</h3>
              <p>Compartilhe seus sentimentos em um espaço anônimo e acolhedor.</p>
            </div>

            <div className="feature-card scroll-card" ref={addCardRef}>
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-shield-check" viewBox="0 0 16 16">
                  <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
                  <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                </svg>
              </div>
              <h3>Comunidade Segura</h3>
              <p>Interaja com jovens que compartilham experiências parecidas.</p>
            </div>

            <div className="feature-card scroll-card" ref={addCardRef}>
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-chat-right-text" viewBox="0 0 16 16">
                  <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" />
                  <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                </svg>
              </div>
              <h3>Espaço de Desabafos</h3>
              <p>Escreva suas histórias, receba apoio e mensagens positivas.</p>
            </div>

            <div className="feature-card scroll-card" ref={addCardRef}>
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-lightbulb" viewBox="0 0 16 16">
                  <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1" />
                </svg>
              </div>
              <h3>Conteúdos Úteis</h3>
              <p>Acesse artigos e informações para fortalecer sua autoestima.</p>
            </div>
          </div>
        </section>

        <section className="community scroll-element" ref={communityRef}>
          <div className="community-content">
            <h2>Junte-se à nossa comunidade</h2>
            <p>Conecte-se com outros jovens LGBTQIAPN+ da região de Jundiaí e compartilhe experiências em um ambiente seguro e moderado.</p>
            <Link to="/cadastro" className="btn btn-primary btn-large">Participar</Link>
          </div>
          <div className="community-stats">
            <div className="stat scroll-card" ref={addCardRef}>
              <h4>100%</h4>
              <p>Inclusivo</p>
            </div>
            <div className="stat scroll-card" ref={addCardRef}>
              <h4>24/7</h4>
              <p>Disponível</p>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Home;
