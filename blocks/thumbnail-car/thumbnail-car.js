export default function decorate(block) {
  block.children[1].append(block.children[2]);
}
