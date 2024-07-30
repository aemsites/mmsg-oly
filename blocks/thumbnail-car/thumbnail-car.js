export default function decorate(block) {
  console.log(block);
  block.children[1].append(block.children[2]);
}
