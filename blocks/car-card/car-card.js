import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { createElementFromHTML, WishlistManager } from '../../scripts/utils.js';
import myJsonObject from '../../scripts/data.js';

function getPriceContainer(cardObj) {
  return `
      <div class="car-card-price-container">
        <p class="car-card-price-title">Weekly price from</p>
        <h1 class="car-card-price">${cardObj?.weeklyPriceInfo}</h1>
        <p class="car-card-info">Including all car running costs</p>
        <p class="car-card-price-weekly">Estimated tax savings ${cardObj.price}</p>
      </div>
    `;
}

function getButtonContainer(cardObj) {
  return `
    <div class="car-card-button-container">
      <p class="button-container">
        <a href="${cardObj?.path}" title="View Offer Details" class="button">View Offer Details</a>
      </p>
    </div>
    `;
}

function buildCardTemplate(cardObj) {
  const defaultImg = '/content/dam/oly/images/tesla.jpeg';
  const imageLink = cardObj?.img || defaultImg;
  const pathParts = imageLink.split('/');
  const encodedFileName = encodeURIComponent(pathParts.pop());
  const encodedImagePath = [...pathParts, encodedFileName].join('/');
  const isInWishlist = WishlistManager.getWishlist().includes(cardObj?.offerId);

  const basicCarDetailContainer = `
      <div class="container">
        <div class="heart-container">
          <h3>${cardObj?.year} ${cardObj?.modelName}</h3>
          <img data-offer-id="${cardObj?.offerId}" class="car-card-heart" src="${isInWishlist ? '../../icons/heart-filled.svg' : '../../icons/heart.svg'}" alt="${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}">
        </div>
        <div class="car-image-container">
          <div class="car-badge-container">
            ${cardObj?.isOlyDeal ? `<p class="oly-deals">OLY DEALS</p>` : ''}
            ${cardObj?.isEV ? `<p class="ev-icon"> </p>` : ''}
          </div>
          <img class="car-card-image" src="${encodedImagePath}" alt="car offers image">
        </div>
        <p class="car-card-description">${cardObj?.carDescription || ''}</p>
      </div>
      `;
  const priceContainer = cardObj?.price ? getPriceContainer(cardObj) : '';
  const buttonContainer = cardObj?.isButtonExists ? getButtonContainer(cardObj) : '';
  const wrapper = document.createElement('div');
  wrapper.className = 'car-detail-container';
  const elementArray = [basicCarDetailContainer, priceContainer, buttonContainer];
  elementArray.forEach((element) => {
    wrapper.appendChild(createElementFromHTML(element));
  });
  wrapper.querySelectorAll('.car-card-image').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.replaceWith(optimizedPic);
  });
  return wrapper.outerHTML;
}

function buildCards(carData) {
  const wrapper = document.createElement('div');
  wrapper.className = 'car-cards-wrapper';
  wrapper.innerHTML = carData.map(buildCardTemplate).join('');
  return wrapper;
}

function initializeHeartIcons() {
  const currentWishlist = WishlistManager.getWishlist();
  document.querySelectorAll('.car-card-heart').forEach((heartIcon) => {
    const { offerId } = heartIcon.dataset;
    WishlistManager.updateHeartIcon(heartIcon, currentWishlist.includes(offerId));
  });
}

function handleHeartClick(event) {
  const heartIcon = event.target.closest('.car-card-heart');
  if (!heartIcon) return;

  event.preventDefault();
  const { offerId } = heartIcon.dataset;

  if (!offerId) return;

  if (!WishlistManager.getWishlist().includes(offerId)) {
    heartIcon.classList.add('animate');
    setTimeout(() => {
      heartIcon.classList.remove('animate');
    }, 500);
  }

  const updatedWishlist = WishlistManager.updateWishlist(offerId);
  WishlistManager.updateHeartIcon(heartIcon, updatedWishlist.includes(offerId));
}

export default function decorate(block) {
  // const myJsonObject = []; // this will be replaced by the actual data received
  if (!myJsonObject.length) return;
  const result = buildCards(myJsonObject);
  block.append(result);

  // Initialize wishlist functionality
  initializeHeartIcons();
  block.addEventListener('click', handleHeartClick);
  WishlistManager.updateWishlistCountWithRetry();
}
