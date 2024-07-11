export default function decorate(block) {
  const [titleBg, title, sectionNoOly, sectionWithOly] = block.children;
  titleBg.className = 'bg-image';
  title.className = 'fg-overlay-content';
  sectionNoOly.className = 'no-oly';
  sectionWithOly.className = 'with-oly';
}
