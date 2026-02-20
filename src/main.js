import './style.css';
import { projects } from './products/data.js';
import whooshSound from './sound/dinglandingpage.mp3';

const NeutraApp = {
  lenisInstance: null,

  // 1. GESTIÓN DE SCROLL GLOBAL (Lenis)
  initSmoothScroll: function() {
    this.lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });
    this.lenisInstance.stop();

    const raf = (time) => {
      this.lenisInstance.raf(time);
      this.updateParallax(); 
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
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

  // 2. CORTINA DE ENTRADA
  initCurtain: function() {
    const curtain = document.getElementById('curtain');
    const mainContent = document.getElementById('main-content');
    if (!curtain || !mainContent) return;

    const executeReveal = () => {
      curtain.style.transform = 'translateY(-100%)';
      mainContent.style.opacity = '1';
      setTimeout(() => {
        mainContent.classList.remove('h-screen', 'overflow-hidden');
        document.body.classList.remove('overflow-hidden');
        document.body.style.overflow = '';
        if (this.lenisInstance) this.lenisInstance.start();
        curtain.remove();
      }, 1200);
    };
    curtain.addEventListener('mouseup', executeReveal);
    curtain.addEventListener('touchend', executeReveal);
  },

  // 3. PORTAFOLIO (Grid + Logos)
  initPortfolio: function() {
    const grid = document.getElementById('project-grid');
    const modal = document.getElementById('project-modal');
    const panel = document.getElementById('modal-panel');
    const backdrop = document.getElementById('modal-backdrop');
    const galleryScroll = document.getElementById('gallery-scroll');

    if (!grid) return;
    if (galleryScroll) galleryScroll.setAttribute('data-lenis-prevent', '');

    grid.innerHTML = projects.slice(0, 5).map((p, i) => {
      const colSpan = i < 2 ? "md:col-span-3" : "md:col-span-2";
      const aspect = i < 2 ? "aspect-video" : "aspect-[3/4]";
      return `
        <article class="${colSpan} relative ${aspect} overflow-hidden bg-gray-100 group cursor-pointer shadow-sm" data-id="${p.id}">
          <img src="/src/logo/logotipo_letras.svg" class="absolute top-6 left-6 w-24 z-30 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
          <img src="${p.cover}" class="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" loading="lazy">
          <div class="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-green/40 transition-colors"></div>
          <div class="absolute bottom-0 left-0 p-8 w-full z-20">
            <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-2 block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">${p.category}</span>
            <h3 class="text-2xl lg:text-4xl font-display text-white leading-none">${p.title}</h3>
          </div>
        </article>
      `;
    }).join('');

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('article');
      if (card) {
        const p = projects.find(proj => proj.id == card.dataset.id);
        this.openModal(p, modal, panel, backdrop);
      }
    });

    const closeModal = () => {
      panel.classList.add('translate-x-full');
      backdrop.classList.remove('opacity-100');
      setTimeout(() => {
        modal.classList.add('invisible');
        document.body.style.overflow = '';
        if (this.lenisInstance) this.lenisInstance.start();
      }, 500);
    };

    document.getElementById('close-modal').onclick = closeModal;
    backdrop.onclick = closeModal;
  },

  // 4. ABRIR MODAL (Logotipo + Video + Flecha Centrada)
  openModal: function(p, modal, panel, backdrop) {
    const textContainer = document.getElementById('modal-text-content');
    const galleryScroll = document.getElementById('gallery-scroll');
    const indicator = document.getElementById('scroll-indicator');

    // Inyectar Texto y Logotipo
    textContainer.innerHTML = `
        <img src="/src/logo/logotipo_letras.svg" class="w-32 mb-20 lg:w-60 opacity-100" alt="Marca">
        <span class="text-xs font-bold uppercase tracking-[0.2em] text-brand-green mb-4 block">${p.category}</span>
        <h2 class="text-5xl lg:text-7xl font-display text-brand-dark mb-8 leading-[0.9]">${p.title}</h2>
        <div class="flex items-center gap-6 text-xs font-body text-gray-400 mb-10 border-y border-gray-100 py-6 uppercase tracking-widest">
            <span>${p.location || 'México'}</span> <span class="w-1.5 h-1.5 rounded-full bg-brand-magenta"></span> <span>${p.year || '2026'}</span>
        </div>
        <p class="text-base font-body text-gray-600 leading-relaxed text-justify">${p.description}</p>
    `;

    // Botón de Video Reel (Recuperado)
    const videoFile = p.gallery.find(f => f.endsWith('.mp4'));
    if (videoFile) {
        const btn = document.createElement('button');
        btn.className = "mt-10 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-magenta border border-brand-magenta/20 px-6 py-4 hover:bg-brand-magenta hover:text-white transition-all cursor-pointer group";
        btn.innerHTML = `<svg class="w-3 h-3 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M3 22v-20l18 10-18 10z"/></svg> Reproducir Video`;
        btn.onclick = () => this.showVideoLightbox(videoFile);
        textContainer.appendChild(btn);
    }

    // Galería
    const gallery = document.getElementById('m-gallery');
    gallery.innerHTML = p.gallery
      .filter(f => !f.endsWith('.mp4'))
      .map(f => `<img src="${f}" class="w-full h-auto object-cover" loading="lazy">`)
      .join('');

    // RESET DE LA FLECHA DE SCROLL (Garantizado en cada apertura)
    if (indicator) {
        indicator.innerHTML = `
            <span class="text-xs uppercase tracking-[0.4em] text-white font-body mb-2">DESCUBRE MÁS</span>
            <svg class="w-12 h-12 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
        `;
        indicator.classList.remove('hidden', 'opacity-0');
        indicator.style.opacity = '1';
        
        // Función de ocultado al detectar scroll real
        const handleScroll = () => {
            if (galleryScroll.scrollTop > 40) {
                indicator.style.opacity = '0';
                setTimeout(() => indicator.classList.add('hidden'), 700);
                galleryScroll.removeEventListener('scroll', handleScroll);
            }
        };
        
        // Limpiamos cualquier listener residual y añadimos el nuevo
        galleryScroll.removeEventListener('scroll', handleScroll);
        galleryScroll.addEventListener('scroll', handleScroll);
    }

    modal.classList.remove('invisible');
    document.body.style.overflow = 'hidden';
    if (this.lenisInstance) this.lenisInstance.stop();

    requestAnimationFrame(() => {
      backdrop.classList.add('opacity-100');
      panel.classList.remove('translate-x-full');
      if(galleryScroll) galleryScroll.scrollTop = 0; // Reset scroll de la galería
      
      setTimeout(() => {
        textContainer.classList.remove('opacity-0', 'translate-y-8');
        gallery.classList.add('opacity-100');
      }, 400);
    });
  },

  // LIGHTBOX DE VIDEO (Recuperado)
  showVideoLightbox: function(url) {
    const lb = document.createElement('div');
    lb.className = "fixed inset-0 z-[400] bg-black backdrop-blur-xl flex items-center justify-center p-4 lg:p-20 transition-opacity duration-500 opacity-0";
    lb.innerHTML = `
        <button id="close-lb" class="absolute top-8 right-8 text-white text-5xl font-light hover:text-brand-magenta transition-colors cursor-pointer z-[410]">&times;</button>
        <div class="w-full max-w-6xl aspect-video shadow-2xl">
            <video src="${url}" class="w-full h-full object-contain" controls autoplay playsinline></video>
        </div>
    `;
    document.body.appendChild(lb);
    
    requestAnimationFrame(() => lb.style.opacity = '1');

    const closeLB = () => {
        lb.style.opacity = '0';
        setTimeout(() => lb.remove(), 500);
    };

    document.getElementById('close-lb').onclick = closeLB;
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeLB(); }, { once: true });
  },

  // 5. NAVEGACIÓN MOBILE
  initNavigation: function() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.onclick = () => {
        const active = toggle.classList.toggle('active');
        menu.classList.toggle('opacity-0', !active);
        menu.classList.toggle('pointer-events-none', !active);
        document.body.style.overflow = active ? 'hidden' : '';
        if (this.lenisInstance) active ? this.lenisInstance.stop() : this.lenisInstance.start();
    };

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.onclick = () => {
            toggle.classList.remove('active');
            menu.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = '';
            if (this.lenisInstance) this.lenisInstance.start();
        };
    });
  },

  initCursor: function() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    document.onmousemove = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };
    document.querySelectorAll('a, button, article').forEach(el => {
      el.onmouseenter = () => cursor.classList.add('scale-[3]', 'bg-brand-magenta/50');
      el.onmouseleave = () => cursor.classList.remove('scale-[3]', 'bg-brand-magenta/50');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  NeutraApp.initSmoothScroll();
  NeutraApp.initCurtain();
  NeutraApp.initNavigation();
  NeutraApp.initPortfolio();
  if (window.innerWidth > 1024) NeutraApp.initCursor();
});