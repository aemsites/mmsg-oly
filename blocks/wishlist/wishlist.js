import { buildCardTemplate, handleHeartClick } from '../car-card/common-car-utils.js';
import { WishlistManager, RecentlyViewedManager } from '../../scripts/utils.js';
import myJsonObject from '../../scripts/data.js';

function getFilteredJsonObject() {
  const wishlist = WishlistManager.getWishlist();
  return myJsonObject.filter((item) => item && item.offerId && wishlist.includes(item.offerId));
}

function renderWishlistCards(filteredJson, container) {
  if (!container) return;

  container.innerHTML = '';

  if (filteredJson.length) {
    const wishlistWrapper = document.createElement('div');
    wishlistWrapper.className = 'wishlist-cards-wrapper';
    filteredJson.forEach((item, index) => {
      const cardElement = buildCardTemplate(item, true);
      const cardDiv = document.createElement('div');
      cardDiv.innerHTML = cardElement;
      cardDiv.firstChild.style.animationDelay = `${index * 0.1}s`;
      wishlistWrapper.appendChild(cardDiv.firstChild);
    });
    container.appendChild(wishlistWrapper);
  } else {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'Your wishlist is empty';
    container.appendChild(emptyMessage);
  }
}

function getFilteredRecentlyViewedJsonObject() {
  const recentlyViewed = RecentlyViewedManager.getRecentlyViewed();
  return myJsonObject.filter((item) => item && item.offerId && recentlyViewed.includes(item.offerId));
}

function renderRecentlyViewedCards(filteredJson, container) {
  if (!container) return;

  container.innerHTML = '';

  if (filteredJson.length) {
    const recentlyViewedWrapper = document.createElement('div');
    recentlyViewedWrapper.className = 'recently-viewed-cards-wrapper';
    filteredJson.forEach((item) => {
      const cardElement = buildCardTemplate(item, true);
      recentlyViewedWrapper.innerHTML += cardElement;
    });
    container.appendChild(recentlyViewedWrapper);
  } else {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'You have not viewed any vehicles yet';
    container.appendChild(emptyMessage);
  }
}

// Mock data setup
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

    block.renderWishlistCards = renderWishlist;
    block.getFilteredJsonObject = getFilteredJsonObject;

    WishlistManager.updateWishlistCountWithRetry();
  } else if (variant === 'recent') {
    block.innerHTML = '';
    const recentlyViewedContainer = document.createElement('div');
    recentlyViewedContainer.id = 'recently-viewed-container';

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
