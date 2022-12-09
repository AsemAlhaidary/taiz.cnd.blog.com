let filterContainer = document.getElementsByClassName('filterContainer')[0];
let inputField = filterContainer.getElementsByClassName('input')[0];

filterContainer.style.display = 'block';

// Add an event listener to detect the input to the field
inputField.addEventListener('input', handleFilter);

/**
 * @function handleFilter
 * @desc Manage and handle the filter process
 * @param {Event} e
 */
function handleFilter(e) {
  // Init the necessary elements to work with
  let masterElements = getMasterElements();
  let masterContainer = masterElements.masterContainer;
  let itemsContainer = masterElements.itemsContainer;

  // // Get the "noMatch" section
  // let noMatch = masterContainer.getElementsByClassName('noMatch')[0];

  // Get the value from input field, and the items to filter
  let value = e.target.value.trim();
  let items = itemsContainer.children;

  // Prepare a counter to count the visible elements
  let showedElements = items.length;

  // If the input field is empty, show all the elements
  if (value == '') showItems(items);

  // Check all the elements from the input value
  for (let i = 0; i < items.length; i++) {
    let item = items[i];

    // Hide the element if no match found for the value in it
    if (checkItemsForValue(items[i], value) == false) {
      item.classList.add('hide');

      // Decrease the number of the visible elements by 1
      showedElements--;
    } else {
      // Show the element if there is a match found for the value in it
      item.classList.remove('hide');

      // Increase the number of the visible elements by 1
      showedElements++;
    }
  }

  // // Show the "noMatch" container if there are no elements visible
  // noMatch.classList.toggle('show', showedElements == 0);
}

/**
 * @function showItems
 * @desc Remove the class "hide" from all the elements
 * @param {HTMLCollection} items - The elements to remove the class from
 */
function showItems(items) {
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove('hide');
  }
}

/**
 * @function checkItemsForValue
 * @desc Check if the value from the input field is in the given
 * item then returns a boolean value
 * @param {Element} container - The element to check the value in
 * @param {String} value - The text to check for in the element
 * @return {*} 
 */
function checkItemsForValue(container, value) {
  // Return false if there are no children to search in
  if (container.children.length === 0) {
    return false;
  }

  // Check all the children for the value
  for (let i = 0; i < container.children.length; i++) {
    let item = container.children[i];

    // Find the text if there is a text in the current element
    if (item.childNodes.length > item.children.length) {
      let text = findText(item);

      // If the text is not empty and the value is in the text,
      // then return true
      if (text != '' && searchForValue(text, value)) {
        return true;
      }
    }

    // Check the value in the next level of children
    return checkItemsForValue(item, value);
  }
}

/**
 * @function findText
 * @desc Recognize and extract the text inside the element
 * @param {Element} node - A node element with text inside
 * @return {String} - Returns a String of the extracted text
 */
function findText(node) {
  // Loop through the (childNOdes) to find the text (node)
  for (let i = 0; i < node.childNodes.length; i++) {
    let child = node.childNodes[i];

    // Texts inside the DOM have a "#text" as their node names
    if (child.nodeName == '#text') {
      // Access the data inside the text node
      let text = child.data;
      text = text.trim();

      return text;
    }
  }
}

/**
 * @function searchForValue
 * @desc Search from the given value inside the given text
 * @param {String} text - The text to search inside
 * @param {String} value - The value to search for
 * @return {Boolean} - The result of the search
 */
function searchForValue(text, value) {
  // Generate a regular expression from the value to make
  // it easier to search
  let valueRegExp = new RegExp(value, 'i');

  // Search for the value RegExp inside the text
  let found = text.search(valueRegExp);

  // If found == -1 then noMatch found, and return false
  if (found == -1) return false;

  // Otherwise return true
  return true;
}