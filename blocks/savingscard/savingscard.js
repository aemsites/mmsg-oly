export default function decorate(block) {
  const [titleBg, title, sectionDesc, sectionNoOly, sectionWithOly] = block.children;
  titleBg.className = 'bg-image';
  title.className = 'fg-overlay-content';
  sectionDesc.className = 'section-desc';
  sectionNoOly.className = 'no-oly';
  sectionWithOly.className = 'with-oly';
}
