import { createElementFromHTML, WishlistManager } from '../../scripts/utils.js';
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

function getFilteredJsonObject() {
    const wishlist = WishlistManager.getWishlist();
    return myJsonObject.filter(item => item && item.offerId && wishlist.includes(item.offerId));
}

function renderWishlistCards(filteredJson, container) {
    if (!container) {
        console.error('Wishlist container not found');
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
        emptyMessage.textContent = 'Your wishlist is empty.';
        container.appendChild(emptyMessage);
    }
}

function handleHeartClick(event) {
    const heartIcon = event.target.closest('.car-card-heart');
    if (!heartIcon) return;

    event.preventDefault();
    const offerId = heartIcon.dataset.offerId;
    
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

export default function decorate(block) {
    const variant = block.querySelector('div:nth-child(1)').textContent.trim();
    if (variant === 'full') {
        block.innerHTML = '';
        const wishlistContainer = document.createElement('div');
        wishlistContainer.id = 'wishlist-container';
        
        const title = document.createElement('h2');
        title.textContent = 'My Wishlist';
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
    } else if (variant === 'small') {
        // small stuff here...
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