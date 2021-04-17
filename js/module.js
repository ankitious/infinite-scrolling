import { draw } from "./dom";
import { registerSwipe, removeElement } from "./swipe";
import { initIntersectionObserver } from "./observer";

/**  Use space key to remove the element which is in focus */
const SPACE_KEY = 32;

export const exposedAPI = (function() {
  /**  Fetch data */
  async function getData(fn, token) {
    try {
      let response = await fn(token);

      const { messages, pageToken } = response.data;

      messages.forEach(message => {
        /** Once data is received, paint it to the dom with card template */
        draw(message);
      });
      return pageToken;
    } catch (e) {
      console.error("error while fetching data", e);
    }
  }

  function registerEvents() {
    let infinitScrollingElement = document.querySelector(
      ".isl_content-container"
    );

    /** Register swipe event to delete the message */
    registerSwipe(infinitScrollingElement, {
      swipeDirection: "DIRECTION_RIGHT"
    });

    /** Initialize intersection observer for top and bottom loading elements */
    initIntersectionObserver();
  }

  function a11y() {
    document.onkeydown = function(event) {
      /**  If space key is pressed */
      if (event.keyCode === SPACE_KEY && event.target.matches("article.card")) {
        event.preventDefault();
        /**  Remove the focused element */
        event.target.classList.add("remove");
        setTimeout(() => {
          /**  Shift the focus to the next article */
          if (event.target.nextElementSibling) {
            event.target.nextElementSibling.focus();
          }
          event.target.remove();
        }, 1000);
      }
    };
  }

  return {
    getData,
    registerEvents,
    a11y
  };
})();
