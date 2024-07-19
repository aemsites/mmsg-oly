export default function decorate(block) {
  const [bl] = block.children;
  const col1 = document.createElement('div');
  const col2 = document.createElement('div');
  const col3 = document.createElement('div');
  col1.className = 'col1';
  col2.className = 'col2';
  col3.className = 'col3';
  [...bl.children].forEach((item) => {
    [...item.children].forEach((el, index) => {
      if (index === 0) {
        col1.append(el);
      } else if (index === item.children.length - 1) {
        col3.append(el);
      } else {
        col2.append(el);
      }
    });
  });
  block.textContent = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'container';
  wrapper.append(col1);
  wrapper.append(col2);
  wrapper.append(col3);
  block.append(wrapper);
}
