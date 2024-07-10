export default function decorate(block) {
  const [titleBg, title, sectionDesc, sectionNoOly, sectionWithOly] = block.children;
  titleBg.className = 'bg_image';
  title.className = 'fg_overlay_content';
  sectionDesc.className = 'section_desc';
  sectionNoOly.className = 'section_no_oly';
  sectionWithOly.className = 'section_with_oly';
}
