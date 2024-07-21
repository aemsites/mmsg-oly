export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }

      // appending class to a video column button
      const section = block.parentElement.parentElement;
      if (section.classList.contains('section') && section.classList.contains('video')) {
        const anchor = col.querySelector('a');
        if (anchor) {
          anchor.classList.add('primary');
        }
      }
    });
  });
}
