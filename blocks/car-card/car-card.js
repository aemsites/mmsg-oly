import { createElementFromHTML } from '../../scripts/utils.js';
import myJsonObject from '../../scripts/data.js';

function getFeaturesContainer() {
  return `
      <div class="car-features-container">
        <div class="car-feature">
          <span class="camera">360 Camera</span>
        </div>
        <div class="car-feature">
          <span class="alloy-wheels">Alloy wheels</span>
        </div>
        <div class="car-feature">
          <span class="seats">Heated seats</span>
        </div>
      </div>
    `;
}

function getPriceContainer(cardObj) {
  return `
      <div class="car-card-price-container">
        <p class="car-card-price-title">Weekly price from</p>
        <h2 class="car-card-price">${cardObj?.weeklyPriceInfo}</h2>
        <p class="car-card-info">Including all car running costs</p>
        <p class="car-card-price-weekly">Estimated tax savings ${cardObj.price}</p>
      <div>
    `;
}

function getButtonContainer() {
  return `
    <div class="car-card-button-container">
      <p class="button-container">
        <a href="oly.com.au" title="View Offer Details" class="button">View Offer Details</a>
      </p>
    </div>
    `;
}

function getCheckboxContainer() {
  return `
    <div class="checkbox-container">
      <input type="checkbox" id="car-checkbox" />
      <label for="car-checkbox">Select a car variant</label>
    </div>
  `;
}

function buildCardTemplate(cardObj) {
  const defaultImg = '/content/dam/oly/images/tesla.jpeg';

  const imageLink = cardObj?.img || defaultImg;

  const basicCarDetailContainer = `
      <div class="container">
        <div class="heart-container">
          <h3>${cardObj?.year} ${cardObj?.modelName}</h3>
          <img data-offer-id="${cardObj?.offerId}" class="car-card-heart" src="../../icons/heart.svg" alt="Wishlist Icon">
        </div>
        <img class="car-card-image" src="${imageLink}" alt="BMW 4 Series">
        <p class="car-card-type">${cardObj?.type || ''}</p>
        <p class="car-card-description">${cardObj?.carDescription || ''}</p>
      <div>
      `;
  const featureContainer = cardObj?.isFeatures ? getFeaturesContainer() : '';
  const priceContainer = cardObj?.price ? getPriceContainer(cardObj) : '';
  const buttonContainer = cardObj?.isButtonExists ? getButtonContainer() : '';
  const checkboxContainer = cardObj?.isCheckbox ? getCheckboxContainer() : '';
  const wrapper = document.createElement('div');
  wrapper.className = 'car-detail-container';
  const elementArray = [basicCarDetailContainer, checkboxContainer, featureContainer, priceContainer, buttonContainer];
  elementArray.forEach((element) => {
    wrapper.appendChild(createElementFromHTML(element));
  });
  return wrapper.outerHTML;
}

function buildCards(carData) {
  const wrapper = document.createElement('div');
  wrapper.className = 'car-cards-wrapper';
  wrapper.innerHTML = carData.map(buildCardTemplate).join('');
  return wrapper;
}

export default function decorate(block) {
  // const myJsonObject = []; // this will be replaced by the actual data received
  if (!myJsonObject.length) return;
  const result = buildCards(myJsonObject);
  block.append(result);
}
