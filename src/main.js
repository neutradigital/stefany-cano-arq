import './style.css';
import { projects } from './products/data.js';
import whooshSound from './sound/dinglandingpage.mp3';

const NeutraApp = {
  lenisInstance: null,

  // 1. INICIALIZACIÓN DE SCROLL (Control Global)
  initSmoothScroll: function() {
    this.lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    this.lenisInstance.stop();

    // Loop de animación sincronizado
    const raf = (time) => {
      this.lenisInstance.raf(time);
      this.updateParallax(); 
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Navegación suave por anclas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) this.lenisInstance.scrollTo(target);
      });
    });
  },

  // FUNCIÓN DE ACTUALIZACIÓN DE PARALLAX
  updateParallax: function() {
    if (!this.lenisInstance) return;
    const scrolled = this.lenisInstance.scroll; 
    
    document.querySelectorAll('.parallax-img').forEach(img => {
      img.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0) scale(1.25)`;
    });
  },

  // 2. CORTINA (Control de Revelado)
  initCurtain: function() {
    const curtain = document.getElementById('curtain');
    if (!curtain) return;

    let startY = 0;
    const revealSound = new Audio(whooshSound);
    revealSound.volume = 0.2;

    const executeReveal = () => {
      revealSound.play().catch(() => {});
      curtain.style.transform = 'translateY(-100%)';
      const mainContent = document.getElementById('main-content');
      mainContent.style.opacity = '1';
      
      setTimeout(() => {
        document.body.style.overflow = '';
        document.body.classList.remove('overflow-hidden');
        mainContent.classList.remove('h-screen', 'overflow-hidden');
        
        if (this.lenisInstance) this.lenisInstance.start();
        curtain.remove();
      }, 1200);
    };

    curtain.addEventListener('touchstart', (e) => startY = e.touches[0].clientY);
    curtain.addEventListener('touchend', (e) => {
      if (startY - e.changedTouches[0].clientY > 80) executeReveal();
    });
    curtain.addEventListener('mousedown', (e) => startY = e.clientY);
    curtain.addEventListener('mouseup', (e) => {
      if (startY - e.clientY > 80) executeReveal();
    });
  },

  // 3. PORTAFOLIO Y MODAL (Lógica de 6 columnas)
  initPortfolio: function() {
    const grid = document.getElementById('project-grid');
    const modal = document.getElementById('project-modal');
    const panel = document.getElementById('modal-panel');
    const backdrop = document.getElementById('modal-backdrop');
    
    // Aislamiento de scroll para el modal
    const galleryScroll = document.getElementById('gallery-scroll');
    const textScroll = document.getElementById('modal-text-content')?.parentElement;

    if (!grid) return;

    if (galleryScroll) galleryScroll.setAttribute('data-lenis-prevent', '');
    if (textScroll) textScroll.setAttribute('data-lenis-prevent', '');

    grid.innerHTML = projects.slice(0, 5).map((p, i) => {
      const colSpan = i < 2 ? "md:col-span-3" : "md:col-span-2";
      const aspect = i < 2 ? "aspect-video" : "aspect-[3/4]";
      return `
        <article class="${colSpan} relative ${aspect} overflow-hidden bg-gray-100 group cursor-pointer" data-id="${p.id}">
          <img src="${p.cover}" class="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105" loading="lazy">
          <div class="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/40 transition-colors duration-500"></div>
          <div class="absolute bottom-0 left-0 p-8 w-full z-20">
            <span class="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-white/80 mb-2 block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">${p.category}</span>
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

  // 4. ABRIR MODAL
  openModal: function(p, modal, panel, backdrop) {
    document.getElementById('m-title').textContent = p.title;
    document.getElementById('m-category').textContent = p.category;
    document.getElementById('m-desc').textContent = p.description;

    const gallery = document.getElementById('m-gallery');
    gallery.innerHTML = p.gallery.map(f => 
      f.endsWith('.mp4') 
      ? `<video src="${f}" class="w-full" controls autoplay muted loop></video>` 
      : `<img src="${f}" class="w-full h-auto" loading="lazy">`
    ).join('');

    modal.classList.remove('invisible');
    document.body.style.overflow = 'hidden'; 
    if (this.lenisInstance) this.lenisInstance.stop();

    requestAnimationFrame(() => {
      backdrop.classList.add('opacity-100');
      panel.classList.remove('translate-x-full');
      
      const galleryEl = document.getElementById('gallery-scroll');
      if(galleryEl) galleryEl.scrollTop = 0;

      setTimeout(() => {
        document.getElementById('modal-text-content').classList.remove('opacity-0', 'translate-y-4');
        document.getElementById('m-gallery').classList.add('opacity-100');
      }, 400);
    });
  },

  // 5. NAVEGACIÓN (Transformación Hamburguesa -> X)
  initNavigation: function() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-link');
    
    if (!toggle || !menu) return;

    const closeMenu = () => {
        toggle.classList.remove('active'); 
        menu.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = ''; 
        if (this.lenisInstance) this.lenisInstance.start();
    };

    const openMenu = () => {
        toggle.classList.add('active'); 
        menu.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden'; 
        if (this.lenisInstance) this.lenisInstance.stop();
    };

    toggle.onclick = () => {
        const isOpening = !toggle.classList.contains('active');
        if (isOpening) {
            openMenu();
        } else {
            closeMenu();
        }
    };

    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
  },

  // 6. CURSOR MAGNÉTICO
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