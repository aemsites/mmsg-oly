import { createForm } from '../form/form.js';
import { CONFIG } from '../../scripts/utils.js';

export default async function decorate(block) {
  block.classList.add('form');
  const form = await createForm(`${CONFIG.baseURL}/faqform.json`);
  block.replaceChildren(form);
}
