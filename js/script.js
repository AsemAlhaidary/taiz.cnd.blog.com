/**
 * @function onTopNavbar
 * @desc Toggles "onTop" class to "NavBar" section in all pages in 
 * the Website.
 * `onTop` class changes the navBar to display a shadow when user
 * scrolls down.
 * @param {}
 * @return {void}
 */
function onTopNavbar() {
	let navBar = document.querySelector('.header');
	navBar.classList.toggle('onTop', window.scrollY == 0);
}

/**
 * @function isClassMatchUrl
 * @desc Checks if the URL of the clicked button is referring to 
 * the current page
 * @param {String} className - The class name of the clicked button
 * @param {String} url - The URL of the current page
 * @return {Boolean}
 */
function isClassMatchUrl(className, url) {
	// Editing some of the class names to simplify the operation
	switch (className) {
		case 'home':
			className = '/';
			break;

		case 'archives':
			className = 'archive';
			break;
	}

	// Do the checking in different ways based on the class name
	if (className == '/') {
		return className == url;
	} else {
		return url.includes(className);
	}
}

/**
 * @function navToTopButtons
 * @desc Scroll to the top of the page after a 'navButton' is clicked
 * if 'scrollY' is greater than viewport height, otherwise, it reloads
 * the page
 * @params {}
 * @return {void}
 */
function navToTopButtons() {
	// Array from 'navButton' elements
	let navButtons = [...document.getElementsByClassName('navButton')];

	navButtons.forEach(navButton => {
		navButton.addEventListener('click', (e) => {

			// If 'scrollY' is greater than viewport height
			if (window.scrollY > window.innerHeight) {
				// Get the second class name from the element's class list
				let navButtonClass = navButton.classList[1];
				// Get the current path name from the URL of the page
				let windowUrl = window.location.pathname;

				// If the link will guide to the same opening page
				if (isClassMatchUrl(navButtonClass, windowUrl)) {
					// Prevent the link from reloading the page
					e.preventDefault();

					// Then scroll up to the beginning of the page
					document.body.scrollTop = 0;
					document.documentElement.scrollTop = 0;
				}
			}
		});
	});
}

/**
 * @function scrollTopHint
 * @desc Toggles "enableScroll" class to the highlighted
 * nav item to display toTop section on the nav icon
 */
function scrollTopHint() {
	let navItem = document.querySelector('.navButton.highlight');

	if (navItem == null) return;

	// Select scroll up hint graphic
	let scrollUp = navItem.querySelector('.scrollUp');

	if (window.scrollY > window.innerHeight) {
		// Show scroll up hint graphic, if this condition is true
		scrollUp.style.opacity = '1';
		scrollUp.style.transform = 'scale(1)';
	} else {
		// Hide scroll up hint graphic, if this condition is false
		scrollUp.style.opacity = '0';
		scrollUp.style.transform = 'scale(3)';
	}
}

window.onscroll = () => {
	onTopNavbar();
	scrollTopHint();
}

onTopNavbar()
navToTopButtons();
scrollTopHint();