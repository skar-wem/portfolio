document.addEventListener('DOMContentLoaded', function() {
     // Update year in footer
     document.getElementById('year').textContent = new Date().getFullYear();
     
     // Custom cursor
     const cursorDot = document.querySelector('.cursor-dot');
     const cursorOutline = document.querySelector('.cursor-outline');
     
     // Only enable custom cursor on non-touch devices
     if (!('ontouchstart' in window)) {
         document.addEventListener('mousemove', (e) => {
             const posX = e.clientX;
             const posY = e.clientY;
             
             // Dot follows cursor exactly
             cursorDot.style.left = `${posX}px`;
             cursorDot.style.top = `${posY}px`;
             
             // Outline follows with slight delay
             cursorOutline.style.left = `${posX}px`;
             cursorOutline.style.top = `${posY}px`;
         });
         
         // Add hover effect for links
         const links = document.querySelectorAll('a, button, .project-item');
         
         links.forEach(link => {
             link.addEventListener('mouseenter', () => {
                 document.body.classList.add('hover-link');
             });
             
             link.addEventListener('mouseleave', () => {
                 document.body.classList.remove('hover-link');
             });
         });
     } else {
         // Hide cursor elements on touch devices
         cursorDot.style.display = 'none';
         cursorOutline.style.display = 'none';
     }
     
     // Project background color change on hover
     const projectItems = document.querySelectorAll('.project-item');
     const body = document.body;
     const originalColor = getComputedStyle(body).backgroundColor;
     
     projectItems.forEach(item => {
         const hoverColor = item.getAttribute('data-color');
         
         item.addEventListener('mouseenter', () => {
             body.style.transition = 'background-color 0.5s ease';
             body.style.backgroundColor = hoverColor;
         });
         
         item.addEventListener('mouseleave', () => {
             body.style.backgroundColor = originalColor;
         });
     });
     
     // Stagger animation for text elements
     const revealTextElements = document.querySelectorAll('.reveal-text');
     
     revealTextElements.forEach((element, index) => {
          const delay = index * 0.2; // 0.2 seconds between each element
          element.style.animationDelay = `${delay}s`;
          
          // Create after pseudo-element with same delay
          const style = document.createElement('style');
          style.innerHTML = `.reveal-text:nth-child(${index + 1})::after { animation-delay: ${delay}s; }`;
          document.head.appendChild(style);
      });
      
      // Smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function(e) {
              e.preventDefault();
              
              const targetId = this.getAttribute('href');
              if (targetId === '#') return;
              
              const targetElement = document.querySelector(targetId);
              if (!targetElement) return;
              
              window.scrollTo({
                  top: targetElement.offsetTop,
                  behavior: 'smooth'
              });
          });
      });
      
      // Simple page transitions
      const links = document.querySelectorAll('a:not([href^="#"])');
      
      links.forEach(link => {
          link.addEventListener('click', function(e) {
              // Skip if it's an external link or has target="_blank"
              if (this.hostname !== window.location.hostname || this.target === '_blank') return;
              
              e.preventDefault();
              const href = this.getAttribute('href');
              
              // Fade out
              document.body.style.opacity = 0;
              document.body.style.transition = 'opacity 0.5s ease';
              
              // Navigate after transition
              setTimeout(() => {
                  window.location.href = href;
              }, 500);
          });
      });
      
      // Initial page fade in
      document.body.style.opacity = 0;
      setTimeout(() => {
          document.body.style.transition = 'opacity 0.5s ease';
          document.body.style.opacity = 1;
      }, 100);
      
      // Parallax effect on scroll for intro section
      const intro = document.querySelector('.intro');
      
      window.addEventListener('scroll', () => {
          const scrollPosition = window.pageYOffset;
          if (scrollPosition < window.innerHeight) {
              const translateY = scrollPosition * 0.3;
              intro.style.transform = `translateY(${translateY}px)`;
          }
      });
      
      // Subtle text scramble effect for logo
      const logo = document.querySelector('.logo');
      const originalText = logo.textContent;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      
      logo.addEventListener('mouseenter', () => {
          let iterations = 0;
          const interval = setInterval(() => {
              logo.textContent = originalText
                  .split('')
                  .map((letter, index) => {
                      if (index < iterations) {
                          return originalText[index];
                      }
                      return chars[Math.floor(Math.random() * chars.length)];
                  })
                  .join('');
              
              if (iterations >= originalText.length) {
                  clearInterval(interval);
                  logo.textContent = originalText;
              }
              
              iterations += 1/2;
          }, 50);
      });
  });