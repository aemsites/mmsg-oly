import { createForm } from '../form/form.js';
import { CONFIG } from '../../scripts/utils.js';

function resetSearchInput(searchIcon, closeIcon) {
  searchIcon.style.display = 'block';
  closeIcon.style.display = 'none';

  const tagsBlocks = document.querySelectorAll('.faq.block > div:nth-child(2)');
  tagsBlocks.forEach((block) => {
    block.removeAttribute('style');
  });

  const accordionGroupBlocks = document.querySelectorAll('.faq.accordion-group-container > .accordion-group-wrapper');
  accordionGroupBlocks.forEach((block) => {
    // block.style.width = '504px';
    block.classList.remove('expanded');
  });

  const defaultBlocks = document.querySelectorAll('.faq.accordion-group-container > .default-content-wrapper');
  defaultBlocks.forEach((block) => {
    block.removeAttribute('style');
  });

  const accordionBlocks = document.querySelectorAll('.accordion.block');
  accordionBlocks.forEach((block) => {
    block.removeAttribute('style');
  });
}

function handleSearchInput(searchIcon, closeIcon) {
  const searchTerm = document.querySelector('#form-faqsearch').value.toLowerCase();
  if (searchTerm.length > 0) {
    searchIcon.style.display = 'none';
    closeIcon.style.display = 'block';

    const tagsBlocks = document.querySelectorAll('.faq.block > div:nth-child(2)');
    tagsBlocks.forEach((block) => {
      block.style.display = 'none';
    });

    const accordionGroupBlocks = document.querySelectorAll('.faq.accordion-group-container > .accordion-group-wrapper');
    accordionGroupBlocks.forEach((block) => {
      // block.style.width = '100%';
      block.classList.add('expanded');
    });

    const accordionBlocks = document.querySelectorAll('.accordion.block');
    accordionBlocks.forEach((block) => {
      const blockContent = block.textContent.toLowerCase();
      if (blockContent.includes(searchTerm)) {
        block.style.display = 'block';
      } else {
        block.style.display = 'none';
      }
    });

    const defaultBlocks = document.querySelectorAll('.faq.accordion-group-container > .default-content-wrapper');
    defaultBlocks.forEach((block) => {
      block.style.display = 'none';
    });
  } else {
    resetSearchInput(searchIcon, closeIcon);
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

    // Create text span for close icon
    const closeText = document.createElement('span');
    closeText.classList.add('close-text');
    closeText.textContent = 'Close and back to FAQs';

    // Append icons to the wrapper
    const wrapper = document.querySelector('.field-wrapper');
    wrapper.appendChild(searchIcon);
    const closeContainer = document.createElement('div');
    closeContainer.classList.add('icon-text-container');
    closeContainer.appendChild(closeIcon);
    closeContainer.appendChild(closeText);
    wrapper.appendChild(closeContainer);

    searchInput.addEventListener('input', () => {
      handleSearchInput(searchIcon, closeContainer);
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
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      });
    });

    // Clear input when close icon is clicked
    closeContainer.addEventListener('click', () => {
      searchInput.value = '';
      searchIcon.style.display = 'block';
      closeContainer.style.display = 'none';
      searchInput.focus();
      // handleSearchInput(searchIcon, closeContainer);
      resetSearchInput(searchIcon, closeContainer);
    });

    // Clear input when close icon is activated via keyboard
    closeContainer.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        searchInput.value = '';
        searchIcon.style.display = 'block';
        closeContainer.style.display = 'none';
        searchInput.focus();
        // handleSearchInput(searchIcon, closeContainer);
        resetSearchInput(searchIcon, closeContainer);
      }
    });
  } else {
    element.remove();
  }
}
