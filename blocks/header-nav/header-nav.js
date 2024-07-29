export default function decorate(block) {
  const isAboveMobile = window.matchMedia('(min-width: 768px)');
  const isBelowDesktop = window.matchMedia('(max-width: 1023px)');
  const divider = document.createElement('span');
  const dividerInner = document.createElement('span');
  dividerInner.classList.add('divider');
  divider.classList.add('divider');
  divider.classList.add('divider-row');
  const anchorLink = block?.children[2]?.querySelector('a')?.getAttribute('href');
  block?.children[2].remove();

  const aTag = document.createElement('a');
  aTag.href = anchorLink;
  aTag.append(block.children[1].children[0].children[0]);
  block.children[1].children[0].append(aTag);

  if (isBelowDesktop.matches) {
    block.parentNode.parentNode.remove();
  } else {
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
}
