import './style.css';
import { projects } from './products/data.js'; // Asegúrate que la ruta sea correcta
import whooshSound from './sound/dinglandingpage.mp3';


// Inicialización de Smooth Scroll
const lenis = new Lenis({
  duration: 1.2, // Ajusta la "pesadez" (más alto = más suave)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);


const cursor = document.getElementById('custom-cursor');

// 1. Movimiento básico
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// 2. Efecto Hover en enlaces y botones
const interactiveElements = document.querySelectorAll('a, button, .project-card');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('scale-[3]', 'bg-brand-magenta/50'); // Crece y cambia color
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('scale-[3]', 'bg-brand-magenta/50');
    });
});

// CONECTAR CON TUS ANCLAS (Para que al dar click en menú baje suave)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    lenis.scrollTo(this.getAttribute('href'));
  });
});

const NeutraApp = {
  // 1. MÓDULO DEL TELÓN (Sin cambios)
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
      mainContent.classList.remove('h-screen', 'overflow-hidden');
      document.body.classList.remove('overflow-hidden');
      setTimeout(() => curtain.remove(), 1900);
    };

    const handleStart = (y) => startY = y;
    const handleEnd = (y) => { if (startY - y > 80) executeReveal(); };

    curtain.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientY));
    curtain.addEventListener('touchend', (e) => handleEnd(e.changedTouches[0].clientY));
    curtain.addEventListener('mousedown', (e) => handleStart(e.clientY));
    curtain.addEventListener('mouseup', (e) => handleEnd(e.clientY));
  },

  // 2. MÓDULO DE NAVEGACIÓN (Nuevo)
  initNavigation: function() {
      const toggle = document.getElementById('menu-toggle');
      const menu = document.getElementById('mobile-menu');
      const links = document.querySelectorAll('.mobile-link');
      
      if(!toggle) return;

      // Toggle Menu
      toggle.addEventListener('click', () => {
          toggle.classList.toggle('active');
          const isActive = toggle.classList.contains('active');
          
          if(isActive) {
              menu.classList.remove('opacity-0', 'pointer-events-none');
              document.body.style.overflow = 'hidden';
          } else {
              menu.classList.add('opacity-0', 'pointer-events-none');
              document.body.style.overflow = '';
          }
      });

      // Cerrar al hacer clic en un link
      links.forEach(link => {
          link.addEventListener('click', () => {
              toggle.classList.remove('active');
              menu.classList.add('opacity-0', 'pointer-events-none');
              document.body.style.overflow = '';
          });
      });
  },

  // 3. MÓDULO DE PORTAFOLIO (Adaptado)
  initPortfolio: function() {
    const gridContainer = document.getElementById('project-grid');
    const modal = document.getElementById('project-modal');
    const modalPanel = document.getElementById('modal-panel');
    const modalBackdrop = document.getElementById('modal-backdrop');
    
    if (!gridContainer) return;

    // Render Grid
    gridContainer.innerHTML = projects.map((project, index) => `
      <article class="group cursor-pointer relative aspect-[3/4] overflow-hidden bg-gray-100 project-card" 
               data-id="${project.id}">
        <img src="${project.cover}" alt="${project.title}" 
             class="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110" loading="lazy">
        <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
        <div class="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <span class="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-white/80 mb-2 block">
            ${project.category}
          </span>
          <h3 class="text-2xl font-display text-white leading-none">
            ${project.title}
          </h3>
        </div>
      </article>
    `).join('');

    // Click Event
    gridContainer.addEventListener('click', (e) => {
      const card = e.target.closest('article');
      if (card) {
        const id = parseInt(card.dataset.id);
        const project = projects.find(p => p.id === id);
        this.openModal(project, modal, modalPanel, modalBackdrop);
      }
    });

    // Close Modal Logic
    const closeModal = () => {
        modalPanel.classList.add('translate-x-full');
        modalBackdrop.classList.remove('opacity-100');
        modalBackdrop.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('invisible');
            document.body.style.overflow = ''; // Reactivar scroll
        }, 500);
    };

    document.getElementById('close-modal')?.addEventListener('click', closeModal);
  },

  openModal: function(project, modal, panel, backdrop) {
    // Llenar datos (sin cambios en la lógica interna)
    document.getElementById('m-title').textContent = project.title;
    document.getElementById('m-category').textContent = project.category;
    document.getElementById('m-location').textContent = project.location;
    document.getElementById('m-year').textContent = project.year;
    document.getElementById('m-desc').textContent = project.description;

    const galleryContainer = document.getElementById('m-gallery');
    galleryContainer.innerHTML = project.gallery.map(file => {
        if (file.endsWith('.mp4')) {
            return `<div class="w-full aspect-video bg-gray-100"><video src="${file}" class="w-full h-full object-cover" controls playsinline loop muted autoplay></video></div>`;
        } else {
            return `<img src="${file}" class="w-full h-auto object-cover" loading="lazy">`;
        }
    }).join('');

    modal.classList.remove('invisible');
    document.body.style.overflow = 'hidden';
    
    requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        panel.classList.remove('translate-x-full');
        
        setTimeout(() => {
            document.getElementById('modal-text-content').classList.remove('opacity-0', 'translate-y-4');
            document.getElementById('m-gallery').classList.remove('opacity-0');
            document.getElementById('m-gallery').classList.add('opacity-100');
        }, 400);
    });
  }
};


window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const parallaxImages = document.querySelectorAll('.parallax-img');
    
    parallaxImages.forEach(img => {
        // La imagen se mueve más lento que el scroll (efecto profundidad)
        const speed = 0.5; 
        img.style.transform = `translateY(${scrolled * speed}px) scale(1.25)`;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    NeutraApp.initCurtain();
    NeutraApp.initNavigation();
    NeutraApp.initPortfolio();
});

