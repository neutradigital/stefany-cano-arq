import './style.css';
import whooshSound from './sound/dingsound.mp3';

// Definimos un espacio de nombres (Namespace) para tu UI
const NeutraUI = {
    initCurtain: function() {
        const curtain = document.getElementById('curtain');
        if (!curtain) return;

        let startY = 0;
        const revealSound = new Audio(whooshSound)
        revealSound.volume = 0.3;
        revealSound.load(); // Forzamos la carga temprana

      // Función para "desbloquear" el audio en móviles
      const unlockAudio = () => {
          revealSound.play().then(() => {
              revealSound.pause();
              revealSound.currentTime = 0;
          }).catch(() => {});
          // Lo hacemos solo una vez, luego removemos el listener
          curtain.removeEventListener('touchstart', unlockAudio);
      };

      curtain.addEventListener('touchstart', unlockAudio);

// ... resto de tu lógica de executeReveal

        // Esta es la función que causaba el error, ahora es un método privado del objeto
        const executeReveal = () => {
            revealSound.play().catch(() => {});
            curtain.style.transform = 'translateY(-100%)';
            document.getElementById('main-content').style.opacity = '1';
            document.body.classList.remove('overflow-hidden');
            
            setTimeout(() => {
                curtain.remove(); // Limpieza de DOM para rendimiento
            }, 1900);
        };

        curtain.addEventListener('touchstart', (e) => startY = e.touches[0].clientY);
        curtain.addEventListener('touchend', (e) => {
            const distance = startY - e.changedTouches[0].clientY;
            if (distance > 80) executeReveal();
        });
        
        // Listener para Mouse también
        curtain.addEventListener('mousedown', (e) => startY = e.clientY);
        curtain.addEventListener('mouseup', (e) => {
            if (startY - e.clientY > 80) executeReveal();
        });
    }
};

// Ejecución única
NeutraUI.initCurtain();