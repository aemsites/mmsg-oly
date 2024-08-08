export default async function decorate(block) {
  // Select the image and its parent p tag
  const image = block.querySelector('img');
  const parentP = image.closest('p');

  // Create a new anchor element
  const anchor = block.querySelector('a');
  anchor.href = anchor.getAttribute('href') || '#';

  // Move the image inside the anchor
  parentP.insertBefore(anchor, image);
  anchor.appendChild(image);
}
