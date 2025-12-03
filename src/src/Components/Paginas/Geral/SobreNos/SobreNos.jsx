
import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sobre from '../../../../assets/Sobre.gif';
import './SobreNos.css';

const SobreNos = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    // Refs para os elementos que serão animados
    const heroRef = useRef(null);
    const missionRef = useRef(null);
    const valuesRef = useRef(null);
    const teamRef = useRef(null);
    const impactRef = useRef(null);
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
        const sections = [heroRef.current, missionRef.current, valuesRef.current, teamRef.current, impactRef.current];
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
        <div className="about-container hero-content">
            <section className="hero scroll-element" ref={heroRef}>
                <div className="hero-image ">
                    <div className="placeholder-image">
                        <img src={Sobre}  width={400} />
                    </div>
                </div>
                <div className="hero-content">
                    <h1 className='Titulo'>Sobre a <span className="highlight">Nossa Plataforma</span></h1>
                    <p> Nossa missão é promover o bem-estar, a autoestima e o apoio mútuo em nossa comunidade.</p>
                    <div className="hero-buttons">
                        <Link to="/cadastro" className="btn btn-primary btn-large">Junte-se a Nós</Link>
                        <Link to="/" className="btn btn-secondary btn-large">Voltar ao Início</Link>
                    </div>
                </div>
            </section>

            <section className="features scroll-element" ref={missionRef}>
                <h2 className="Titulo">Nossa Missão</h2>
                <div className="features-grid">
                    <div className="feature-card scroll-card" ref={addCardRef}>
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                            </svg>
                        </div>
                        <h3>Acolhimento</h3>
                        <p>Criar um ambiente seguro onde jovens LGBTQIAPN+ possam se expressar livremente e encontrar apoio.</p>
                    </div>

                    <div className="feature-card scroll-card" ref={addCardRef}>
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                            </svg>
                        </div>
                        <h3>Comunidade</h3>
                        <p>Conectar jovens com experiências similares para fortalecer laços e criar uma rede de apoio sólida.</p>
                    </div>

                    <div className="feature-card scroll-card" ref={addCardRef}>
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                            </svg>
                        </div>
                        <h3>Empoderamento</h3>
                        <p>Fortalecer a autoestima e confiança de cada jovem, promovendo o crescimento pessoal e a autoaceitação.</p>
                    </div>
                </div>
            </section>

            <section className="features scroll-element" ref={valuesRef}>
                <h2 className="Titulo">Nossos Valores</h2>
                <div className="features-grid">
                    <div className="feature-card scroll-card" ref={addCardRef}>
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-shield-check" viewBox="0 0 16 16">
                                <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
                                <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                            </svg>
                        </div>
                        <h3>Segurança</h3>
                        <p>Garantimos um ambiente protegido e moderado onde todos se sintam seguros para compartilhar.</p>
                    </div>

                    <div className="feature-card scroll-card" ref={addCardRef}>
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                            </svg>
                        </div>
                        <h3>Transparência</h3>
                        <p>Mantemos comunicação clara e aberta sobre nossos processos e políticas de privacidade.</p>
                    </div>

                    <div className="feature-card scroll-card" ref={addCardRef}>
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                            </svg>
                        </div>
                        <h3>Respeito</h3>
                        <p>Valorizamos a diversidade e promovemos o respeito mútuo em todas as interações da comunidade.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SobreNos;
