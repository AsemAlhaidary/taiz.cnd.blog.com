let imgOptions = {
	threshold: 0,
	rootMargin: "0px 0px 300px 0px"
};

let imgObserver = new IntersectionObserver((entries, imgObserver) => {
	entries.forEach(entry => {
		if (entry.isIntersecting === false) return;

		preloadImage(entry.target);
		imgObserver.unobserve(entry.target);
	})
}, imgOptions);

/**
 * @function preloadImage
 * @desc Loads image within an existing `<img>` or any tag.
 * @param {object} element - <IMG> object or any tag within the DOM.
 * @return {void}
 */
function preloadImage(element) {
  let src = element.getAttribute('data-src');

  if (element.classList.contains('lazyload')) {
		element.classList.remove('lazyload');
  }

	// console.log('src: ' + src + ', element: ' + element + ', elementTag: ' + element.tagName.toLowerCase());
  if (src) {
    (element.tagName.toLowerCase() == 'img') ? element.src = src : element.style.backgroundImage = 'url("' + src + '")' ;
  }
}

/**
 * @function lazyLoadImages
 * @desc Detects if image is within view. Then calls `preloadImage()` when image element is visible.
 * @param {}
 * @return {void}
 */
function lazyLoadImages() {
	let bgImages = document.querySelectorAll('.lazyload');
	let images = document.querySelectorAll('[data-src]');

	bgImages.forEach(bgImage => {
		imgObserver.observe(bgImage);
	});

	images.forEach(image => {
		imgObserver.observe(image);
	});
}

lazyLoadImages();