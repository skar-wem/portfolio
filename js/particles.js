/* 
 * particles.js v2.0.0
 * A lightweight JavaScript library for creating particles
 * 
 * Note: This is a placeholder for the particles.js library
 * In a real implementation, you would include the full library from:
 * https://github.com/VincentGarreau/particles.js/
 */

// This is a simplified version of the library for demonstration
// In a real project, download the full particles.js library

// Simplified particles.js implementation
(function() {
     window.particlesJS = function(selector, options) {
         const canvas = document.createElement('canvas');
         const ctx = canvas.getContext('2d');
         let particles = [];
         const container = document.getElementById(selector);
         
         if (!container) return;
         
         // Set canvas to container size
         canvas.width = container.offsetWidth;
         canvas.height = container.offsetHeight;
         container.appendChild(canvas);
         
         // Basic particle class
         class Particle {
             constructor() {
                 this.x = Math.random() * canvas.width;
                 this.y = Math.random() * canvas.height;
                 this.vx = (Math.random() - 0.5) * 0.5;
                 this.vy = (Math.random() - 0.5) * 0.5;
                 this.size = Math.random() * 3 + 1;
                 this.color = options?.particles?.color?.value || '#8a2be2';
                 this.opacity = (options?.particles?.opacity?.random ? Math.random() * 0.8 : 0.8) + 0.2;
             }
             
             update() {
                 this.x += this.vx;
                 this.y += this.vy;
                 
                 // Bounce off edges
                 if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                 if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
             }
             
             draw() {
                 ctx.beginPath();
                 ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                 ctx.fillStyle = `rgba(${hexToRgb(this.color)}, ${this.opacity})`;
                 ctx.fill();
             }
         }
         
         // Helper function to convert hex to rgb
         function hexToRgb(hex) {
             const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
             return result ? 
                 `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
                 '138, 43, 226';
         }
         
         // Create particles
         function createParticles() {
             const particleCount = options?.particles?.number?.value || 50;
             for (let i = 0; i < particleCount; i++) {
                 particles.push(new Particle());
             }
         }
         
         // Animation loop
         function animate() {
             ctx.clearRect(0, 0, canvas.width, canvas.height);
             
             // Update and draw particles
             particles.forEach(particle => {
                 particle.update();
                 particle.draw();
             });
             
             // Draw lines between particles
             if (options?.particles?.line_linked?.enable) {
                 const lineDistance = options?.particles?.line_linked?.distance || 150;
                 const lineColor = options?.particles?.line_linked?.color || '#8a2be2';
                 const lineOpacity = options?.particles?.line_linked?.opacity || 0.2;
                 
                 for (let i = 0; i < particles.length; i++) {
                     for (let j = i + 1; j < particles.length; j++) {
                         const dx = particles[i].x - particles[j].x;
                         const dy = particles[i].y - particles[j].y;
                         const distance = Math.sqrt(dx * dx + dy * dy);
                         
                         if (distance < lineDistance) {
                             ctx.beginPath();
                             ctx.moveTo(particles[i].x, particles[i].y);
                             ctx.lineTo(particles[j].x, particles[j].y);
                             ctx.strokeStyle = `rgba(${hexToRgb(lineColor)}, ${lineOpacity})`;
                             ctx.lineWidth = 1;
                             ctx.stroke();
                         }
                     }
                 }
             }
             
             requestAnimationFrame(animate);
         }
         
         // Handle window resize
         window.addEventListener('resize', () => {
             canvas.width = container.offsetWidth;
             canvas.height = container.offsetHeight;
             particles = [];
             createParticles();
         });
         
         // Initialize
         createParticles();
         animate();
     };
 })();