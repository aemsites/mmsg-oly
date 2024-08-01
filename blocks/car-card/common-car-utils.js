import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { createElementFromHTML, WishlistManager } from '../../scripts/utils.js';

export function getPriceContainer(cardObj) {
  return `
    <div class="car-card-price-container">
      <p class="car-card-price-title">Weekly price from</p>
      <h2 class="car-card-price">${cardObj?.weeklyPriceInfo}</h2>
      <p class="car-card-info">Including all car running costs</p>
      <p class="car-card-price-weekly">Estimated tax savings ${cardObj.price}</p>
    </div>
  `;
}

export function getButtonContainer(cardObj) {
  return `
    <div class="car-card-button-container">
      <p class="button-container">
        <a href="${cardObj?.path || 'oly.com.au'}" title="View Offer Details" class="button">View Offer Details</a>
      </p>
    </div>
  `;
}

export function createBasicCarDetailContainer(cardObj, createOptimizedImg = true) {
  const defaultImg = '/content/dam/oly/images/tesla.jpeg';
  const imageLink = cardObj?.img || defaultImg;
  const isInWishlist = WishlistManager.getWishlist().includes(cardObj?.offerId);
  const heartIconSrc = isInWishlist ? '../../icons/heart-filled.svg' : '../../icons/heart.svg';

  let imgElement;
  if (createOptimizedImg) {
    const optimizedPic = createOptimizedPicture(imageLink, 'car offers image', false, [{ width: '750' }]);
    imgElement = optimizedPic.outerHTML;
  } else {
    imgElement = `<img class="car-card-image" src="${imageLink}" alt="car offers image">`;
  }

  return `
    <div class="container">
      <div class="heart-container">
        <h3>${cardObj?.year} ${cardObj?.modelName}</h3>
        <img data-offer-id="${cardObj?.offerId}" class="car-card-heart" src="${heartIconSrc}" alt="${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}">
      </div>
      <div class="car-image-container">
        <div class="car-badge-container">
          ${cardObj?.isOlyDeal ? `<p class="oly-deals">OLY DEALS</p>` : ''}
          ${cardObj?.isEV ? `<p class="ev-icon"> </p>` : ''}
        </div>
        ${imgElement}
      </div>
      ${cardObj?.type ? `<p class="car-card-type">${cardObj?.type}</p>` : ''}
      <p class="car-card-description">${cardObj?.carDescription || ''}</p>
    </div>
  `;
}

export function buildCardTemplate(cardObj, createOptimizedImg = true) {
  const basicCarDetailContainer = createBasicCarDetailContainer(cardObj, createOptimizedImg);
  const priceContainer = cardObj?.price ? getPriceContainer(cardObj) : '';
  const buttonContainer = cardObj?.isButtonExists ? getButtonContainer(cardObj) : '';

  const wrapper = document.createElement('div');
  wrapper.className = 'car-detail-container';
  [basicCarDetailContainer, priceContainer, buttonContainer].forEach((element) => {
    wrapper.appendChild(createElementFromHTML(element));
  });

  if (createOptimizedImg) {
    wrapper.querySelectorAll('img').forEach((img) => {
      moveInstrumentation(img, img);
    });
  }

  return wrapper.outerHTML;
}

export function handleHeartClick(event) {
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
