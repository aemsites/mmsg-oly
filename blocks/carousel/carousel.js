/* eslint-disable no-plusplus */
function tagButtonsToSlides(slides, buttons, visibleSlides) {
  const taggedButtons = [];
  let startIndex = 0;

  buttons.forEach((buttonIndex) => {
    taggedButtons.push({
      buttonIndex,
      slideIndexes: slides.slice(startIndex, startIndex + visibleSlides),
    });
    startIndex += visibleSlides;
  });

  // Handle the case where the last set has less than visibleSlides slides
  if (startIndex < slides.length) {
    taggedButtons.push({
      buttonIndex: buttons[buttons.length - 1],
      slideIndexes: slides.slice(startIndex),
    });
  }

  return taggedButtons;
}

function appendNavigationButton(sliderButtonContainer) {
  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');
  const slideNavButtons = document.createElement('div');
  slideNavButtons.classList.add('carousel-navigation-buttons');
  slideNavButtons.innerHTML = `
      <button type='button' class= 'slide-prev' aria-label='${'Previous Slide'}'></button>
      <button type='button' class='slide-next' aria-label='${'Next Slide'}'></button>
      `;
  container.append(slideNavButtons);
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
  const visibleSlidesCls = block.classList[1];
  const visibleSlides = parseInt(visibleSlidesCls.split('-')[2], 10);

  const buttons = document.createElement('div');
  buttons.className = 'carousel-buttons';

  const isDesktop = window.matchMedia('(min-width: 900px)');
  if (visibleSlides && isDesktop.matches) {
    const totalButtons = Math.ceil([...block.children].length / visibleSlides);

    const slidesIndexArray = [...[...block.children].keys()];
    const buttonIndexArray = Array.from({ length: totalButtons }, (_, i) => i);
    const carouselMappingArr = tagButtonsToSlides(slidesIndexArray, buttonIndexArray, visibleSlides);

    const slideWidth = Math.ceil((window.innerWidth - 200) / visibleSlides);
    const slideWidthPercentage = (slideWidth * 100) / window.innerWidth;

    [...block.children].forEach((row) => {
      row.style.width = `${slideWidthPercentage}%`;
      [...row.children].forEach((col) => {
        if (!col.children.length) {
          col.remove();
        }
      });
    });

    carouselMappingArr.forEach((element, index) => {
      const slides = [...block.children];
      const button = document.createElement('button');
      button.title = 'Carousel Nav';
      const mappedSlideIndex = element.slideIndexes[0];
      if (!index) button.classList.add('selected');
      button.addEventListener('click', () => {
        const row = slides[mappedSlideIndex];
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
    block.parentElement.append(buttons);
    const isSingleSlide = [...block.children].length <= visibleSlides;
    if (!isSingleSlide) {
      const buttonContainer = appendNavigationButton(buttons);
      block.parentElement.append(buttonContainer);
    }
  } else {
    [...block.children].forEach((row, i) => {
      [...row.children].forEach((col) => {
        if (!col.children.length) {
          col.remove();
        }
      });
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
    block.parentElement.append(buttons);
    const isSingleSlide = [...block.children].length <= 2;
    if (!isSingleSlide) {
      const buttonContainer = appendNavigationButton(buttons);
      block.parentElement.append(buttonContainer);
    }
  }
}
