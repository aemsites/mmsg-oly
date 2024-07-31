export default function decorate(block) {
  const [takeawaysWrapper] = block.children;
  takeawaysWrapper.classList.add('takeaways');
}
