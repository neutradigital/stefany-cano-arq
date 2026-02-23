import './style.css';
import { projects } from './products/data.js';
import ambientMusic from './sound/pista_ambiental_sc.mp3';

const teamData = [
    { name: "Stefany", role: "Arquitecta", desc: "La mirada que da forma; su trazo conecta naturaleza y experiencia en cada proyecto.", img: "/images/team/stefany.png" },
    { name: "Gabriela", role: "Anfitriona", desc: "La presencia que recibe, organiza y acompaña, acercando cada proyecto a quienes lo habitarán.", img: "/images/team/gabriela.png" },
    { name: "Elias", role: "Contratista", desc: "La mano firme que hace posible lo imaginado, cuidando cada detalle para que el proyecto cobre vida.", img: "/images/team/elias.png" },
    { name: "Rafael", role: "Cancelero", desc: "El creador de umbrales; diseña aperturas que equilibran luz, aire y movimiento en cada proyecto.", img: "/images/team/rafael.png" },
    { name: "Roberto", role: "Plomero y electricista", desc: "El guardián de la armonía entre agua y luz; asegura que los flujos vitales circulen con equilibrio.", img: "/images/team/roberto.png" },
    { name: "Edder", role: "Publicista", desc: "El narrador de la esencia del estudio; convierte ideas en relatos que respiran identidad y claridad.", img: "/images/team/edder.png" }
];

const NeutraApp = {
  lenisInstance: null,
  audioInstance: null,

  // --- 1. MÉTODOS MAESTROS DE VISTA ---
  
  // MÉTODO NUEVO: Elimina el escudo visual tras cargar
// MÉTODO MAESTRO DE REVELACIÓN (Corregido: CSS Specificity)
  revealSite: function() {
    const main = document.getElementById('main-content');
    if (!main) return;
    
    requestAnimationFrame(() => {
        // Al aplicarlo como style, vencemos la regla del ID del <head>
        main.style.visibility = 'visible';
        main.style.opacity = '1'; 
    });
  },

  showProjects: function() {
    const projectsView = document.getElementById('projects-view');
    const homeView = document.getElementById('home-view');
    
    this.lenisInstance?.stop();
    // Quitamos el escudo antes de animar
    projectsView.classList.remove('spa-view-shield', 'hidden');
    
    setTimeout(() => {
        projectsView.classList.replace('opacity-0', 'opacity-100');
        projectsView.classList.remove('pointer-events-none');
        homeView.classList.add('opacity-0');
        projectsView.scrollTop = 0;
    }, 50);
  },

  showHome: function() {
    const projectsView = document.getElementById('projects-view');
    const homeView = document.getElementById('home-view');
    
    projectsView.classList.replace('opacity-100', 'opacity-0');
    projectsView.classList.add('pointer-events-none');
    homeView.classList.remove('opacity-0');
    
    setTimeout(() => { 
        projectsView.classList.add('hidden'); 
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
        if(anchor.id === 'trigger-projects-page' || targetId === '#') return;
        
        e.preventDefault();

        const projectsView = document.getElementById('projects-view');
        if (!projectsView.classList.contains('hidden')) {
            this.showHome();
        }

        const target = document.querySelector(targetId);
        if (target && this.lenisInstance) {
          this.lenisInstance.scrollTo(target);
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
    const logo = document.getElementById('nav-logo');
    if (!menuToggle || !logo) return;

    const navContainer = logo.nextElementSibling;
    if (!navContainer) return;

    let mobileLogo = document.getElementById('mobile-menu-logo');
    if (!mobileLogo) {
        mobileLogo = document.createElement('img');
        mobileLogo.id = 'mobile-menu-logo';
        mobileLogo.src = './src/logo/sca_logo.svg';
        mobileLogo.className = 'hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 w-24 opacity-30 pointer-events-none transition-opacity duration-700';
        navContainer.appendChild(mobileLogo);
    }

    const originalClasses = navContainer.className;
    const mobileClasses = "fixed inset-0 w-full h-[100dvh] bg-white flex flex-col items-center justify-center gap-8 md:gap-12 z-[65] text-2xl md:text-4xl font-display uppercase tracking-[0.2em] text-brand-dark";

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        navContainer.className = originalClasses;
        mobileLogo.classList.remove('block');
        mobileLogo.classList.add('hidden');
        document.body.style.overflow = '';
        this.lenisInstance?.start();
    };

    const openMenu = () => {
        navContainer.className = mobileClasses;
        mobileLogo.classList.remove('hidden');
        mobileLogo.classList.add('block');
        document.body.style.overflow = 'hidden';
        this.lenisInstance?.stop();
    };

    menuToggle.addEventListener('click', () => {
        if (menuToggle.classList.contains('active')) closeMenu();
        else { menuToggle.classList.add('active'); openMenu(); }
    });

    navContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth < 1024) {
                e.preventDefault(); 
                const targetId = link.getAttribute('href');
                closeMenu(); 

                setTimeout(() => {
                    if (link.id === 'trigger-projects-page') {
                        this.showProjects();
                    } else if (targetId && targetId !== '#') {
                        const projectsView = document.getElementById('projects-view');
                        if (!projectsView.classList.contains('hidden')) this.showHome();
                        
                        const targetElement = document.querySelector(targetId);
                        if (targetElement && this.lenisInstance) {
                            this.lenisInstance.scrollTo(targetElement);
                        }
                    }
                }, 150);
            }
        });
    });

    logo.addEventListener('click', () => {
        if (window.innerWidth < 1024 && menuToggle.classList.contains('active')) {
            closeMenu();
            if (!document.getElementById('projects-view').classList.contains('hidden')) this.showHome();
            setTimeout(() => this.lenisInstance?.scrollTo(0), 100);
        }
    });
  },

  initHeroEvents: function() {
    const welcomeBtn = document.getElementById('welcome-trigger');
    const welcomeMsg = document.getElementById('welcome-message');
    const audioBtn = document.getElementById('audio-toggle');

    if(welcomeBtn && welcomeMsg) {
        welcomeBtn.onclick = () => {
            welcomeMsg.classList.toggle('opacity-0');
            welcomeMsg.classList.toggle('translate-y-4');
            welcomeMsg.classList.toggle('pointer-events-none');
        };
    }

    if(audioBtn) {
        const textSpan = audioBtn.lastElementChild;
        audioBtn.onclick = () => {
            if (!audioBtn.style.minWidth) {
                audioBtn.style.minWidth = `${audioBtn.offsetWidth}px`;
                textSpan.style.display = 'inline-block';
                textSpan.style.textAlign = 'center';
                textSpan.style.width = '100%';
            }
            if(!this.audioInstance) { 
                this.audioInstance = new Audio(ambientMusic); 
                this.audioInstance.loop = true; 
                this.audioInstance.volume = 0.4;
            }
            textSpan.style.opacity = '0';
            setTimeout(() => {
                if(this.audioInstance.paused) { 
                    this.audioInstance.play(); 
                    audioBtn.classList.add('bg-brand-dark', 'text-white');
                    textSpan.textContent = "Experiencia activa";
                } else { 
                    this.audioInstance.pause(); 
                    audioBtn.classList.remove('bg-brand-dark', 'text-white');
                    textSpan.textContent = "Activa la experiencia sonora";
                }
                textSpan.style.opacity = '1';
            }, 200);
        };
    }
  },

  initViewManager: function() {
    const triggerBtn = document.getElementById('view-all-projects');
    const backBtn = document.getElementById('back-to-home');
    if(triggerBtn) triggerBtn.onclick = () => this.showProjects();
    if(backBtn) backBtn.onclick = () => this.showHome();
    document.getElementById('nav-logo').onclick = (e) => { 
        if (!document.getElementById('projects-view').classList.contains('hidden')) {
            e.preventDefault();
            this.showHome();
        }
    };
  },

  initPortfolio: function() {
    const gridFull = document.getElementById('project-grid-full');
    const modal = document.getElementById('project-modal');

    if (gridFull) {
        // Renderizamos la estructura correcta del año y el escudo en el HTML base del modal
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
            // Restauramos el escudo técnico al cerrar
            modal.classList.add('invisible', 'spa-view-shield');
            document.body.style.overflow = '';
            if (document.getElementById('projects-view').classList.contains('hidden')) this.lenisInstance?.start();
        }, 500);
    };
  },

  openModal: function(p, modal) {
    const textContainer = document.getElementById('modal-text-content');
    const galleryContainer = document.getElementById('m-gallery');
    const galleryScroll = document.getElementById('gallery-scroll');

    textContainer.innerHTML = `
        <img src="/src/logo/sca_logo.svg" class="w-20 md:w-28 lg:w-40 mb-6 lg:mb-12 opacity-80">
        <h2 class="text-4xl md:text-5xl lg:text-7xl font-display text-brand-dark mb-4 lg:mb-10 leading-tight">${p.editorial_name}</h2>
        <div class="space-y-4 lg:space-y-8 text-sm md:text-base lg:text-lg font-body text-gray-600 leading-relaxed text-left lg:text-justify">
            <p class="font-bold text-brand-dark">${p.narrative_intro}</p>
            <p>${p.description}</p>
            <p class="text-brand-magenta font-subtitle uppercase tracking-widest text-xs">${p.year} - ${p.intervention_type}</p>
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
        .map(f => `<img src="${f}" class="w-full h-auto block object-cover" loading="eager">`)
        .join('');

    const existingMobileBtn = document.getElementById('mobile-video-btn');
    if (existingMobileBtn) existingMobileBtn.remove();

    if (videos.length > 0) {
        const mobileBtnWrapper = document.createElement('div');
        mobileBtnWrapper.id = 'mobile-video-btn';
        mobileBtnWrapper.className = "lg:hidden sticky bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-white via-white/90 to-transparent z-30 flex justify-center pb-8 md:pb-10";
        const mobileBtn = document.createElement('button');
        mobileBtn.className = "w-full max-w-xs py-4 md:py-5 bg-brand-dark text-white text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold shadow-2xl hover:bg-brand-magenta transition-all rounded-sm cursor-pointer";
        mobileBtn.innerText = "Ver Recorrido";
        mobileBtn.onclick = () => this.openVideoModal(videos);
        mobileBtnWrapper.appendChild(mobileBtn);
        galleryScroll.appendChild(mobileBtnWrapper);
    }

    // Quitamos el escudo antes de mostrar el modal
    modal.classList.remove('spa-view-shield', 'invisible');
    this.lenisInstance?.stop();
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        document.getElementById('modal-backdrop').classList.add('opacity-100');
        const panel = document.getElementById('modal-panel');
        panel.classList.remove('translate-x-full', 'lg:translate-x-full');
        galleryScroll.scrollTop = 0;
        setTimeout(() => textContainer.classList.remove('opacity-0', 'translate-y-8'), 400);
    });
  },

  openVideoModal: function(videos) {
    const vModal = document.getElementById('video-modal');
    const player = document.getElementById('video-player-root');
    const switcher = document.getElementById('video-switcher-container');
    switcher.innerHTML = '';
    
    // Quitamos el escudo
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
        
        // Restauramos el escudo al cerrar
        setTimeout(() => vModal.classList.add('invisible', 'spa-view-shield'), 500);
    };
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

  // INTEGRACIÓN DEL FORMULARIO DE WEB3FORMS
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

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        let result = await response.json();
        if (response.status === 200) {
          btn.innerText = "Mensaje Recibido";
          btn.classList.replace('bg-brand-dark', 'bg-green-600');
          form.reset();
        } else {
          btn.innerText = "Error en el envío";
          console.error("Error del servidor:", result.message);
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
  NeutraApp.initTeam();
  NeutraApp.initHeroEvents();
  NeutraApp.initContactForm(); // Ejecutamos la validación del formulario
  
  // ORDEN FINAL: Mostrar el sitio tras cargar el DOM
  NeutraApp.revealSite();
});