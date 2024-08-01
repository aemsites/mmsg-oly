import loadVideoDelayed from '../../scripts/delayed.js';

export default function decorate(block) {
  const secondDiv = block && block.children[1]; // Get the second div
  if (secondDiv && secondDiv.textContent.trim() === 'yes') {
    block.classList.add('offer-embed');
  }

  const link = block.querySelector('a') && block.querySelector('a').href;
  // checking for youtube link
  if (link && link.includes('youtu')) {
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
  } else {
    secondDiv.remove();
    block.children[1].remove();
  }
}
