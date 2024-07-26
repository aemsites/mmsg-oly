import { createElementFromHTML, WishlistManager, RecentlyViewedManager } from '../../scripts/utils.js';
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
        </div>
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

function buildCardTemplate(cardObj) {
  const defaultImg = '/content/dam/oly/images/tesla.jpeg';
  const imageLink = cardObj?.img || defaultImg;

  const basicCarDetailContainer = `
        <div class="container">
          <div class="heart-container">
            <h3>${cardObj?.year} ${cardObj?.modelName}</h3>
            <img data-offer-id="${cardObj?.offerId}" class="car-card-heart" src="../../icons/heart-filled.svg" alt="Remove from Wishlist">
          </div>
          <img class="car-card-image" src="${imageLink}" alt="car offers image">
           ${cardObj?.type ? `<p class="car-card-type">${cardObj?.type}</p>` : ''}
          <p class="car-card-description">${cardObj?.carDescription || ''}</p>
        </div>
    `;
  const featureContainer = cardObj?.isFeatures ? getFeaturesContainer() : '';
  const priceContainer = cardObj?.price ? getPriceContainer(cardObj) : '';
  const buttonContainer = cardObj?.isButtonExists ? getButtonContainer() : '';

  const wrapper = document.createElement('div');
  wrapper.className = 'car-detail-container';
  [basicCarDetailContainer, featureContainer, priceContainer, buttonContainer].forEach((element) => {
    wrapper.appendChild(createElementFromHTML(element));
  });
  return wrapper.outerHTML;
}

function buildRecentCardTemplate(cardObj) {
  const isInWishlist = (offerId) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.includes(offerId);
  };

  const heartIconSrc = isInWishlist(cardObj.offerId) ? '../../icons/heart-filled.svg' : '../../icons/heart.svg';

  const defaultImg = '/content/dam/oly/images/tesla.jpeg';
  const imageLink = cardObj?.img || defaultImg;

  const basicCarDetailContainer = `
        <div class="container">
          <div class="heart-container">
            <h3>${cardObj?.year} ${cardObj?.modelName}</h3>
            <img data-offer-id="${cardObj?.offerId}" class="car-card-heart" src="${heartIconSrc}" alt="${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}">
          </div>
          <img class="car-card-image" src="${imageLink}" alt="car offers image">
           ${cardObj?.type ? `<p class="car-card-type">${cardObj?.type}</p>` : ''}
          <p class="car-card-description">${cardObj?.carDescription || ''}</p>
        </div>
    `;
  // const featureContainer = cardObj?.isFeatures ? getFeaturesContainer() : '';
  const priceContainer = cardObj?.price ? getPriceContainer(cardObj) : '';
  const buttonContainer = cardObj?.isButtonExists ? getButtonContainer(cardObj) : '';

  const wrapper = document.createElement('div');
  wrapper.className = 'car-detail-container';
  [basicCarDetailContainer, priceContainer, buttonContainer].forEach((element) => {
    wrapper.appendChild(createElementFromHTML(element));
  });
  return wrapper.outerHTML;
}

function getFilteredJsonObject() {
  const wishlist = WishlistManager.getWishlist();
  return myJsonObject.filter((item) => item && item.offerId && wishlist.includes(item.offerId));
}

function renderWishlistCards(filteredJson, container) {
  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (filteredJson.length) {
    const wishlistWrapper = document.createElement('div');
    wishlistWrapper.className = 'wishlist-cards-wrapper';
    filteredJson.forEach((item, index) => {
      const cardElement = createElementFromHTML(buildCardTemplate(item));
      cardElement.style.animationDelay = `${index * 0.1}s`;
      wishlistWrapper.appendChild(cardElement);
    });
    container.appendChild(wishlistWrapper);
  } else {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'Your wishlist is empty';
    container.appendChild(emptyMessage);
  }
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

  WishlistManager.updateWishlist(offerId);
  WishlistManager.updateHeartIcon(heartIcon, WishlistManager.getWishlist().includes(offerId));
}

// recently viewed
function getFilteredRecentlyViewedJsonObject() {
  const recentlyViewed = RecentlyViewedManager.getRecentlyViewed();
  return myJsonObject.filter((item) => item && item.offerId && recentlyViewed.includes(item.offerId));
}

function renderRecentlyViewedCards(filteredJson, container) {
  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (filteredJson.length) {
    const recentlyViewedWrapper = document.createElement('div');
    recentlyViewedWrapper.className = 'recently-viewed-cards-wrapper';
    filteredJson.forEach((item) => {
      const cardElement = createElementFromHTML(buildRecentCardTemplate(item));
      recentlyViewedWrapper.appendChild(cardElement);
    });
    container.appendChild(recentlyViewedWrapper);
  } else {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'You have not viewed any vehicles yet';
    container.appendChild(emptyMessage);
  }
}

// set ["offer_1","offer_4","offer_3"] to recently viewed wishlist as mock data

RecentlyViewedManager.setRecentlyViewed('offer_1');
RecentlyViewedManager.setRecentlyViewed('offer_3');
RecentlyViewedManager.setRecentlyViewed('offer_4');

export default function decorate(block) {
  const variant = block.querySelector('div:nth-child(1)').textContent.trim();
  if (variant === 'full') {
    block.innerHTML = '';
    const wishlistContainer = document.createElement('div');
    wishlistContainer.id = 'wishlist-container';

    const title = document.createElement('h2');
    const filtered = getFilteredJsonObject();
    title.textContent =
      filtered.length > 0
        ? `You have saved the following ${filtered.length > 1 ? `${filtered.length} vehicles` : 'vehicle'}`
        : 'You have not saved any vehicles yet';
    block.appendChild(title);

    block.appendChild(wishlistContainer);

    const renderWishlist = () => {
      const filteredJson = getFilteredJsonObject();
      renderWishlistCards(filteredJson, wishlistContainer);
    };

    renderWishlist();

    document.addEventListener('wishlistUpdated', renderWishlist);

    wishlistContainer.addEventListener('click', handleHeartClick);

    // const clearAllButton = document.createElement('button');
    // clearAllButton.textContent = 'Clear All';
    // clearAllButton.addEventListener('click', () => {
    //     localStorage.removeItem('wishlist');
    //     renderWishlist();
    //     WishlistManager.updateWishlistCount();
    // });
    // block.appendChild(clearAllButton);

    block.renderWishlistCards = renderWishlist;
    block.getFilteredJsonObject = getFilteredJsonObject;

    // Initialize wishlist functionality
    WishlistManager.updateWishlistCountWithRetry();
  } else if (variant === 'recent') {
    block.innerHTML = '';
    const recentlyViewedContainer = document.createElement('div');
    recentlyViewedContainer.id = 'recently-viewed-container';

    const title = document.createElement('h2');
    const filtered = getFilteredRecentlyViewedJsonObject();
    title.textContent =
      filtered.length > 0
        ? `You have viewed the following ${filtered.length > 1 ? `${filtered.length} vehicles` : 'vehicle'}`
        : 'You have not viewed any vehicles yet';
    // block.appendChild(title);

    block.appendChild(recentlyViewedContainer);

    const renderRecentlyViewed = () => {
      const filteredJson = getFilteredRecentlyViewedJsonObject().slice(0, 3);
      renderRecentlyViewedCards(filteredJson, recentlyViewedContainer);
    };

    renderRecentlyViewed();

    document.addEventListener('recentlyViewedUpdated', renderRecentlyViewed);

    recentlyViewedContainer.addEventListener('click', handleHeartClick);

    block.renderRecentlyViewedCards = renderRecentlyViewed;
    block.getFilteredRecentlyViewedJsonObject = getFilteredRecentlyViewedJsonObject;

    RecentlyViewedManager.updateRecentlyViewedCountWithRetry();
  }
}

// Ensure this component doesn't interfere with the existing car card component
const originalDecorate = window.carCardDecorate || (() => {});
window.carCardDecorate = (block) => {
  originalDecorate(block);
  const carCardsWrapper = block.querySelector('.car-cards-wrapper');
  if (carCardsWrapper) {
    carCardsWrapper.classList.add('original-car-cards-wrapper');
  }
};
