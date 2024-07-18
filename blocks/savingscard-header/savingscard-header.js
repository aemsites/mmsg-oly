export default function decorate(block) {
  const [titleBg, title, description] = block.children;
  titleBg.className = 'bg-image';
  title.className = 'fg-overlay-content';
  description.className = 'section-desc';
}
