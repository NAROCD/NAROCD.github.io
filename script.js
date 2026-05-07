const menuButton = document.querySelector('#menuBtn');
const primaryNav = document.querySelector('#primaryNav');
const navLinks = document.querySelectorAll('#primaryNav a');
const yearElement = document.querySelector('#year');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fallbackCertifications = [
  {
    title: 'English C1 Proficiency',
  },
  {
    title: 'SAP Learning Hub Trainings',
  },
  {
    title: 'ABAP Development Practice',
  },
];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function certificationCardTemplate(certification) {
  const title = escapeHtml(certification.title);
  const issuer = escapeHtml(certification.issuer);
  const category = escapeHtml(certification.category);
  const icon = escapeHtml(certification.icon || 'badge-check');
  const url = certification.url ? escapeHtml(certification.url) : '';

  const titleMarkup = url
    ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>`
    : title;

  return `
    <article class="info-card reveal-card certification-card">
      <div class="card-icon" aria-hidden="true">
        <i data-lucide="${icon}"></i>
      </div>
      <h3>${titleMarkup}</h3>
      <dl class="certification-meta">
        <div>
          <dt>Issuer</dt>
          <dd>${issuer}</dd>
        </div>
        <div>
          <dt>Area</dt>
          <dd>${category}</dd>
        </div>
      </dl>
    </article>
  `;
}

function revealImmediately(elements) {
  elements.forEach((element) => {
    element.style.opacity = '1';
    element.style.transform = 'none';
  });
}

function animateDynamicCards(elements) {
  if (!elements.length) return;

  if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
    window.gsap.utils.toArray(elements).forEach((element, index) => {
      window.gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: Math.min(index * 0.04, 0.2),
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
        },
      });
    });
  } else {
    revealImmediately(elements);
  }
}

async function loadCertifications() {
  const certificationsGrid = document.querySelector('#certificationsGrid');
  if (!certificationsGrid) return;

  const source = certificationsGrid.dataset.certificationsSource || 'data/certifications.json';
  let certifications = fallbackCertifications;

  try {
    const response = await fetch(source, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Certifications request failed: ${response.status}`);
    }

    const parsedCertifications = await response.json();
    if (Array.isArray(parsedCertifications) && parsedCertifications.length > 0) {
      certifications = parsedCertifications;
    }
  } catch (error) {
    console.warn('Using fallback certifications:', error);
  }

  certificationsGrid.innerHTML = certifications.map(certificationCardTemplate).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }

  animateDynamicCards([...certificationsGrid.querySelectorAll('.reveal-card')]);
  updateCurrentNavLink();
}

loadCertifications();


if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

function closeNavigation() {
  if (!menuButton || !primaryNav) return;

  primaryNav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation menu');
}

function toggleNavigation() {
  if (!menuButton || !primaryNav) return;

  const isOpen = primaryNav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
}

menuButton?.addEventListener('click', toggleNavigation);

navLinks.forEach((link) => {
  link.addEventListener('click', closeNavigation);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeNavigation();
  }
});

if (window.lucide) {
  window.lucide.createIcons();
}

function updateCurrentNavLink() {
  const sections = [...document.querySelectorAll('main section[id]')];
  const headerOffset = document.querySelector('.site-header')?.offsetHeight ?? 0;
  const activationPoint = headerOffset + 24;
  const nearPageBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 48;

  let activeId = sections[0]?.id;

  if (nearPageBottom) {
    activeId = sections.at(-1)?.id ?? activeId;
  } else {
    for (const section of sections) {
      const {top, bottom} = section.getBoundingClientRect();

      if (top <= activationPoint && bottom > activationPoint) {
        activeId = section.id;
        break;
      }

      if (top <= activationPoint) {
        activeId = section.id;
      }
    }
  }

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${activeId}`;
    if (isActive) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

window.addEventListener('scroll', updateCurrentNavLink, { passive: true });
window.addEventListener('load', updateCurrentNavLink);
window.addEventListener('resize', updateCurrentNavLink, { passive: true });

if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);

  window.gsap.utils.toArray('.reveal').forEach((element) => {
    window.gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
      },
    });
  });

  window.gsap.utils.toArray('.reveal-card').forEach((element, index) => {
    window.gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: Math.min(index * 0.025, 0.2),
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 88%',
      },
    });
  });
} else {
  document.querySelectorAll('.reveal, .reveal-card').forEach((element) => {
    element.style.opacity = '1';
    element.style.transform = 'none';
  });
}
