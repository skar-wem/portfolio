document.addEventListener('DOMContentLoaded', () => {
     // Only enable custom cursor on desktop
     if (window.innerWidth > 768) {
         initCustomCursor();
     }
 });
 
 function initCustomCursor() {
     const cursorOuter = document.querySelector('.cursor-outer');
     const cursorInner = document.querySelector('.cursor-inner');
     
     // Check if cursor elements exist
     if (!cursorOuter || !cursorInner) return;
     
     // Add class to body to show we're using custom cursor
     document.body.classList.add('has-custom-cursor');
     
     // Hide default cursor
     document.body.style.cursor = 'none';
     
     // Track mouse position
     let mouseX = 0;
     let mouseY = 0;
     
     // Track cursor position
     let outerX = 0;
     let outerY = 0;
     let innerX = 0;
     let innerY = 0;
     
     // Set up event listeners
     document.addEventListener('mousemove', mouseMoveHandler);
     document.addEventListener('mousedown', mouseDownHandler);
     document.addEventListener('mouseup', mouseUpHandler);
     document.addEventListener('mouseenter', mouseEnterHandler);
     document.addEventListener('mouseleave', mouseLeaveHandler);
     
     // Set up interactive elements
     setupInteractiveElements();
     
     // Animation loop for smooth cursor movement
     function render() {
         // Calculate smooth movement for outer cursor
         outerX += (mouseX - outerX) * 0.15;
         outerY += (mouseY - outerY) * 0.15;
         
         // Calculate smooth movement for inner cursor
         innerX += (mouseX - innerX) * 0.25;
         innerY += (mouseY - innerY) * 0.25;
         
         // Apply positions
         cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px)`;
         cursorInner.style.transform = `translate(${innerX}px, ${innerY}px)`;
         
         // Continue animation loop
         requestAnimationFrame(render);
     }
     
     // Start animation loop
     render();
     
     // Event handlers
     function mouseMoveHandler(e) {
         mouseX = e.clientX;
         mouseY = e.clientY;
     }
     
     function mouseDownHandler() {
         cursorOuter.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(0.8)`;
         cursorInner.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1.2)`;
     }
     
     function mouseUpHandler() {
         cursorOuter.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
         cursorInner.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
     }
     
     function mouseEnterHandler() {
         cursorOuter.style.opacity = '1';
         cursorInner.style.opacity = '1';
     }
     
     function mouseLeaveHandler() {
         cursorOuter.style.opacity = '0';
         cursorInner.style.opacity = '0';
     }
     
     function setupInteractiveElements() {
         // Links, buttons, and other interactive elements
         const interactiveElements = document.querySelectorAll('a, button, .btn, .magnetic');
         
         interactiveElements.forEach(el => {
             el.addEventListener('mouseenter', () => {
                 cursorOuter.classList.add('cursor-grow');
             });
             
             el.addEventListener('mouseleave', () => {
                 cursorOuter.classList.remove('cursor-grow');
             });
         });
         
         // Magnetic effect for elements with .magnetic class
         const magneticElements = document.querySelectorAll('.magnetic');
         
         magneticElements.forEach(el => {
             el.addEventListener('mousemove', (e) => {
                 const strength = el.dataset.strength || 10;
                 const rect = el.getBoundingClientRect();
                 const centerX = rect.left + rect.width / 2;
                 const centerY = rect.top + rect.height / 2;
                 
                 const deltaX = Math.floor((centerX - e.clientX) * -strength / 10);
                 const deltaY = Math.floor((centerY - e.clientY) * -strength / 10);
                 
                 el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
             });
             
             el.addEventListener('mouseleave', () => {
                 el.style.transform = '';
             });
         });
     }
 }