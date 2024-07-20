import { createForm } from '../form/form.js';
import { CONFIG } from '../../scripts/utils.js';

function handleSearchInput(e) {
  const searchTerm = e.target.value.toLowerCase();
  if (searchTerm.length > 0) {
    const accordionBlocks = document.querySelectorAll('.accordion.block');
    accordionBlocks.forEach((block) => {
      const blockContent = block.textContent.toLowerCase();
      if (blockContent.includes(searchTerm)) {
        block.style.display = 'block';
      } else {
        block.style.display = 'none';
      }
    });
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
    searchInput.addEventListener('input', handleSearchInput);

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
  } else {
    element.remove();
  }
}
