import { createForm } from '../form/form.js';
import { CONFIG } from '../../scripts/utils.js';

function handleSearchInput(searchInput, searchIcon, closeIcon) {
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm.length > 0) {
    searchIcon.style.display = 'none';
    closeIcon.style.display = 'block';

    const accordionBlocks = document.querySelectorAll('.accordion.block');
    accordionBlocks.forEach((block) => {
      const blockContent = block.textContent.toLowerCase();
      if (blockContent.includes(searchTerm)) {
        block.style.display = 'block';
      } else {
        block.style.display = 'none';
      }
    });
  } else {
    searchIcon.style.display = 'block';
    closeIcon.style.display = 'none';
  }
}

export default async function decorate(block) {
  const element = block.querySelector('div.faq.block > div > div > p');

  // Check if form should be shown
  if (element && element.textContent.trim() === 'yes') {
    const anchors = block.querySelectorAll('a[href^="#"]');
    block.classList.add('form');
    const form = await createForm(`${CONFIG.baseURL}/faqform.json`);
    element.replaceChildren(form);

    const searchInput = block.querySelector('#form-faqsearch');

    // Create search and close icons
    const searchIcon = document.createElement('img');
    searchIcon.classList.add('icon', 'icon-search');
    searchIcon.src = '../../icons/search.svg'; // Replace with the path to your search icon
    searchIcon.alt = 'Search';
    searchIcon.setAttribute('aria-hidden', 'true');

    const closeIcon = document.createElement('img');
    closeIcon.classList.add('icon', 'icon-close');
    closeIcon.src = '../../icons/close.svg'; // Replace with the path to your close icon
    closeIcon.alt = 'Clear search';
    closeIcon.setAttribute('aria-hidden', 'true');
    closeIcon.setAttribute('tabindex', '0'); // Make the close icon focusable

    // Append icons to the wrapper
    const wrapper = document.querySelector('.field-wrapper');
    wrapper.appendChild(searchIcon);
    wrapper.appendChild(closeIcon);

    searchInput.addEventListener('input', () => {
      handleSearchInput(searchInput, searchIcon, closeIcon);
    });

    // Loop through each anchor and add a click event listener
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default anchor behavior
        // Get the target element id from the href attribute
        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        // Scroll to the target element if it exists
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Clear input when close icon is clicked
    closeIcon.addEventListener('click', () => {
      searchInput.value = '';
      searchIcon.style.display = 'block';
      closeIcon.style.display = 'none';
      searchInput.focus();
    });

    // Clear input when close icon is activated via keyboard
    closeIcon.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        searchInput.value = '';
        searchIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        searchInput.focus();
      }
    });
  } else {
    element.remove();
  }
}
