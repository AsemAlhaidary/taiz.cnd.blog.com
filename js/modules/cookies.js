/**
 * @function evalString
 * @desc Converts `val` from string based on type: string | number | boolean
 * @param {string} val - string to evaluate
 * @return {object} val - returns a boolean if true|false; number of integer; otherwise original string;
 */
function evalString(val) {
	if (val.length > 0) {
		// is Number?
		if (!isNaN(val)) {
			val = parseFloat(val);
		} else {
			// is Bool?
			switch (val.toLowerCase()) {
				case 'true':
					val = true;
					break;
				case 'false':
					val = false;
					break;
			}
		}
	}

	return (val);
}

/**
 * @function isStorageEnabled
 * @desc Checks if localStorage and thus cookies are allowed
 * to be stored on local system
 * @param {}
 * @return {boolean} cookieEnabled
 */
function isStorageEnabled() {
	let cookieEnabled = true;

	try {
		localStorage.setItem('checkMyCookie', 'true');
	} catch (e) {
		// Assuming that cookies are disabled since localStorage is disabled.
		// console.log("Cookies are disabled.");
		cookieEnabled = false;
	}

	return (cookieEnabled);
}

/**
 * @function getCookie
 * @desc Retrieves all stored cookies for site.
 * @param {}
 * @return {object} myCookie
 * @example `let myTheme = getCookie().theme;` If "theme" is a stored cookie, the object value will be returned.
 */
function getCookie() {
	let myCookie = document.cookie.split(';');

	myCookie = myCookie.map(cookie => cookie.split('='))
		.reduce((accumulator, [key, value]) => ({
			...accumulator,
			[key.trim()]: evalString(decodeURIComponent(value))
		}), {});

	return myCookie;
}

/**
 * @function setCookie
 * @desc stores a cookie on the root(/) of website. If error, logs to console.
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#directives
 * @param {string} cKey - name of the key
 * @param {string} cVal - value to set on key
 * @param {number} [cDays=30] - days to keep the cookie. Default: 30
 * @example `setCookie("theme", 'night');` Sets a cookie theme=night for 30 days expiry.
 * @return {void} 
 */
function setCookie(cKey, cVal, cDays = 30) {
	let date = new Date();
	date.setTime(date.getTime() + (cDays * 24 * 60 * 60 * 1000));
	let expires = date.toUTCString();

	// All domains (NOTE: Cookies can't be saved on IPs domains)
	let domain = document.domain;

	cKey = cKey.trim();
	cVal = cVal.trim();

	console.log("setCookie( Key: '" + cKey + "', Val: '" + cVal + "', Days: '" + cDays + "');");
	if (isStorageEnabled()) {
		cVal = escape(cVal);
		document.cookie = cKey + '=' + cVal + ';' + 'Expires=' + expires + ';Path=/;Secure;SameSite=lax;Domain=' + domain;
	} else {
		throw new Error("Cookies are disabled.");
	}
}