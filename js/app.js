document.addEventListener('DOMContentLoaded', () => {
     // Update copyright year
     document.getElementById('current-year').textContent = new Date().getFullYear();
     
     // Mobile menu toggle
     const menuToggle = document.querySelector('.menu-toggle');
     const navLinks = document.querySelector('.nav-links');
     
     menuToggle.addEventListener('click', () => {
         menuToggle.classList.toggle('active');
         navLinks.classList.toggle('active');
     });
     
     // Close menu when clicking outside
     document.addEventListener('click', (e) => {
         if (!e.target.closest('.nav-links') && !e.target.closest('.menu-toggle') && navLinks.classList.contains('active')) {
             menuToggle.classList.remove('active');
             navLinks.classList.remove('active');
         }
     });
     
     // Initialize particles
     if (typeof particlesJS !== 'undefined') {
         initParticles();
     }
     
     // Initialize all animations
     if (typeof initAnimations === 'function') {
         initAnimations();
     }
     
     // Check for WebGL support
     checkWebGLSupport();
 });
 
 function checkWebGLSupport() {
     try {
         const canvas = document.createElement('canvas');
         const hasWebGL = !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      
      if (!hasWebGL) {
          document.body.classList.add('no-webgl');
          const particles = document.getElementById('particles-js');
          if (particles) {
              particles.style.display = 'none';
          }
      }
  } catch (e) {
      console.warn('WebGL not supported, some effects will be disabled');
      document.body.classList.add('no-webgl');
  }
}

function initParticles() {
  particlesJS('particles-js', {
      "particles": {
          "number": {
              "value": 50,
              "density": {
                  "enable": true,
                  "value_area": 800
              }
          },
          "color": {
              "value": "#8a2be2"
          },
          "shape": {
              "type": "circle",
              "stroke": {
                  "width": 0,
                  "color": "#000000"
              },
              "polygon": {
                  "nb_sides": 5
              }
          },
          "opacity": {
              "value": 0.3,
              "random": true,
              "anim": {
                  "enable": true,
                  "speed": 0.5,
                  "opacity_min": 0.1,
                  "sync": false
              }
          },
          "size": {
              "value": 3,
              "random": true,
              "anim": {
                  "enable": true,
                  "speed": 2,
                  "size_min": 0.1,
                  "sync": false
              }
          },
          "line_linked": {
              "enable": true,
              "distance": 150,
              "color": "#8a2be2",
              "opacity": 0.2,
              "width": 1
          },
          "move": {
              "enable": true,
              "speed": 1,
              "direction": "none",
              "random": true,
              "straight": false,
              "out_mode": "out",
              "bounce": false,
              "attract": {
                  "enable": false,
                  "rotateX": 600,
                  "rotateY": 1200
              }
          }
      },
      "interactivity": {
          "detect_on": "canvas",
          "events": {
              "onhover": {
                  "enable": true,
                  "mode": "grab"
              },
              "onclick": {
                  "enable": true,
                  "mode": "push"
              },
              "resize": true
          },
          "modes": {
              "grab": {
                  "distance": 140,
                  "line_linked": {
                      "opacity": 0.5
                  }
              },
              "bubble": {
                  "distance": 400,
                  "size": 40,
                  "duration": 2,
                  "opacity": 8,
                  "speed": 3
              },
              "repulse": {
                  "distance": 200,
                  "duration": 0.4
              },
              "push": {
                  "particles_nb": 4
              },
              "remove": {
                  "particles_nb": 2
              }
          }
      },
      "retina_detect": true
  });
}