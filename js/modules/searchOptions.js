// If JS is disabled 'options' div wont appear
document.getElementsByClassName('options')[0].style.display = 'block';

// cookieProcess();

// Convert the 'HTMLCollection' into 'Array' to be able to use
// 'Array Methods' on it.
let optionIcons = Array.from(document.getElementsByClassName('optionIcon'));

const dateCheckbox = document.getElementById('date');
const optionsBox = document.getElementsByClassName('optionsBox')[0];

// Show chat-bubble on long press
optionIcons.map(optionIcon => {
  // The file which contains this function is under 'modules' directory
  chatBubble(optionsBox, optionIcon, () => {
    return optionIcon.nextElementSibling;
  });
});

/**
 * @function cookieProcess
 * @desc Handling the process of restoring the values from cookies
 * @return {void}
 */
function cookieProcess() {
  // If storage is enabled, then do cookie process
	if (isStorageEnabled()) {
    let searchOptions;

		if (getCookie().hasOwnProperty('searchOptions')) {
      console.log('Found search options of', getCookie().searchOptions);
			searchOptions = getCookie().searchOptions;
      searchOptions = JSON.parse(searchOptions);
      setSearchOptions(searchOptions);
		}
	}
}

/**
 * @function setSearchOptions
 * @desc Apply the values which have been restored in the cookies to
 * 'optionsInputs' elements in the DOM
 * @param {Object} searchOptions - name of the key
 * @return {void} 
 */
function setSearchOptions(searchOptions) {
  let optionsInputs = Array.from(document.getElementsByClassName('input'));

  // Initialize all 'optionsInputs' to 'false'
  optionsInputs.map(optionInput => {
    optionInput.checked = false;
  });

  // Restore the values in the cookies to 'optionsInputs'
  optionsInputs.map(optionInput => {
    if (searchOptions.includes(optionInput.value)) {
      optionInput.checked = true;
    }
  });
}

// If 'dateCheckbox' checked then scroll 'optionsBox' in x-axis by
// 'optionsBox.scrollWidth', if not checked then go back to zero.
dateCheckbox.addEventListener('change', (e) => {
  if (e.target.checked) {
    optionsBox.scrollBy(optionsBox.scrollWidth, 0);
  } else {
    optionsBox.scrollBy(0, 0);
  }
})