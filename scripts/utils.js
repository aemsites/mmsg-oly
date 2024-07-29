export const CONFIG = {
  countryCode: 'au',
  language: 'en',
  site: 'oly',
  baseURL: window.location.origin || 'https://oly.com.au/',
  youTubeLinkCheck: 'https://youtu',
  videoModalPath: '/modals/video',
};

const ISEV = ['yes', 'no'];

/**
 * Add classes to elements.
 * @param {String} tag Element tag
 * @param {Array} classes classlist
 */
export function addClassToElement(element, ...classes) {
  classes.forEach((className) => {
    if (className) {
      element.classList.add(className);
    }
  });
}

/**
 * create element with class.
 * @param {String} tag Element tag
 * @param {Array} classes classlist
 */
export function createElementWithClasses(tag, ...classes) {
  const element = document.createElement(tag);
  addClassToElement(element, ...classes);
  return element;
}

/**
 * Creates an element from an HTML string.
 * @param {string} htmlString - The HTML string to create the element from.
 * @return {Element} The created element.
 */
export function createElementFromHTML(htmlString) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString.trim();
  return tempDiv.firstChild;
}

/**
 * Wishlist Manager
 */
export const WishlistManager = (() => {
  const WISHLIST_KEY = 'wishlist';
  const WISHLIST_COUNT_SELECTOR = '#nav > div.section.nav-tools > div > ul > li:nth-child(1) > a';
  const EMPTY_HEART_ICON = 'icons/heart.svg';
  const FULL_HEART_ICON = 'icons/heart-filled.svg';

  const getWishlist = () => {
    const wishlistString = localStorage.getItem(WISHLIST_KEY);
    return wishlistString ? JSON.parse(wishlistString) : [];
  };

  const updateWishlistCount = () => {
    const wishlistElement = document.querySelector(WISHLIST_COUNT_SELECTOR);
    if (wishlistElement) {
      const wishlist = getWishlist();
      wishlistElement.textContent = `Wishlist (${wishlist.length})`;
      return true;
    }
    return false;
  };

  const updateWishlist = (offerId) => {
    const wishlist = getWishlist();
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

  const updateWishlistCountWithRetry = (attempts = 0, maxAttempts = 10) => {
    if (updateWishlistCount()) {
      return;
    }

    if (attempts < maxAttempts) {
      setTimeout(() => updateWishlistCountWithRetry(attempts + 1, maxAttempts), 500);
    }
  };

  return {
    getWishlist,
    updateWishlist,
    updateHeartIcon,
    updateWishlistCount,
    updateWishlistCountWithRetry,
  };
})();

/**
 * Manage Recently viewed cars, set and get from local storage
 */
export const RecentlyViewedManager = (() => {
  const RECENTLY_VIEWED_KEY = 'recentlyViewed';
  const MAX_RECENTLY_VIEWED = 3;

  const getRecentlyViewed = () => {
    const recentlyViewedString = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return recentlyViewedString ? JSON.parse(recentlyViewedString) : [];
  };

  const setRecentlyViewed = (offerId) => {
    const recentlyViewed = getRecentlyViewed();
    const index = recentlyViewed.indexOf(offerId);

    if (index > -1) {
      recentlyViewed.splice(index, 1);
    }

    recentlyViewed.unshift(offerId);

    if (recentlyViewed.length > MAX_RECENTLY_VIEWED) {
      recentlyViewed.pop();
    }

    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
  };

  return {
    getRecentlyViewed,
    setRecentlyViewed,
  };
})();

/**
 * Creates an EV icon by adding a CSS class to the parent element and removing the
 * element containing the icon.
 *
 * @param {Element} el - The element containing the EV icon.
 * @param {Element} parentEl - The parent element to add the CSS class to.
 * @return {void} This function does not return anything.
 */
export function createEVIcon(el, parentEl) {
  const isEV = el.textContent.trim();
  if (ISEV.includes(isEV)) {
    if (isEV === 'yes') {
      parentEl.classList.add('ev-icon');
    } else {
      parentEl.classList.add('non-showing-ev-icon');
    }
    el.remove();
  }
}
