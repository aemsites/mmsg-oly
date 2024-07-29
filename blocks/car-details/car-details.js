import { createEVIcon } from '../../scripts/utils.js';

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  const wrapper = document.createElement('div');

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      wrapper.append(col);
      createEVIcon(col.children[0], col);
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
  block.textContent = '';
  block.append(wrapper);
}
