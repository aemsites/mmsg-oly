const ISEV = ['yes', 'no'];

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  const wrapper = document.createElement('div');

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      wrapper.append(col);
      const firstChildDiv = col.children[0];
      const isEV = firstChildDiv.textContent.trim();
      if (ISEV.includes(isEV)) {
        if (isEV === 'yes') {
          col.classList.add('car-details-ev');
        }
        firstChildDiv.remove();
      }
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
