import { createEVIcon } from '../../scripts/utils.js';

function appendNavigationButton(sliderButtonContainer) {
  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slideNavButtonsLeft = document.createElement('div');
  slideNavButtonsLeft.classList.add('carousel-navigation-buttons');

  const slideNavButtonsRight = document.createElement('div');
  slideNavButtonsRight.classList.add('carousel-navigation-buttons');
  slideNavButtonsLeft.innerHTML = `
      <button type="button" class= "slide-prev" aria-label="${'Previous Slide'}"></button>
  `;
  slideNavButtonsRight.innerHTML = `
      <button type="button" class="slide-next" aria-label="${'Next Slide'}"></button>
  `;
  container.append(slideNavButtonsLeft);
  container.append(sliderButtonContainer);
  container.append(slideNavButtonsRight);

  container.querySelector('.slide-prev').addEventListener('click', () => {
    const prevButtonToClick = sliderButtonContainer.querySelector('.selected').previousSibling;
    if (prevButtonToClick) {
      prevButtonToClick.click();
    } else {
      const lastButtonToClick = sliderButtonContainer.lastChild;
      lastButtonToClick.click();
    }
  });
  container.querySelector('.slide-next').addEventListener('click', () => {
    const nextButtonToClick = sliderButtonContainer.querySelector('.selected').nextSibling;
    if (nextButtonToClick) {
      nextButtonToClick.click();
    } else {
      const firstButtonToClick = sliderButtonContainer.firstChild;
      firstButtonToClick.click();
    }
  });
  return container;
}

export default function decorate(block) {
  const buttons = document.createElement('div');
  buttons.className = 'carousel-buttons';

  [...block.children].forEach((row, i) => {
    const newContainer = document.createElement('div');
    newContainer.classList = 'slide-detail-container';
    const buttonContainer = document.createElement('div');
    buttonContainer.classList = 'slide-button-container';
    [...row.children].forEach((col, colIndex) => {
      createEVIcon(col.children[0], col);

      if (colIndex === 0 || colIndex === 1) {
        newContainer.appendChild(col);
      }

      if (colIndex === 1) {
        const allParagraphs = col.getElementsByTagName('p');
        [...allParagraphs].forEach((p, index) => {
          if (!p.classList.contains('button-container')) {
            if (index === 0) {
              p.classList.add('car-title', 'car-details');
              p.innerHTML = p.textContent.replace(/ /g, '<br>');
            } else {
              p.classList.add('car-price', 'car-details');
            }
          } else {
            buttonContainer.appendChild(p);
          }
        });
        col.append(buttonContainer);
      }
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('slide-img-col');
        }
      }
    });
    row.insertBefore(newContainer, row.children[0]);
    const button = document.createElement('button');
    button.title = 'Carousel Nav';
    if (!i) button.classList.add('selected');
    button.addEventListener('click', () => {
      block.scrollTo({
        top: 0,
        left: row.offsetLeft - row.parentNode.offsetLeft,
        behavior: 'smooth',
      });
      [...buttons.children].forEach((r) => r.classList.remove('selected'));
      button.classList.add('selected');
    });
    buttons.append(button);
  });

  const isSingleSlide = [...block.children].length <= 1;
  if (!isSingleSlide) {
    const buttonContainer = appendNavigationButton(buttons);
    block.parentElement.append(buttonContainer);
  } else {
    block.parentElement.append(buttons);
  }
}
