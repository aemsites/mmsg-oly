export default function decorate(block) {
  debugger;
  const [titleBg, title, sectionDesc, sectionNoOly, sectionWithOly] = block.children;
  titleBg.className = 'bg_image';
  title.className = 'fg_overlay_content';
  sectionDesc.className = 'section_desc';
  sectionNoOly.className = 'no_oly';
  sectionWithOly.className = 'with_oly';
}
