/* eslint-disable no-plusplus */
function tagButtonsToSlides(slides, buttons, visibleSlides) {
  const taggedButtons = [];
  let startIndex = 0;
  for (let i = 0; i < buttons.length; i++) {
    const buttonIndex = buttons[i];
    taggedButtons.push({
      buttonIndex,
      slideIndexes: slides.slice(startIndex, startIndex + visibleSlides),
    });
    startIndex += visibleSlides;
  }
  // Handle the case where the last set has less than visibleSlides slides
  if (startIndex < slides.length) {
    taggedButtons.push({
      buttonIndex: buttons[buttons.length - 1],
      slideIndexes: slides.slice(startIndex),
    });
  }

  return taggedButtons;
}

export default function decorate(block) {
  const visibleSlidesCls = block.classList[1];
  const visibleSlides = parseInt(visibleSlidesCls.split('-')[2], 10);
  const buttons = document.createElement('div');
  buttons.className = 'carousel-buttons';
  if (visibleSlides) {
    const totalButtons = Math.ceil([...block.children].length / visibleSlides);
    const slidesIndexArray = [...[...block.children].keys()];
    const buttonIndexArray = Array.from({ length: totalButtons }, (_, i) => i);
    const carouselMappingArr = tagButtonsToSlides(
      slidesIndexArray,
      buttonIndexArray,
      visibleSlides,
    );
    const slideWidth = Math.ceil(window.innerWidth / visibleSlides);
    const slideWidthPercentage = (slideWidth * 100) / window.innerWidth;
    // console.log(carouselMappingArr);
    [...block.children].forEach((row) => {
      const classes = ['image', 'text'];
      classes.forEach((e, j) => {
        row.children[j].classList.add(`carousel-${e}`);
        row.style.width = `${slideWidthPercentage}%`;
      });
    });

    carouselMappingArr.forEach((element, index) => {
      const slides = [...block.children];
      /* buttons */
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
  } else {
    [...block.children].forEach((row, i) => {
      const classes = ['image', 'text'];
      classes.forEach((e, j) => {
        row.children[j].classList.add(`carousel-${e}`);
      });
      /* buttons */
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
  }
}
