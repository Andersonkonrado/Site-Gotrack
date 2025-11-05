// main.js - comportamento do menu mobile, scroll reveal e validação do form
document.addEventListener('DOMContentLoaded', () => {
  // Atualiza anos no footer
  const years = document.querySelectorAll('#year, #year-2, #year-3, #year-4, #year-5, #year-6');
  years.forEach(el => { if (el) el.textContent = new Date().getFullYear(); });

  // Mobile menu toggle
  const btnMobile = document.getElementById('btn-mobile');
  const nav = document.getElementById('nav');
  if (btnMobile && nav) {
    btnMobile.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    // fechar menu ao clicar em link
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  // JavaScript para aplicar a classe
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) { // Mude o valor 50 para a altura que você quiser
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  //VIDEO//
  function loadVideo(el) {
    const videoId = el.getAttribute('data-video');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.title = "Demonstração Rastreador Veicular";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.frameBorder = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    el.innerHTML = "";
    el.appendChild(iframe);
  }
  // Simple scroll reveal for elements with class .reveal
  const revealOnScroll = () => {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < (window.innerHeight - 80)) el.classList.add('show');
    });
  };
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);

  // Contact form validation & fake send
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');
      const msgBox = form.querySelector('#formMsg');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        msgBox.textContent = 'Por favor, preencha todos os campos obrigatórios.';
        msgBox.style.color = 'var(--red)';
        return;
      }
      // check email simple
      if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        msgBox.textContent = 'E-mail inválido.';
        msgBox.style.color = 'var(--red)';
        return;
      }

      // Simular envio (front-end). Substitua por fetch() para back-end real
      msgBox.style.color = '#007700';
      msgBox.textContent = 'Enviando...';
      setTimeout(() => {
        msgBox.textContent = 'Mensagem enviada! Responderemos em breve.';
        form.reset();
      }, 900);
    });
  }
});
//HERO

// Carousel functionality
let currentSlide = 0;
const totalSlides = 2;
const wrapper = document.getElementById('carouselWrapper');
const dots = document.querySelectorAll('.carousel-dot');

function updateCarousel() {
  wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

// Auto-play carousel
setInterval(nextSlide, 5000);

// FAQ functionality
function toggleFaq(index) {
  const faqItems = document.querySelectorAll('.faq-item');
  const answer = faqItems[index].querySelector('.faq-answer');
  const icon = faqItems[index].querySelector('.faq-icon');

  answer.classList.toggle('active');
  icon.classList.toggle('active');
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});