import loadVideoDelayed from '../../scripts/delayed.js';

export default function decorate(block) {
  const link = block.querySelector('a').href;
  const childDiv = block.querySelector('div');
  const grandChilds = childDiv ? childDiv.querySelectorAll('div') : [];
  block.textContent = '';

  if (block.closest('body')) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadVideoDelayed(block, grandChilds, link);
      }
    });
    observer.observe(block);
  } else {
    loadVideoDelayed(block, grandChilds, link);
  }
}
