import { buildCardTemplate, handleHeartClick } from './common-car-utils.js';
import { WishlistManager } from '../../scripts/utils.js';
import myJsonObject from '../../scripts/data.js';

function buildCards(carData) {
  const wrapper = document.createElement('div');
  wrapper.className = 'car-cards-wrapper';
  wrapper.innerHTML = carData.map((cardObj) => buildCardTemplate(cardObj)).join('');
  return wrapper;
}

function initializeHeartIcons() {
  const currentWishlist = WishlistManager.getWishlist();
  document.querySelectorAll('.car-card-heart').forEach((heartIcon) => {
    const { offerId } = heartIcon.dataset;
    WishlistManager.updateHeartIcon(heartIcon, currentWishlist.includes(offerId));
  });
}

export default function decorate(block) {
  if (!myJsonObject.length) return;
  const result = buildCards(myJsonObject);
  block.append(result);

  initializeHeartIcons();
  block.addEventListener('click', handleHeartClick);
  WishlistManager.updateWishlistCountWithRetry();
}
