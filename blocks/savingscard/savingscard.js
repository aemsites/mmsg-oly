export default function decorate(block) {
  let [image, content] = block.children;
  image.className = 'bg_image';
  content.className = 'fg_overlay_content';
}
