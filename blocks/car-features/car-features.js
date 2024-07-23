export default function decorate(block) {
  const featureContainer = document.createElement('div');
  const detailContainer = document.createElement('div');
  const divContainer = document.createElement('div');
  featureContainer.className = 'feature-container';
  detailContainer.className = 'detail-container';
  const isDesktop = window.matchMedia('(min-width: 900px)');

  const [bl] = block.children[0].children;
  // Variable to store the <ul> and closest preceding <p>
  let ulElement = null;
  let closestPElement = null;
  [bl].forEach((item) => {
    [...item.children].forEach((child) => {
      if (child.tagName === 'UL') {
        ulElement = child;
        closestPElement = child;
        // Find the closest preceding <p> to the <ul>
        while (child.previousSibling) {
          closestPElement = closestPElement.previousSibling;
          if (closestPElement.nodeType === 1 && closestPElement.tagName === 'P') {
            featureContainer.append(closestPElement);
            break;
          }
        }
        featureContainer.append(child);
      }
    });
  });

  [bl].forEach((item) => {
    [...item.children].forEach((child) => {
      if (child !== ulElement && child !== closestPElement && child.className !== 'button-container') {
        detailContainer.append(child);
      }
      if (child.className === 'button-container') {
        if (isDesktop.matches) {
          detailContainer.append(child);
        } else {
          featureContainer.append(child);
        }
      }
    });
  });

  block.textContent = '';
  divContainer.append(detailContainer, featureContainer);
  block.append(divContainer);
}
