import { createElementFromHTML } from '../../scripts/utils.js';
import myJsonObject from '../../scripts/data.js';

const WishlistManager = (() => {
    const WISHLIST_KEY = 'wishlist';
    const HEART_ICON_SELECTOR = '.car-card-heart';
    const WISHLIST_COUNT_SELECTOR = "#nav > div.section.nav-tools > div > p > a";
    const EMPTY_HEART_ICON = '../../icons/heart.svg';
    const FULL_HEART_ICON = '../../icons/heart-filled.svg';

    const getWishlist = () => {
        const wishlistString = localStorage.getItem(WISHLIST_KEY);
        return wishlistString ? JSON.parse(wishlistString) : [];
    };

    const updateWishlistCount = () => {
        const wishlistElement = document.querySelector(WISHLIST_COUNT_SELECTOR);
        if (wishlistElement) {
            const wishlist = getWishlist();
            wishlistElement.textContent = `Wishlist (${wishlist.length})`;
            return true; // Successfully updated
        }
        return false; // Element not found
    };

    const getFilteredJsonObject = () => {
        const wishlist = getWishlist();
        return myJsonObject.filter(item => item && item.offerId && wishlist.includes(item.offerId));
    };

    const updateWishlist = offerId => {
        let wishlist = getWishlist();
        const index = wishlist.indexOf(offerId);

        if (index > -1) {
            wishlist.splice(index, 1);
        } else {
            wishlist.push(offerId);
        }

        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        updateWishlistCount();
        document.dispatchEvent(new Event('wishlistUpdated'));
        
        return wishlist;
    };

    const updateHeartIcon = (heartIcon, isInWishlist) => {
        heartIcon.alt = isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist';
        heartIcon.src = isInWishlist ? FULL_HEART_ICON : EMPTY_HEART_ICON;
    };

    const initializeHeartIcons = () => {
        const currentWishlist = getWishlist();
        document.querySelectorAll(HEART_ICON_SELECTOR).forEach(heartIcon => {
            const offerId = heartIcon.dataset.offerId;
            updateHeartIcon(heartIcon, currentWishlist.includes(offerId));
        });
    };

    const handleHeartClick = event => {
        const heartIcon = event.target.closest(HEART_ICON_SELECTOR);
        if (!heartIcon) return;
    
        event.preventDefault();
        const offerId = heartIcon.dataset.offerId;
        
        if (!offerId) return;
    
        // Trigger the animation
        heartIcon.classList.add('animate');
        
        setTimeout(() => {
            heartIcon.classList.remove('animate');
        }, 500);
    
        const updatedWishlist = updateWishlist(offerId);
        updateHeartIcon(heartIcon, updatedWishlist.includes(offerId));
    };

    const updateWishlistCountWithRetry = (attempts = 0, maxAttempts = 10) => {
        if (updateWishlistCount()) {
            return;
        }
        
        if (attempts < maxAttempts) {
            setTimeout(() => updateWishlistCountWithRetry(attempts + 1, maxAttempts), 500);
        } else {
            console.warn('Failed to update wishlist count after maximum attempts');
        }
    };

    const init = () => {
        document.addEventListener('click', handleHeartClick);
        initializeHeartIcons();
        updateWishlistCountWithRetry();
    };

    return { init, updateWishlistCount, getFilteredJsonObject, updateWishlistCountWithRetry };
})();

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
    // const checkboxContainer = cardObj?.isCheckbox ? getCheckboxContainer() : '';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'car-detail-container';
    [basicCarDetailContainer, featureContainer, priceContainer, buttonContainer].forEach((element) => {
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

function renderWishlistCards(filteredJson, container) {
    if (!container) {
        console.error('Wishlist container not found');
        return;
    }
    
    // Clear all existing content in the container
    container.innerHTML = '';

    if (filteredJson.length) {
        const wishlistWrapper = document.createElement('div');
        wishlistWrapper.className = 'wishlist-cards-wrapper';
        filteredJson.forEach((item, index) => {
            const cardElement = createElementFromHTML(buildCardTemplate(item));
            cardElement.style.animationDelay = `${index * 0.1}s`; // Stagger the animation
            wishlistWrapper.appendChild(cardElement);
        });
        container.appendChild(wishlistWrapper);
    } else {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Your wishlist is empty.';
        container.appendChild(emptyMessage);
    }
}

export default function decorate(block) {
    // we ned to distinguish between the two variants
    
    const wishlistContainer = document.createElement('div');
    wishlistContainer.id = 'wishlist-container';
    
    const title = document.createElement('h2');
    title.textContent = 'My Wishlist';
    block.appendChild(title);
    
    block.appendChild(wishlistContainer);

    WishlistManager.init();

    const renderWishlist = () => {
        const filteredJson = WishlistManager.getFilteredJsonObject();
        renderWishlistCards(filteredJson, wishlistContainer);
    };

    renderWishlist();

    document.addEventListener('wishlistUpdated', renderWishlist);

    const clearAllButton = document.createElement('button');
    clearAllButton.textContent = 'Clear All';
    clearAllButton.addEventListener('click', () => {
        localStorage.removeItem('wishlist');
        renderWishlist();
        WishlistManager.updateWishlistCount();
    });
    block.appendChild(clearAllButton);

    block.renderWishlistCards = renderWishlist;
    block.getFilteredJsonObject = WishlistManager.getFilteredJsonObject;
}

// Ensure this component doesn't interfere with the existing car card component
const originalDecorate = window.carCardDecorate || (() => {});
window.carCardDecorate = (block) => {
    originalDecorate(block);
    // Ensure car cards are rendered in a separate wrapper, need some more clearance on this one.
    const carCardsWrapper = block.querySelector('.car-cards-wrapper');
    if (carCardsWrapper) {
        carCardsWrapper.classList.add('original-car-cards-wrapper');
    }
};

WishlistManager.init();

WishlistManager.updateWishlistCountWithRetry();

// Make WishlistManager globally accessible
window.WishlistManager = WishlistManager;