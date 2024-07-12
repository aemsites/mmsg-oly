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
