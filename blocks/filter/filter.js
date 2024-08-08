import { filterCars } from '../car-card/common-car-utils.js';

export default function decorate(block) {
  block.innerHTML = `
    <div class="filter-block">
      <div class="filter-header">
        <h2>Current offers</h2>
        <div class="filter-controls">
          <div class="sort-by">
            <label class="filter-label" for="sort">Sort by...</label>
            <select id="sort" class="filter-select">
              <option value="">Please select</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
          <button class="toggle-filters button secondary" aria-expanded="false" aria-controls="filter-container-block">
            <span class="toggle-filters-text">Show filters</span>
            <img class="toggle-filters-icon" height="24" width="24" src="../../icons/filter.svg" alt="filter icon">
          </button>
        </div>
      </div>
      
      <div class="applied-filters" aria-live="polite"></div>
      
      <div id="filter-container-block" class="filter-container-block hidden">
        <h3 class="filter-h3">Filters</h3>
        <div class="filter-row filter-row-twocol">
          <div class="filter-column">
            <label class="filter-label" for="car-brand">Car Brand</label>
            <select id="car-brand" class="filter-select filter-select-bigly">
              <option value="">Select car brand</option>
              <option value="bmw">BMW</option>
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="ford">Ford</option>
            </select>
          </div>
          <div class="filter-column">
            <label class="filter-label" for="body-type">Body type</label>
            <select id="body-type" class="filter-select filter-select-bigly">
              <option value="">Select body type</option>
              <option value="petrol">Petrol</option>
              <option value="ev">EV</option>
              <option value="hatchback">Hatchback</option>
            </select>
          </div>
        </div>
        <div class="filter-row">
          <label class="filter-label" for="filter-pricerange">Price range</label>
          <div class="filter-pricerange-container">
            <div class="range-slider">
              <input type="range" id="filter-pricerange-min" min="30000" max="250000" step="1000" value="30000" aria-labelledby="min-price-label">
              <input type="range" id="filter-pricerange-max" min="30000" max="250000" step="1000" value="220000" aria-labelledby="max-price-label">
            </div>
            <div class="filter-priceinputs">
              <div class="filter-pricefield">
                <label class="filter-label" id="min-price-label" for="min-price">Minimum</label>
                <input type="number" class="filter-pricenumber" id="min-price" value="40000" min="30000" max="250000">
              </div>
              <div class="filter-pricefield">
                <label class="filter-label" id="max-price-label" for="max-price">Maximum</label>
                <input type="number" class="filter-pricenumber" id="max-price" value="220000" min="30000" max="250000">
              </div>
            </div>
          </div>
        </div>
        <button class="button filter-apply">Apply filters</button>
      </div>
    </div>
  `;

  const toggleFilters = block.querySelector('.toggle-filters');
  const filtersContainer = block.querySelector('.filter-container-block');
  const appliedFiltersContainer = block.querySelector('.applied-filters');
  const priceRangeMin = block.querySelector('#filter-pricerange-min');
  const priceRangeMax = block.querySelector('#filter-pricerange-max');
  const minPrice = block.querySelector('#min-price');
  const maxPrice = block.querySelector('#max-price');
  const applyFiltersButton = block.querySelector('.filter-apply');
  const sortSelect = block.querySelector('#sort');

  let currentFilters = {
    brand: '',
    bodyType: '',
    minPrice: 30000,
    maxPrice: 220000,
  };

  function updateSlider() {
    const min = parseInt(priceRangeMin.value, 10);
    const max = parseInt(priceRangeMax.value, 10);

    if (min > max) {
      priceRangeMax.value = min;
      maxPrice.value = min;
    } else {
      minPrice.value = min;
      maxPrice.value = max;
    }

    const percent1 = ((min - 30000) / (250000 - 30000)) * 100;
    const percent2 = ((max - 30000) / (250000 - 30000)) * 100;
    priceRangeMin.style.background = `linear-gradient(to right, #ddd ${percent1}%, #ff1261 ${percent1}%, #ff1261 ${percent2}%, #ddd ${percent2}%)`;
    priceRangeMax.style.background = `linear-gradient(to right, #ddd ${percent1}%, #ff1261 ${percent1}%, #ff1261 ${percent2}%, #ddd ${percent2}%)`;
  }

  function createFilterTag(filterName, filterValue) {
    const tag = document.createElement('span');
    tag.classList.add('filter-tag');
    tag.innerHTML = `${filterName}: ${filterValue} <button class="remove-filter" aria-label="Remove ${filterName} filter" data-filter="${filterName}">✕</button>`;
    return tag;
  }

  function updateFilterTags() {
    appliedFiltersContainer.innerHTML = '';
    if (currentFilters.brand) {
      appliedFiltersContainer.appendChild(createFilterTag('Car Brand', currentFilters.brand));
    }
    if (currentFilters.bodyType) {
      appliedFiltersContainer.appendChild(createFilterTag('Body Type', currentFilters.bodyType));
    }
    if (currentFilters.minPrice !== 30000 || currentFilters.maxPrice !== 220000) {
      appliedFiltersContainer.appendChild(
        createFilterTag('Price Range', `$${currentFilters.minPrice} - $${currentFilters.maxPrice}`),
      );
    }
  }

  function applyFiltersAndSort() {
    const sortValue = sortSelect.value;
    const filteredAndSortedCars = filterCars(window.carData, { ...currentFilters, sort: sortValue });
    const event = new CustomEvent('filtersApplied', { detail: filteredAndSortedCars });
    document.dispatchEvent(event);
  }

  function removeFilter(filterName) {
    switch (filterName) {
      case 'Car Brand':
        currentFilters.brand = '';
        block.querySelector('#car-brand').value = '';
        break;
      case 'Body Type':
        currentFilters.bodyType = '';
        block.querySelector('#body-type').value = '';
        break;
      case 'Price Range':
        currentFilters.minPrice = 30000;
        currentFilters.maxPrice = 220000;
        minPrice.value = '30000';
        maxPrice.value = '220000';
        priceRangeMin.value = '30000';
        priceRangeMax.value = '220000';
        updateSlider();
        break;
      default:
        console.warn(`Unhandled filter type: ${filterName}`);
        break;
    }
    updateFilterTags();
    applyFiltersAndSort();
  }

  function applyFilters() {
    currentFilters = {
      brand: block.querySelector('#car-brand').value,
      bodyType: block.querySelector('#body-type').value,
      minPrice: parseInt(minPrice.value, 10),
      maxPrice: parseInt(maxPrice.value, 10),
    };
    updateFilterTags();
    applyFiltersAndSort();
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedApplyFilters = debounce(applyFilters, 300);

  // Event Listeners
  toggleFilters.addEventListener('click', () => {
    const isHidden = filtersContainer.classList.contains('hidden');
    filtersContainer.classList.toggle('hidden', !isHidden);
    filtersContainer.classList.toggle('show', isHidden);
    toggleFilters.querySelector('.toggle-filters-text').textContent = isHidden ? 'Hide filters' : 'Show filters';
    toggleFilters.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
  });

  priceRangeMin.addEventListener('input', updateSlider);
  priceRangeMax.addEventListener('input', updateSlider);

  minPrice.addEventListener('input', () => {
    priceRangeMin.value = minPrice.value;
    updateSlider();
  });

  maxPrice.addEventListener('input', () => {
    priceRangeMax.value = maxPrice.value;
    updateSlider();
  });

  applyFiltersButton.addEventListener('click', applyFilters);

  sortSelect.addEventListener('change', applyFiltersAndSort);

  [minPrice, maxPrice, priceRangeMin, priceRangeMax].forEach((input) => {
    input.addEventListener('input', debouncedApplyFilters);
  });

  // UX Improvements
  block.querySelectorAll('select, input, button').forEach((element) => {
    element.addEventListener('focus', (e) => {
      e.target.classList.add('focused');
    });
    element.addEventListener('blur', (e) => {
      e.target.classList.remove('focused');
    });
  });

  // Handle filter removal
  appliedFiltersContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-filter')) {
      const filterName = e.target.getAttribute('data-filter');
      removeFilter(filterName);
    }
  });

  // Initialize
  updateSlider();
}
