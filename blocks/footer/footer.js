import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const footerNavDiv = document.createElement('div');
  footerNavDiv.className = 'footer-nav-div';
  const footerNav = footer.querySelector('.footer-nav');
  const footerPElements = footerNav.querySelectorAll(':scope div > p');
  footerNavDiv.append(...footerPElements);

  const nav = document.createElement('nav');
  nav.className = 'footer-nav-links';
  const links = footer.querySelector('.footer-nav ul');
  nav.append(links);
  footerNavDiv.append(nav);

  footerNav.innerHTML = '';
  footerNav.append(footerNavDiv);
  block.append(footer);
}
