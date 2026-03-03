import './style.css';
import { projects } from './products/data.js';
import ambientMusic from './sound/pista_ambiental_sc.mp3';

const teamData = [
    { name: "Stefany", role: "Arquitecta", desc: "La mirada que da forma; su trazo conecta naturaleza y experiencia en cada proyecto.", img: "/images/team/arquitecta_stefany.jpeg" },
    { name: "Gabriela", role: "Anfitriona", desc: "La presencia que recibe, organiza y acompaña, acercando cada proyecto a quienes lo habitarán.", img: "/images/team/gabriela.jpeg" },
    { name: "Elias", role: "Contratista", desc: "La mano firme que hace posible lo imaginado, cuidando cada detalle para que el proyecto cobre vida.", img: "/images/team/elias.jpeg" },
    { name: "Rafael", role: "Cancelero", desc: "El creador de umbrales; diseña aperturas que equilibran luz, aire y movimiento en cada proyecto.", img: "/images/team/rafael.jpeg" },
    { name: "Roberto", role: "Plomero y electricista", desc: "El guardián de la armonía entre agua y luz; asegura que los flujos vitales circulen con equilibrio.", img: "/images/team/roberto.jpeg" },
    { name: "Edder", role: "Publicista", desc: "El narrador de la esencia del estudio; convierte ideas en relatos que respiran identidad y claridad.", img: "/images/team/edder.jpeg" }
];

// --- NUEVO: BASE DE DATOS DEL BLOG ---
const blogData = [
    {
        id: 1,
        title: "El diseño consciente: Habitar con intención",
        category: "Reflexión",
        date: "Noviembre 2025",
        read_time: "4 min",
        cover: "/images/project_maya/maya1.jpeg", 
        content: "<p>La arquitectura moderna a menudo olvida que no somos máquinas habitando cajas, sino seres vivos que responden a estímulos naturales.</p><br><p>En este artículo exploramos cómo la integración de elementos pasivos y materiales crudos no solo reduce la huella de carbono del proyecto, sino que disminuye los niveles de cortisol de quienes habitan el espacio en su día a día. El lujo real ya no es el mármol importado, sino la capacidad de un espacio para devolvernos la paz mental tras una jornada laboral intensa.</p><br><p>Abrazar la imperfección de la piedra, dejar que la madera respire y permitir que la luz moldee los volúmenes son las directrices de la práctica contemporánea que aplicamos en el estudio.</p>"
    },
    {
        id: 2,
        title: "Materiales crudos y la acústica del silencio",
        category: "Materialidad",
        date: "Diciembre 2025",
        read_time: "6 min",
        cover: "/images/project_pinon/pinion1.jpeg",
        content: "<p>El sonido rebotando en paredes lisas y artificiales genera una fatiga auditiva imperceptible pero constante. Es uno de los males silenciosos de las viviendas genéricas.</p><br><p>Al utilizar maderas sin tratar, estucos naturales y texturas porosas, logramos absorber la reverberación acústica. Devolvemos al espacio el silencio necesario para el descanso y la contemplación profunda.</p>"
    }
];

const NeutraApp = {
  lenisInstance: null,
  audioInstance: null,

  // ==========================================
  // CEREBRO CENTRAL DE RUTEO
  // ==========================================
  isInternalViewActive: function() {
    const views = ['projects-view', 'blog-view', 'legal-view'];
    return views.some(id => {
        const el = document.getElementById(id);
        return el && !el.classList.contains('hidden') && !el.classList.contains('spa-view-shield');
    });
  },

  // --- 1. MÉTODOS MAESTROS DE VISTA ---
  
  revealSite: function() {
    const main = document.getElementById('main-content');
    if (!main) return;
    requestAnimationFrame(() => {
        main.style.visibility = 'visible';
        main.style.opacity = '1'; 
    });
  },

  showProjects: function() {
    const projectsView = document.getElementById('projects-view');
    const homeView = document.getElementById('home-view');
    
    this.lenisInstance?.stop();
    projectsView.classList.remove('spa-view-shield', 'hidden');
    
    setTimeout(() => {
        projectsView.classList.replace('opacity-0', 'opacity-100');
        projectsView.classList.remove('pointer-events-none');
        homeView.classList.add('opacity-0');
        projectsView.scrollTop = 0;
    }, 50);
  },

  showBlog: function() {
    const blogView = document.getElementById('blog-view');
    const homeView = document.getElementById('home-view');
    
    this.lenisInstance?.stop();
    blogView.classList.remove('spa-view-shield', 'hidden');
    
    setTimeout(() => {
        blogView.classList.replace('opacity-0', 'opacity-100');
        blogView.classList.remove('pointer-events-none');
        homeView.classList.add('opacity-0');
        blogView.scrollTop = 0;
    }, 50);
  },

  showLegal: function() {
    const legalView = document.getElementById('legal-view');
    const homeView = document.getElementById('home-view');
    
    this.lenisInstance?.stop();
    legalView.classList.remove('spa-view-shield', 'hidden');
    
    setTimeout(() => {
        legalView.classList.replace('opacity-0', 'opacity-100');
        legalView.classList.remove('pointer-events-none');
        homeView.classList.add('opacity-0');
        legalView.scrollTop = 0;
    }, 50);
  },

  showHome: function() {
    const projectsView = document.getElementById('projects-view');
    const blogView = document.getElementById('blog-view'); 
    const homeView = document.getElementById('home-view');
    const legalView = document.getElementById('legal-view');
    
    if (projectsView && !projectsView.classList.contains('hidden')) {
        projectsView.classList.replace('opacity-100', 'opacity-0');
        projectsView.classList.add('pointer-events-none');
    }
    if (blogView && !blogView.classList.contains('hidden')) {
        blogView.classList.replace('opacity-100', 'opacity-0');
        blogView.classList.add('pointer-events-none');
    }
    if (legalView && !legalView.classList.contains('hidden')) {
        legalView.classList.replace('opacity-100', 'opacity-0');
        legalView.classList.add('pointer-events-none');
    }

    homeView.classList.remove('opacity-0');
    
    setTimeout(() => { 
        if(projectsView) projectsView.classList.add('hidden', 'spa-view-shield'); 
        if(blogView) blogView.classList.add('hidden', 'spa-view-shield'); 
        if(legalView) legalView.classList.add('hidden', 'spa-view-shield');
        this.lenisInstance?.start(); 
    }, 700);
  },

  // --- 2. INICIALIZACIONES ---
  initSmoothScroll: function() {
    this.lenisInstance = new Lenis({ 
        duration: 1.2, 
        smooth: true,
        prevent: (node) => node.hasAttribute('data-lenis-prevent') || node.closest('[data-lenis-prevent]')
    });
    this.lenisInstance.start();
    const raf = (time) => { this.lenisInstance.raf(time); this.updateParallax(); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        
        if(anchor.id === 'trigger-blog-page' || targetId === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(targetId);

        // Control Centralizado
        if (this.isInternalViewActive()) {
            this.showHome();
            setTimeout(() => {
                if (target && this.lenisInstance) this.lenisInstance.scrollTo(target);
            }, 750);
        } else {
            if (target && this.lenisInstance) {
              this.lenisInstance.scrollTo(target);
            }
        }
      });
    });
  },

  updateParallax: function() {
    if (!this.lenisInstance) return;
    const scrolled = this.lenisInstance.scroll; 
    document.querySelectorAll('.parallax-img').forEach(img => { 
        img.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0) scale(1.25)`; 
    });
  },

  initMobileMenu: function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const logo = document.getElementById('nav-logo');

    if (!menuToggle || !mobileMenu || !logo) return;

    let mobileLogo = document.getElementById('mobile-menu-logo');
    if (!mobileLogo) {
        mobileLogo = document.createElement('img');
        mobileLogo.id = 'mobile-menu-logo';
        mobileLogo.src = '/logo/sca_logo.svg';
        mobileLogo.className = 'absolute bottom-12 left-1/2 transform -translate-x-1/2 w-24 opacity-30 pointer-events-none transition-opacity duration-700 block';
        mobileMenu.appendChild(mobileLogo);
    }

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.add('translate-x-full');
        setTimeout(() => mobileMenu.classList.add('invisible'), 500);
        document.body.style.overflow = '';
        this.lenisInstance?.start();
    };

    const openMenu = () => {
        menuToggle.classList.add('active');
        mobileMenu.classList.remove('invisible');
        requestAnimationFrame(() => mobileMenu.classList.remove('translate-x-full'));
        document.body.style.overflow = 'hidden';
        this.lenisInstance?.stop();
    };

    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        
        if (menuToggle.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetId = link.getAttribute('href');
            closeMenu(); 

            if (link.id === 'trigger-projects-mobile' || link.id === 'trigger-projects-page') {
                setTimeout(() => this.showProjects(), 150);
            } else if (link.id === 'trigger-blog-mobile' || link.id === 'trigger-blog-page') {
                setTimeout(() => this.showBlog(), 150);
            } else if (targetId && targetId !== '#') {
                // Control Centralizado
                if (this.isInternalViewActive()) {
                    this.showHome();
                    setTimeout(() => {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement && this.lenisInstance) this.lenisInstance.scrollTo(targetElement);
                    }, 850);
                } else {
                    setTimeout(() => {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement && this.lenisInstance) {
                            this.lenisInstance.scrollTo(targetElement);
                        }
                    }, 150);
                }
            }
        });
    });

    logo.addEventListener('click', (e) => {
        if (window.innerWidth < 1024 && menuToggle.classList.contains('active')) {
            closeMenu();
            // Control Centralizado
            if (this.isInternalViewActive()) {
                e.preventDefault();
                this.showHome();
                setTimeout(() => this.lenisInstance?.scrollTo(0), 850);
            } else {
                e.preventDefault();
                setTimeout(() => this.lenisInstance?.scrollTo(0), 100);
            }
        }
    });
  },

  initHeroEvents: function() {
    const welcomeBtn = document.getElementById('welcome-trigger');
    const welcomeMsg = document.getElementById('welcome-message');
    
    // Nodos de los botones de audio
    const heroAudioBtn = document.getElementById('audio-toggle');
    const globalAudioBtn = document.getElementById('global-audio-toggle');
    const iconOn = document.getElementById('icon-sound-on');
    const iconOff = document.getElementById('icon-sound-off');

    // Lógica del mensaje de bienvenida
    if(welcomeBtn && welcomeMsg) {
        welcomeBtn.onclick = () => {
            welcomeMsg.classList.toggle('opacity-0');
            welcomeMsg.classList.toggle('translate-y-4');
            welcomeMsg.classList.toggle('pointer-events-none');
        };
    }

    // --- SISTEMA CENTRAL DE AUDIO (Single Source of Truth) ---
    const toggleAudio = () => {
        if(!this.audioInstance) { 
            this.audioInstance = new Audio(ambientMusic); 
            this.audioInstance.loop = true; 
            this.audioInstance.volume = 0.4;
        }

        if(this.audioInstance.paused) { 
            this.audioInstance.play(); 
            
            if(globalAudioBtn) {
                iconOff.classList.replace('block', 'hidden');
                iconOn.classList.replace('hidden', 'block');
                globalAudioBtn.classList.add('bg-brand-dark', 'text-white', 'border-brand-dark');
                globalAudioBtn.classList.remove('bg-white/80', 'text-brand-dark', 'border-gray-100');
            }
            
            if(heroAudioBtn) {
                const textSpan = heroAudioBtn.lastElementChild;
                heroAudioBtn.classList.add('bg-brand-dark', 'text-white');
                if(textSpan) textSpan.textContent = "Experiencia activa";
            }
        } else { 
            this.audioInstance.pause(); 
            
            if(globalAudioBtn) {
                iconOn.classList.replace('block', 'hidden');
                iconOff.classList.replace('hidden', 'block');
                globalAudioBtn.classList.add('bg-white/80', 'text-brand-dark', 'border-gray-100');
                globalAudioBtn.classList.remove('bg-brand-dark', 'text-white', 'border-brand-dark');
            }
            
            if(heroAudioBtn) {
                const textSpan = heroAudioBtn.lastElementChild;
                heroAudioBtn.classList.remove('bg-brand-dark', 'text-white');
                if(textSpan) textSpan.textContent = "Activa la experiencia sonora";
            }
        }
    };

    if(globalAudioBtn) {
        globalAudioBtn.onclick = (e) => {
            e.preventDefault();
            toggleAudio();
        };
    }

    if(heroAudioBtn) {
        const textSpan = heroAudioBtn.lastElementChild;
        heroAudioBtn.onclick = (e) => {
            e.preventDefault();
            
            if (!heroAudioBtn.style.minWidth) {
                heroAudioBtn.style.minWidth = `${heroAudioBtn.offsetWidth}px`;
                textSpan.style.display = 'inline-block';
                textSpan.style.textAlign = 'center';
                textSpan.style.width = '100%';
            }
            
            textSpan.style.opacity = '0';
            setTimeout(() => {
                toggleAudio(); 
                textSpan.style.opacity = '1';
            }, 200);
        };
    }
  },

  initViewManager: function() {
    const triggerBtn = document.getElementById('view-all-projects');
    const backBtn = document.getElementById('back-to-home');
    
    // Botones del Blog
    const triggerBlogBtn = document.getElementById('trigger-blog-page');
    const backBtnBlog = document.getElementById('back-to-home-from-blog');

    if(triggerBtn) triggerBtn.onclick = () => this.showProjects();
    if(backBtn) backBtn.onclick = () => this.showHome();
    
    if(triggerBlogBtn) {
        triggerBlogBtn.onclick = (e) => {
            e.preventDefault();
            this.showBlog();
        };
    }
    if(backBtnBlog) backBtnBlog.onclick = () => this.showHome();
    
    document.getElementById('nav-logo').onclick = (e) => { 
        // Control Centralizado
        if (this.isInternalViewActive()) {
            e.preventDefault();
            this.showHome();
            setTimeout(() => this.lenisInstance?.scrollTo(0), 750);
        } else {
            e.preventDefault();
            this.lenisInstance?.scrollTo(0);
        }
    };

    // ACTIVADORES DE VISTAS LEGALES
    const triggersLegal = ['trigger-legal-form', 'trigger-privacy-footer', 'trigger-terms'];
    triggersLegal.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.onclick = (e) => {
                e.preventDefault();
                const titleEl = document.getElementById('legal-title');
                const privacyDoc = document.getElementById('privacy-content');
                const termsDoc = document.getElementById('terms-content');
                
                privacyDoc.classList.add('hidden');
                termsDoc.classList.add('hidden');

                if(id === 'trigger-terms') {
                    titleEl.innerText = 'Términos y Condiciones';
                    termsDoc.classList.remove('hidden');
                } else {
                    titleEl.innerText = 'Aviso de Privacidad Integral';
                    privacyDoc.classList.remove('hidden');
                }
                
                this.showLegal();
            };
        }
    });

    const backLegal = document.getElementById('back-to-home-from-legal');
    if(backLegal) backLegal.onclick = () => this.showHome();
  },

  initPortfolio: function() {
    const gridFull = document.getElementById('project-grid-full');
    const modal = document.getElementById('project-modal');

    if (gridFull) {
        gridFull.innerHTML = projects.map(p => `
            <article class="relative w-full md:w-[calc((100%-2.5rem)/2)] lg:w-[calc((100%-5rem)/3)] aspect-[3/4] overflow-hidden bg-gray-100 group cursor-pointer shadow-sm project-card" data-id="${p.id}">
              <img src="${p.cover}" class="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" loading="lazy">
              <div class="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/40 transition-colors"></div>
              <div class="absolute bottom-0 left-0 p-6 md:p-8 w-full z-20">
                <h3 class="text-xl md:text-2xl font-display text-white mb-2">${p.editorial_name}</h3>
                <span class="text-[9px] md:text-[10px] font-subtitle uppercase tracking-[0.2em] text-white/60">${p.location} • ${p.year}</span>
              </div>
            </article>
        `).join('');
    }

    document.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (card) this.openModal(projects.find(proj => proj.id == card.dataset.id), modal);
    });

    document.getElementById('close-modal').onclick = () => {
        const panel = document.getElementById('modal-panel');
        panel.classList.add('translate-x-full', 'lg:translate-x-full');
        document.getElementById('modal-backdrop').classList.remove('opacity-100');
        
        setTimeout(() => { 
            modal.classList.add('invisible', 'spa-view-shield');
            document.body.style.overflow = '';
            if (document.getElementById('projects-view').classList.contains('hidden') === false) this.lenisInstance?.start();
        }, 500);
    };
  },

  openModal: function(p, modal) {
    const textContainer = document.getElementById('modal-text-content');
    const galleryContainer = document.getElementById('m-gallery');
    const galleryScroll = document.getElementById('gallery-scroll');
    const scrollIndicator = document.getElementById('scroll-indicator');

    textContainer.innerHTML = `
        <div class="pb-28 lg:pb-12 w-full max-w-full overflow-hidden">
            <img src="/logo/sca_logo.svg" class="w-12 sm:w-16 md:w-24 lg:w-32 mb-3 lg:mb-8 opacity-80">
            
            <p class="text-brand-magenta font-subtitle uppercase tracking-widest text-[8px] sm:text-[9px] lg:text-xs mb-1 lg:mb-2">${p.year} ● ${p.location}</p>
            
            <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-display text-brand-dark mb-3 lg:mb-8 leading-[1.1] break-words">${p.editorial_name}</h2>
            
            <div class="space-y-2.5 lg:space-y-6 text-xs sm:text-sm md:text-base lg:text-lg font-body text-gray-600 leading-snug lg:leading-relaxed text-left lg:text-justify">
                <p>${p.description}</p>
                <p class="font-bold text-brand-dark pt-1 lg:pt-2">${p.narrative_intro}</p>
            </div>
        </div>
    `;

    const videos = p.gallery.filter(f => f.endsWith('.mp4'));
    if (videos.length > 0) {
        const videoBtnDesktop = document.createElement('button');
        videoBtnDesktop.className = "hidden lg:block mt-12 w-full py-5 border border-brand-magenta text-brand-magenta text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-brand-magenta hover:text-white transition-all cursor-pointer";
        videoBtnDesktop.innerText = "Ver Recorrido Virtual";
        videoBtnDesktop.onclick = () => this.openVideoModal(videos);
        textContainer.appendChild(videoBtnDesktop);
    }

    galleryContainer.innerHTML = p.gallery
        .filter(f => !f.endsWith('.mp4'))
        .map(f => `<img src="${f}" class="w-full h-auto block object-cover m-0 p-0 align-bottom border-none" loading="eager">`)
        .join('');

    const existingMobileBtn = document.getElementById('mobile-video-btn');
    if (existingMobileBtn) existingMobileBtn.remove();

    if (videos.length > 0) {
        const mobileBtnWrapper = document.createElement('div');
        mobileBtnWrapper.id = 'mobile-video-btn';
        mobileBtnWrapper.className = "lg:hidden absolute bottom-6 left-0 w-full z-30 flex justify-center pointer-events-none";
        
        const mobileBtn = document.createElement('button');
        mobileBtn.className = "w-[85%] py-4 md:py-5 bg-brand-dark text-white text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold shadow-2xl hover:bg-brand-magenta transition-all rounded-sm cursor-pointer pointer-events-auto";
        mobileBtn.innerText = "Ver Recorrido";
        mobileBtn.onclick = () => this.openVideoModal(videos);
        
        mobileBtnWrapper.appendChild(mobileBtn);
        document.getElementById('modal-panel').appendChild(mobileBtnWrapper);
    }

    modal.classList.remove('spa-view-shield', 'invisible');
    this.lenisInstance?.stop();
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        document.getElementById('modal-backdrop').classList.add('opacity-100');
        const panel = document.getElementById('modal-panel');
        panel.classList.remove('translate-x-full', 'lg:translate-x-full');
        galleryScroll.scrollTop = 0;
        
        if (scrollIndicator) {
            setTimeout(() => scrollIndicator.classList.replace('opacity-0', 'opacity-100'), 800);
            const hideIndicator = () => {
                if (galleryScroll.scrollTop > 50) {
                    scrollIndicator.classList.replace('opacity-100', 'opacity-0');
                    galleryScroll.removeEventListener('scroll', hideIndicator);
                }
            };
            galleryScroll.removeEventListener('scroll', hideIndicator);
            galleryScroll.addEventListener('scroll', hideIndicator);
        }

        setTimeout(() => textContainer.classList.remove('opacity-0', 'translate-y-8'), 400);
    });
  },

  openVideoModal: function(videos) {
    const vModal = document.getElementById('video-modal');
    const player = document.getElementById('video-player-root');
    const switcher = document.getElementById('video-switcher-container');
    switcher.innerHTML = '';
    
    vModal.classList.remove('spa-view-shield', 'invisible');
    
    setTimeout(() => vModal.classList.replace('opacity-0', 'opacity-100'), 10);
    player.src = videos[0];
    player.play();

    if (videos.length > 1) {
        videos.forEach((v, idx) => {
            const label = v.toLowerCase().includes('alta') ? 'Planta Alta' : 
                          v.toLowerCase().includes('baja') ? 'Planta Baja' : `Vista ${idx + 1}`;
            const btn = document.createElement('button');
            btn.className = "px-6 py-3 border border-white/20 text-white text-[9px] uppercase tracking-widest hover:border-brand-magenta transition-all cursor-pointer";
            btn.innerText = label;
            btn.onclick = () => {
                player.src = v;
                player.play();
                switcher.querySelectorAll('button').forEach(b => b.classList.remove('bg-brand-magenta', 'border-brand-magenta'));
                btn.classList.add('bg-brand-magenta', 'border-brand-magenta');
            };
            if(idx === 0) btn.classList.add('bg-brand-magenta', 'border-brand-magenta');
            switcher.appendChild(btn);
        });
    }
    document.getElementById('close-video-modal').onclick = () => {
        player.pause();
        vModal.classList.replace('opacity-100', 'opacity-0');
        setTimeout(() => vModal.classList.add('invisible', 'spa-view-shield'), 500);
    };
  },

  initBlog: function() {
    const grid = document.getElementById('blog-grid-full');
    const modal = document.getElementById('article-modal');

    if (grid) {
        grid.innerHTML = blogData.map(b => `
            <article class="group cursor-pointer blog-card flex flex-col gap-4 md:gap-6" data-id="${b.id}">
                <div class="w-full aspect-[4/3] overflow-hidden bg-gray-100 relative">
                    <img src="${b.cover}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" loading="lazy">
                    <div class="absolute top-4 left-4 bg-white px-3 py-1 text-[9px] uppercase tracking-widest text-brand-dark font-subtitle shadow-md">${b.category}</div>
                </div>
                <div>
                    <div class="flex items-center gap-3 text-[10px] text-brand-magenta font-subtitle uppercase tracking-widest mb-3">
                        <span>${b.date}</span>
                        <span class="text-gray-300">•</span>
                        <span>${b.read_time}</span>
                    </div>
                    <h3 class="text-2xl md:text-3xl font-display text-brand-dark group-hover:text-brand-magenta transition-colors leading-tight">${b.title}</h3>
                </div>
            </article>
        `).join('');
    }

    document.addEventListener('click', (e) => {
        const card = e.target.closest('.blog-card');
        if (card) this.openArticleModal(blogData.find(post => post.id == card.dataset.id), modal);
    });

    const closeBtn = document.getElementById('close-article-modal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            const panel = document.getElementById('article-panel');
            panel.classList.add('translate-y-full');
            document.getElementById('article-backdrop').classList.remove('opacity-100');
            
            setTimeout(() => { 
                modal.classList.add('invisible', 'spa-view-shield');
                document.body.style.overflow = 'hidden'; 
                document.getElementById('article-panel').scrollTop = 0;
            }, 500);
        };
    }
  },

  openArticleModal: function(post, modal) {
    const header = document.getElementById('article-header');
    const cover = document.getElementById('article-cover');
    const content = document.getElementById('article-content');

    header.innerHTML = `
        <div class="inline-block border-b border-brand-magenta pb-2 mb-6">
            <span class="text-[10px] md:text-xs uppercase tracking-[0.2em] font-subtitle text-brand-magenta">${post.category}</span>
        </div>
        <h2 class="text-4xl md:text-6xl lg:text-7xl font-display text-brand-dark mb-6 leading-tight max-w-3xl mx-auto">${post.title}</h2>
        <div class="flex items-center justify-center gap-4 text-xs font-subtitle uppercase tracking-widest text-gray-500">
            <span>${post.date}</span>
            <span>•</span>
            <span>Lectura de ${post.read_time}</span>
        </div>
    `;

    cover.innerHTML = `<img src="${post.cover}" class="w-full h-full object-cover">`;
    content.innerHTML = `<div class="prose prose-lg prose-gray max-w-none prose-p:mb-6 prose-p:text-justify md:prose-p:text-left">${post.content}</div>`;

    header.classList.remove('opacity-100', 'translate-y-0');
    header.classList.add('opacity-0', 'translate-y-8');
    cover.classList.remove('opacity-100');
    cover.classList.add('opacity-0');
    content.classList.remove('opacity-100', 'translate-y-0');
    content.classList.add('opacity-0', 'translate-y-8');

    modal.classList.remove('spa-view-shield', 'invisible');
    
    requestAnimationFrame(() => {
        document.getElementById('article-backdrop').classList.add('opacity-100');
        const panel = document.getElementById('article-panel');
        panel.classList.remove('translate-y-full');
        
        setTimeout(() => {
            header.classList.replace('opacity-0', 'opacity-100');
            header.classList.replace('translate-y-8', 'translate-y-0');
        }, 400);
        setTimeout(() => cover.classList.replace('opacity-0', 'opacity-100'), 600);
        setTimeout(() => {
            content.classList.replace('opacity-0', 'opacity-100');
            content.classList.replace('translate-y-8', 'translate-y-0');
        }, 800);
    });
  },

  initTeam: function() {
    const grid = document.getElementById('team-grid');
    if (!grid) return;
    grid.innerHTML = teamData.map(m => `
        <div class="group flex flex-col gap-4 md:gap-6 w-full md:w-[calc((100%-2.5rem)/2)] lg:w-[calc((100%-8rem)/3)]">
            <div class="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                <div class="absolute inset-0 bg-brand-dark/5 mix-blend-multiply group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
                <img src="${m.img}" class="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" loading="lazy">
            </div>
            <div class="text-center md:text-left">
                <h4 class="text-2xl md:text-3xl font-display text-brand-dark">${m.name}</h4>
                <p class="text-[9px] md:text-[10px] font-subtitle text-brand-magenta uppercase tracking-widest mb-3 md:mb-4">${m.role}</p>
                <p class="text-xs md:text-sm font-body text-gray-500 leading-relaxed">${m.desc}</p>
            </div>
        </div>
    `).join('');
  },

  initContactForm: function() {
    const form = document.getElementById('contact-form');
    const btn = document.getElementById('submit-btn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      const originalText = btn.innerText;
      btn.innerText = "Enviando...";
      btn.disabled = true;

      const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/f6svkc2kb4jec4etixbowav2xe26jxrl';

      fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: json
      })
      .then((response) => {
        if (response.ok) {
          btn.innerText = "Mensaje Recibido";
          btn.classList.replace('bg-brand-dark', 'bg-green-600');
          form.reset();
        } else {
          throw new Error('Error en el servidor de Make');
        }
      })
      .catch(error => {
        btn.innerText = "Fallo de conexión";
        console.error("Error técnico:", error);
      })
      .finally(() => {
        setTimeout(() => {
          btn.innerText = originalText;
          btn.classList.remove('bg-green-600');
          if(!btn.classList.contains('bg-brand-dark')) btn.classList.add('bg-brand-dark');
          btn.disabled = false;
        }, 4000);
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  NeutraApp.initSmoothScroll();
  NeutraApp.initMobileMenu();
  NeutraApp.initViewManager();
  NeutraApp.initPortfolio();
  NeutraApp.initBlog(); 
  NeutraApp.initTeam();
  NeutraApp.initHeroEvents();
  NeutraApp.initContactForm(); 
  NeutraApp.revealSite();
});