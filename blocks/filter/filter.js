export default function decorate(block) {
  block.innerHTML = `
      <div class="filter-block">
        <div class="filter-header">
          <h2>Current offers</h2>
          <div class="filter-controls">
            <div class="sort-by">
              <label for="sort">Sort by</label>
              <select id="sort">
                <option value="">Please select</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
            <button class="toggle-filters">Hide filters ▼</button>
          </div>
        </div>
        
        <div class="filters-container">
          <h3>Filters</h3>
          <div class="filter-row">
            <div class="filter-column">
              <label for="car-brand">Car Brand</label>
              <select id="car-brand">
                <option value="">Select car brand</option>
                <option value="toyota">Toyota</option>
                <option value="honda">Honda</option>
                <option value="ford">Ford</option>
                <option value="bmw">BMW</option>
              </select>
            </div>
            <div class="filter-column">
              <label for="body-type">Body type</label>
              <select id="body-type">
                <option value="">Select body type</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="truck">Truck</option>
              </select>
            </div>
          </div>
          <div class="filter-row">
            <label for="price-range">Price range</label>
            <div class="price-range-container">
              <div class="range-slider">
                <input type="range" id="price-range-min" min="30000" max="250000" step="1000" value="40000">
                <input type="range" id="price-range-max" min="30000" max="250000" step="1000" value="220000">
              </div>
              <div class="price-inputs">
                <div>
                  <label for="min-price">Minimum</label>
                  <input type="number" id="min-price" value="40000">
                </div>
                <div>
                  <label for="max-price">Maximum</label>
                  <input type="number" id="max-price" value="220000">
                </div>
              </div>
            </div>
          </div>
          <button class="apply-filters">Apply filters</button>
        </div>
      </div>
    `;

  const toggleFilters = block.querySelector('.toggle-filters');
  const filtersContainer = block.querySelector('.filters-container');

  toggleFilters.addEventListener('click', () => {
    filtersContainer.style.display = filtersContainer.style.display === 'none' ? 'block' : 'none';
    toggleFilters.textContent = filtersContainer.style.display === 'none' ? 'Show filters ▼' : 'Hide filters ▲';
  });

  const priceRangeMin = block.querySelector('#price-range-min');
  const priceRangeMax = block.querySelector('#price-range-max');
  const minPrice = block.querySelector('#min-price');
  const maxPrice = block.querySelector('#max-price');

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

    // Update the slider track color
    const percent1 = ((min - 30000) / (250000 - 30000)) * 100;
    const percent2 = ((max - 30000) / (250000 - 30000)) * 100;
    priceRangeMin.style.background = `linear-gradient(to right, #ddd ${percent1}%, #ff1261 ${percent1}%, #ff1261 ${percent2}%, #ddd ${percent2}%)`;
    priceRangeMax.style.background = `linear-gradient(to right, #ddd ${percent1}%, #ff1261 ${percent1}%, #ff1261 ${percent2}%, #ddd ${percent2}%)`;
  }

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

  const applyFilters = block.querySelector('.apply-filters');
  applyFilters.addEventListener('click', () => {
    console.log('Filters applied');
    console.log('Price range:', minPrice.value, '-', maxPrice.value);
  });

  // Initialize the slider
  updateSlider();
}
