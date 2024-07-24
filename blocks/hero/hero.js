export default function decorate(block) {
  [...block.children].forEach((row) => {
    if (row.querySelector('picture')) {
      row.classList.add('hero-image');
    } else if (row.lastElementChild.children.length >= 1) {
      row.querySelector('h1').innerHTML = row.querySelector('h1').textContent;
      row.classList.add('hero-content');
    } else {
      row.classList.add('hero-inactive');
    }
  });
  const div = document.createElement('div');
  div.classList.add('content');
  div.append(...block.children);
  block.append(div);
}
