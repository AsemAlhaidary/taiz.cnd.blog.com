/**
 * @function chatBubble
 * @desc Listening for the long press action then show chat-bubbles
 * @param {Element} container The container of group of chat-bubbles
 * @param {Element} elem The element which will be listening to long
 *                       press action
 * @param {Callback} getChatBubble A call back function that returns
 * the chat-bubble element to display
 */
function chatBubble(container, elem, getChatBubble) {
  // Global variable to work as a 'switch', without this switch 'touchend'
  // eventListener will not work properly.
  let showBubble = false;

  // Global variable to detect if the longPress happened or not, if 
  // sortLongPress then continue displaying chat-bubbles for 2 more seconds
  // after 'touchend'
  let keepChatBubble = false;

  elem.addEventListener('touchstart', () => {
    const PRESS_DURATION = 500;

    // Switch On to allow displaying hints.
    showBubble = true;

    // Hide all 'chatBubble's before show the new one.
    initChatBubbles(container);

    // Display the 'chat-bubble' if 'elem' has been touched for
    // `PRESS_DURATION` period of time.
    setTimeout(() => {

      // If the hint is switched on && the hint wasn't switched off
      // when 'touchend', the hint will appear.
      if (showBubble) {

        // keepChatBubble = true to allow displaying chat-bubbles for 2 
        // more seconds after 'touchend'
        keepChatBubble = true;

        // Get the desired element to be displayed, then display it.
        let chatBubble = getChatBubble();
        chatBubble.style.display = 'block';
      }
    }, PRESS_DURATION);
  });

  elem.addEventListener('touchend', () => {
    const EXTRA_TIME = 2000;

    // Switch off to prevent 'touchstart' from displaying the hint.
    showBubble = false;

    // If 'keepChatBubble' hide the hints after 'EXTRA_TIME'
    if (keepChatBubble) {
      setTimeout(() => {
        // Set to default value
        keepChatBubble = false;

        // Get the desired element to be hidden, then hide it.
        let chatBubble = getChatBubble();
        chatBubble.style.display = 'none';
      }, EXTRA_TIME);
    }
  });
}

/**
 * @function initChatBubbles
 * @desc Hide all of the chatBubbles
 * @param {Element} The container of a group of chat-bubbles
 * @return {void}
 */
function initChatBubbles(container) {
  const chatBubbles = [...container.getElementsByClassName('optionName')];

  chatBubbles.map(chatBubble => {
    chatBubble.style.display = 'none';
  });
}