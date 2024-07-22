export default function decorate(block) {
  const isAboveMobile = window.matchMedia('(min-width: 768px)');
  const divider = document.createElement('span');
  const dividerInner = document.createElement('span');
  dividerInner.classList.add('divider');
  divider.classList.add('divider');
  divider.classList.add('divider-row');

  [...block.children].forEach((row, index) => {
    if (index === 1) {
      if (!isAboveMobile.matches) {
        row.addEventListener('click', function toggleNextElement() {
          this.nextElementSibling.classList.toggle('inactive');
        });
      }
    } else if (index === 2) {
      row.parentNode.insertBefore(divider, row.nextSibling);
      if (!isAboveMobile.matches) {
        row.classList.add('inactive');
      }
      if (row.firstElementChild?.firstElementChild?.children?.length > 0) {
        const links = [...(row.firstElementChild?.firstElementChild?.children || [])];
        links.forEach((col, indexCol) => {
          if (links.length - 1 !== indexCol) {
            col.insertAdjacentHTML('afterend', dividerInner.outerHTML);
          }
        });
      }
      if (row.firstElementChild?.firstElementChild?.children?.length > 8) {
        row.firstElementChild?.firstElementChild?.classList.add('link-arrows');
      }
    }
  });
}
