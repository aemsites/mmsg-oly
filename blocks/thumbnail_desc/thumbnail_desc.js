export default function decorate(block) {
  [...block.children].forEach((row) => {});
  const div = document.createElement('div');
  div.classList.add('content');
  div.append(...block.children);
  block.append(div);
}
