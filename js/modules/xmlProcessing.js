/**
 * @function getElementsFrom
 * @desc Get the subElements which inside the parent elements
 * @param {Node} parent - The parent element
 * @param {String} children - Name of the subElement that need to select
 * @param {Boolean} arr - Decide if need the output as 'HTMLCollection'
 * or 'Array'
 * @return {HTMLCollection / Array} elements
 */
function getElementsFrom(parent, children, arr) {
  let elements = [];

  // If the parent is not empty or if it has a child select it
  if (parent != undefined && parent.hasChildNodes()) {
    elements = parent.querySelectorAll(children);
  }

  // If 'arr' is 'true', convert 'HTMLCollection' to 'Array'
  if (arr) {
    elements = Array.from(elements);
  }

  return elements;
}

/**
 * @function getDataFrom
 * @desc Get a specific data from the node
 * @param {Node} node - A node to get data from
 * @param {String} dataName - The specific type of data to extract
 * @return {String} - Data text
 */
function getDataFrom(node, dataName) {
  let dataElem = getElementsFrom(node, dataName, false)[0];

  if (dataElem == undefined) return;

  return dataElem.textContent;
}