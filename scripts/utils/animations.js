// Animation utilities for the StudentFreelance Hub platform

export class AnimationUtils {
  // Smooth scroll to element
  static scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Fade in animation
  static fadeIn(element, duration = 500) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.opacity = Math.min(progress / duration, 1);
      
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  // Slide in from bottom
  static slideInFromBottom(element, duration = 600) {
    element.style.transform = 'translateY(50px)';
    element.style.opacity = '0';
    element.style.transition = `all ${duration}ms ease-out`;
    
    setTimeout(() => {
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
    }, 10);
  }

  // Scale animation
  static scaleIn(element, duration = 300) {
    element.style.transform = 'scale(0.9)';
    element.style.opacity = '0';
    element.style.transition = `all ${duration}ms ease-out`;
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    }, 10);
  }

  // Stagger animations for multiple elements
  static staggerAnimation(elements, animationFn, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        animationFn(element);
      }, index * delay);
    });
  }

  // Intersection Observer for scroll animations
  static observeElements(selector, animationFn, options = {}) {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    const observerOptions = { ...defaultOptions, ...options };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animationFn(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    document.querySelectorAll(selector).forEach(el => observer.observe(el));
  }

  // Typing animation
  static typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // Counter animation
  static animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      element.textContent = Math.floor(current);
      
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      }
    }, 16);
  }
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Animate elements on scroll
  AnimationUtils.observeElements('[data-id*="stat-"]', (element) => {
    AnimationUtils.slideInFromBottom(element);
  });
  
  AnimationUtils.observeElements('.grid > div', (element) => {
    AnimationUtils.fadeIn(element);
  });
  
  // Animate counters if they exist
  const statNumbers = document.querySelectorAll('[data-id*="stat-"] .text-2xl');
  statNumbers.forEach(stat => {
    const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
    if (target) {
      AnimationUtils.observeElements(`[data-id="${stat.closest('[data-id]').getAttribute('data-id')}"]`, () => {
        AnimationUtils.animateCounter(stat, target);
      });
    }
  });
});

export default AnimationUtils;