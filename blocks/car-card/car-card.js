import { createElementFromHTML } from '../../scripts/utils.js';
import myJsonObject from '../../scripts/data.js';

function getFeaturesContainer() {
  return `
      <div class="car-features-container">
        <div class="car-feature">
          <span>360 Camera</span>
        </div>
        <div class="car-feature">
          <span>Alloy wheels</span>
        </div>
        <div class="car-feature">
          <span>Heated seats</span>
        </div>
      </div>
    `;
}

function getPriceContainer(cardObj) {
  return `
      <div class="car-card-price-container">
        <p class="car-card-price-title">Tax Saving</p>
        <p class="car-card-price">${cardObj?.price}</p>
        <p class="car-card-price-weekly">Weekly Price Starts From ${cardObj.weeklyPriceInfo}</p>
      <div>
    `;
}

function getButtonContainer() {
  return `
    <div class="car-card-button-container">
      <p class="button-container">
        <a href="oly.com.au" title="View Offer Details" class="button">View Offer Details</a>
      </p>
      <p class="button-container">
        <a href="oly.com.au" title="Request A Call" class="button primary">Request A Call</a>
      </p>
    </div>
    `;
}

function buildCardTemplate(cardObj) {
  const defaultImg = '/content/dam/oly/images/tesla.jpeg';

  const imageLink = cardObj?.img || defaultImg;

  const basicCarDetailContainer = `
      <div class="container">
        <h2 >${cardObj?.year} ${cardObj?.modelName}</h2>
        <img class="car-card-image" src="${imageLink}" alt="BMW 4 Series">
        <p class="car-card-description">${cardObj?.carDescription || ''}</p>
      <div>
      `;
  const featureContainer = cardObj?.isFeatures ? getFeaturesContainer() : '';
  const priceContainer = cardObj?.price ? getPriceContainer(cardObj) : '';
  const buttonContainer = cardObj?.isButtonExists ? getButtonContainer() : '';
  const wrapper = document.createElement('div');
  wrapper.className = 'car-detail-container';
  const elementArray = [basicCarDetailContainer, featureContainer, priceContainer, buttonContainer];
  elementArray.forEach((element) => {
    wrapper.appendChild(createElementFromHTML(element));
  });
  return wrapper.outerHTML;
}

function buildCards(carData) {
  const wrapper = document.createElement('div');
  wrapper.className = 'car-cards-wrapper';
  wrapper.innerHTML = carData.map(buildCardTemplate).join('');
  // appendCardListeners(wrapper);
  return wrapper;
}

export default function decorate(block) {
  const result = buildCards(myJsonObject);
  block.append(result);
  // return result;
}
