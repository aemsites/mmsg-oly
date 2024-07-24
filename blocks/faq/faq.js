import { createForm } from '../form/form.js';
import { CONFIG } from '../../scripts/utils.js';

function toggleBlocks(selector, isShow) {
  const blocks = document.querySelectorAll(selector);
  if (blocks && blocks.length > 0) {
    if (isShow) {
      blocks.forEach((block) => {
        block.removeAttribute('style');
      });
    } else {
      blocks.forEach((block) => {
        block.style.display = 'none';
      });
    }
  }
}

function resetSearchInput(searchIcon, closeIcon, searchMessage) {
  searchIcon.style.display = 'block';
  closeIcon.style.display = 'none';
  searchMessage.style.display = 'none';

  toggleBlocks('.faq.block > div:nth-child(2)', true);

  const accordionGroupBlocks = document.querySelectorAll('.faq.accordion-group-container > .accordion-group-wrapper');
  accordionGroupBlocks.forEach((block) => {
    block.classList.remove('expanded');
  });

  toggleBlocks('.faq.accordion-group-container > .default-content-wrapper', true);
  toggleBlocks('.accordion.block', true);
}

function handleSearchInput(searchIcon, closeIcon, searchMessage) {
  const searchTerm = document.querySelector('#form-faqsearch').value.toLowerCase();
  if (searchTerm.length > 0) {
    searchIcon.style.display = 'none';
    closeIcon.style.display = 'block';

    toggleBlocks('.faq.block > div:nth-child(2)', false);

    const accordionGroupBlocks = document.querySelectorAll('.faq.accordion-group-container > .accordion-group-wrapper');
    accordionGroupBlocks.forEach((block) => {
      block.classList.add('expanded');
    });

    const accordionBlocks = document.querySelectorAll('.accordion.block');
    let resultCount = 0;
    accordionBlocks.forEach((block) => {
      const blockContent = block.textContent.toLowerCase();
      if (blockContent.includes(searchTerm)) {
        block.style.display = 'block';
        resultCount += 1;
      } else {
        block.style.display = 'none';
      }
    });

    searchMessage.textContent = `You searched "${searchTerm}" (${resultCount} result${resultCount !== 1 ? 's' : ''} found)`;
    searchMessage.style.display = 'block';

    toggleBlocks('.faq.accordion-group-container > .default-content-wrapper', false);
  } else {
    resetSearchInput(searchIcon, closeIcon, searchMessage);
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

    // Create search message element
    const searchMessage = document.createElement('div');
    searchMessage.classList.add('search-message');
    searchMessage.style.display = 'none';

    // Append icons and search message to the wrapper
    const wrapper = document.querySelector('.field-wrapper');
    wrapper.appendChild(searchIcon);
    const closeContainer = document.createElement('div');
    closeContainer.classList.add('icon-text-container');
    closeContainer.appendChild(closeText);
    closeContainer.appendChild(closeIcon);
    wrapper.appendChild(closeContainer);
    wrapper.appendChild(searchMessage);

    searchInput.addEventListener('input', () => {
      handleSearchInput(searchIcon, closeContainer, searchMessage);
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
      searchMessage.style.display = 'none';
      searchInput.focus();
      resetSearchInput(searchIcon, closeContainer, searchMessage);
    });

    // Clear input when close icon is activated via keyboard
    closeContainer.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        searchInput.value = '';
        searchIcon.style.display = 'block';
        closeContainer.style.display = 'none';
        searchMessage.style.display = 'none';
        searchInput.focus();
        resetSearchInput(searchIcon, closeContainer, searchMessage);
      }
    });
  } else {
    element.remove();
  }
}
