import './style.css';
import { projects } from './products/data.js';
import ambientMusic from './sound/pista_ambiental_sc.mp3';

const teamData = [
    { name: "Stefany", role: "Arquitecta", desc: "La mirada que da forma; su trazo conecta naturaleza y experiencia en cada proyecto.", img: "/images/team/stefany.jpg" },
    { name: "Gabriela", role: "Anfitriona", desc: "La presencia que recibe, organiza y acompaña, acercando cada proyecto a quienes lo habitarán.", img: "/images/team/gabriela.jpg" },
    { name: "Elias", role: "Contratista", desc: "La mano firme que hace posible lo imaginado, cuidando cada detalle para que el proyecto cobre vida.", img: "/images/team/elias.jpg" },
    { name: "Rafael", role: "Cancelero", desc: "El creador de umbrales; diseña aperturas que equilibran luz, aire y movimiento en cada proyecto.", img: "/images/team/rafael.jpg" },
    { name: "Roberto", role: "Plomero y electricista", desc: "El guardián de la armonía entre agua y luz; asegura que los flujos vitales circulen con equilibrio.", img: "/images/team/roberto.jpg" },
    { name: "Edder", role: "Publicista", desc: "El narrador de la esencia del estudio; convierte ideas en relatos que respiran identidad y claridad.", img: "/images/team/edder.jpg" }
];

const NeutraApp = {
  lenisInstance: null,
  audioInstance: null,

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
        if(anchor.id === 'trigger-projects-page' || anchor.classList.contains('nav-link-projects')) return;
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target && this.lenisInstance) this.lenisInstance.scrollTo(target);
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
        audioBtn.onclick = () => {
            if(!this.audioInstance) { 
                this.audioInstance = new Audio(ambientMusic); 
                this.audioInstance.loop = true; 
                this.audioInstance.volume = 0.4;
            }
            if(this.audioInstance.paused) { 
                this.audioInstance.play(); 
                audioBtn.classList.add('bg-brand-dark', 'text-white');
                audioBtn.querySelector('span:last-child').textContent = "Experiencia activa";
            } else { 
                this.audioInstance.pause(); 
                audioBtn.classList.remove('bg-brand-dark', 'text-white');
                audioBtn.querySelector('span:last-child').textContent = "Activa experiencia sonora";
            }
        };
    }
  },

  initViewManager: function() {
    const triggerBtn = document.getElementById('view-all-projects');
    const backBtn = document.getElementById('back-to-home');
    const projectsView = document.getElementById('projects-view');
    const homeView = document.getElementById('home-view');

    const showProjects = () => {
        this.lenisInstance?.stop();
        projectsView.classList.remove('hidden');
        setTimeout(() => {
            projectsView.classList.replace('opacity-0', 'opacity-100');
            projectsView.classList.remove('pointer-events-none');
            homeView.classList.add('opacity-0');
        }, 50);
    };

    const showHome = () => {
        projectsView.classList.replace('opacity-100', 'opacity-0');
        projectsView.classList.add('pointer-events-none');
        homeView.classList.remove('opacity-0');
        setTimeout(() => { 
            projectsView.classList.add('hidden'); 
            this.lenisInstance?.start(); 
        }, 700);
    };

    if(triggerBtn) triggerBtn.onclick = showProjects;
    if(backBtn) backBtn.onclick = showHome;
    document.getElementById('nav-logo').onclick = (e) => { e.preventDefault(); showHome(); };
  },

  initPortfolio: function() {
    const gridFull = document.getElementById('project-grid-full');
    const modal = document.getElementById('project-modal');

    if (gridFull) {
        gridFull.innerHTML = projects.map(p => `
            <article class="relative aspect-[3/4] overflow-hidden bg-gray-100 group cursor-pointer shadow-sm project-card" data-id="${p.id}">
              <img src="${p.cover}" class="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105">
              <div class="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/40 transition-colors"></div>
              <div class="absolute bottom-0 left-0 p-8 w-full z-20">
                <h3 class="text-2xl font-display text-white mb-2">${p.editorial_name}</h3>
                <span class="text-[10px] font-subtitle uppercase tracking-[0.2em] text-white/60">${p.location}</span>
              </div>
            </article>
        `).join('');
    }

    document.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (card) {
            this.openModal(projects.find(proj => proj.id == card.dataset.id), modal);
        }
    });

    document.getElementById('close-modal').onclick = () => {
        document.getElementById('modal-panel').classList.add('translate-x-full');
        document.getElementById('modal-backdrop').classList.remove('opacity-100');
        setTimeout(() => { 
            modal.classList.add('invisible');
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
        <img src="/src/logo/logotipo_completo.svg" class="w-40 mb-12 opacity-80">
        <h2 class="text-5xl lg:text-7xl font-display text-brand-dark mb-10 leading-tight">${p.editorial_name}</h2>
        <div class="space-y-8 text-lg font-body text-gray-600 leading-relaxed text-justify">
            <p class="font-bold text-brand-dark">${p.narrative_intro}</p>
            <p>${p.description}</p>
        </div>
    `;

    const videos = p.gallery.filter(f => f.endsWith('.mp4'));
    if (videos.length > 0) {
        const videoBtn = document.createElement('button');
        videoBtn.className = "mt-12 w-full py-5 border border-brand-magenta text-brand-magenta text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-brand-magenta hover:text-white transition-all cursor-pointer";
        videoBtn.innerText = "Ver Recorrido Virtual";
        videoBtn.onclick = () => this.openVideoModal(videos);
        textContainer.appendChild(videoBtn);
    }

    galleryContainer.innerHTML = p.gallery
        .filter(f => !f.endsWith('.mp4'))
        .map(f => `<img src="${f}" class="w-full h-auto block object-cover" loading="eager">`)
        .join('');

    modal.classList.remove('invisible');
    this.lenisInstance?.stop();
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        document.getElementById('modal-backdrop').classList.add('opacity-100');
        document.getElementById('modal-panel').classList.remove('translate-x-full');
        galleryScroll.scrollTop = 0;
        setTimeout(() => textContainer.classList.remove('opacity-0', 'translate-y-8'), 400);
    });
  },

  openVideoModal: function(videos) {
    const vModal = document.getElementById('video-modal');
    const player = document.getElementById('video-player-root');
    const switcher = document.getElementById('video-switcher-container');

    switcher.innerHTML = '';
    vModal.classList.remove('invisible');
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
        setTimeout(() => vModal.classList.add('invisible'), 500);
    };
  },

  initTeam: function() {
    const grid = document.getElementById('team-grid');
    if (!grid) return;
    grid.innerHTML = teamData.map(m => `
        <div class="group flex flex-col gap-6">
            <div class="aspect-[3/4] overflow-hidden bg-gray-100"><img src="${m.img}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"></div>
            <div><h4 class="text-3xl font-display text-brand-dark">${m.name}</h4><p class="text-[10px] font-subtitle text-brand-magenta uppercase tracking-widest mb-4">${m.role}</p><p class="text-sm font-body text-gray-500 leading-relaxed">${m.desc}</p></div>
        </div>
    `).join('');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  NeutraApp.initSmoothScroll();
  NeutraApp.initViewManager();
  NeutraApp.initPortfolio();
  NeutraApp.initTeam();
  NeutraApp.initHeroEvents();
});