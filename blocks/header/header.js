import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * Get wishlist from local storage
 */
function getWishlist() {
  const wishlistString = localStorage.getItem('wishlist');
  return wishlistString ? JSON.parse(wishlistString) : [];
}

/**
 * add wishlist count to "#nav > div.section.nav-tools > div > ul > li:nth-child(1) > a" element as soon as possible
 */
function updateWishlistCount() {
  const wishlistElement = document.querySelector('#nav > div.section.nav-tools > div > ul > li:nth-child(1) > a');
  if (wishlistElement) {
    const wishlist = getWishlist();
    wishlistElement.textContent = `Wishlist (${wishlist.length})`;
    return true; // Successfully updated
  }
  return false; // Element not found
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const imageCover = navSections.querySelector('.default-content-wrapper > p');
    imageCover.remove();

    if (isDesktop.matches) {
      navSections.querySelectorAll(':scope .default-content-wrapper > ul li ul').forEach((navSectionul) => {
        navSectionul.append(imageCover);
      });
    }

    if (!isDesktop.matches) {
      const searchBox = document.createElement('input');
      searchBox.type = 'text';
      searchBox.placeholder = 'Search';
      searchBox.classList.add('search-box');
      navSections.querySelector(':scope .default-content-wrapper').prepend(searchBox);
    }
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      // if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      // navSection.addEventListener('click', () => {
      //   if (isDesktop.matches) {
      //     const expanded = navSection.getAttribute('aria-expanded') === 'true';
      //     toggleAllNavSections(navSections);
      //     navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      //   }
      // });
      if (navSection.children.length > 1) {
        navSection.children[1].classList.add('inactive');
        navSection.children[0].children[0].classList.remove('button');
        navSection.classList.add('chevron-menu');
        navSection.setAttribute('aria-expanded', 'false');
        navSection.children[0].addEventListener('click', (e) => {
          e.preventDefault();
          if (!isDesktop.matches) {
            e.currentTarget.nextElementSibling.classList.toggle('inactive');
            if (e.currentTarget.nextElementSibling.classList.length > 0) {
              e.currentTarget.parentElement.ariaExpanded = false;
              e.currentTarget.classList.remove('toggle-arrow');
            } else {
              e.currentTarget.parentElement.ariaExpanded = true;
              e.currentTarget.classList.add('toggle-arrow');
            }
          }
        });
      } else {
        navSection.children[0].children[0].classList.remove('button');
        navSection.classList.add('arrow-link');
      }
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
  updateWishlistCount();
}
