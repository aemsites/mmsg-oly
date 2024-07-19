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
  block.classList.add('form');
  const form = await createForm(`${CONFIG.baseURL}/faqform.json`);
  block.replaceChildren(form);

  const searchInput = block.querySelector('#form-faqsearch');
  searchInput.addEventListener('input', handleSearchInput);
}
