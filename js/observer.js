import { exposedAPI } from "./module";
import { fetchNextMessages } from "./api";
import { uniqueAttribute } from "./utils/utils";

/** Maximum messages visible on the dom */
const MAXIMUM_MESSAGES = 50;

/** Maximum elements that can be cached into fragments */
const MAX_CACHE_LIMIT = 20;
let cache = {
  top: [],
  bottom: []
};
let token;

function createFragment() {
  return document.createDocumentFragment();
}

/** Add message elements to framgment */
function addChildrenToFragment(fragment, nodeList, limit) {
  let count = 0;
  while (count < limit) {
    let val = nodeList.shift();
    fragment.appendChild(val);
    count++;
  }
  return fragment;
}

/** Add cached messages to the bottom */
function appendCache() {
  document
    .getElementById("isl_content-section")
    .appendChild(cache.bottom.pop());
}

/** Add cached messages to the top */
function insertBeforeCache() {
  let elem = document.getElementById("isl_content-section");
  elem.insertBefore(cache.top.pop(), elem.firstChild);
  document.querySelector(".isl_content-container").scrollTo(0, 1500);
}

/** If elements on the dom becomes more than 50 then cached them */
function useCache(direction) {
  var elements = document.querySelectorAll(`[${uniqueAttribute}]`);
  if (elements.length > MAXIMUM_MESSAGES) {
    elements = Array.prototype.slice.call(elements);
    while (elements.length > MAXIMUM_MESSAGES) {
      let fragment = createFragment();
      let limit =
        elements.length - MAXIMUM_MESSAGES > MAX_CACHE_LIMIT
          ? MAX_CACHE_LIMIT
          : elements.length - MAXIMUM_MESSAGES;
      if (direction === "top") {
        addChildrenToFragment(fragment, elements.slice(0, limit), limit);
      } else {
        addChildrenToFragment(
          fragment,
          elements.slice(Math.max(elements.length - limit, 1)),
          limit
        );
      }
      elements.length = elements.length - limit;
      cache[direction].push(fragment);
    }
  }
}

/**
 * If top observer is triggered then first check if there is any data in cache
 *  also cache bottom messages if total messages greater than 50
 */
const triggerTop = entry => {
  if (cache.top.length > 0) {
    insertBeforeCache();
  }
  useCache("bottom");
};

/**
 * Same as top observer but if cache doesn't have data then call api to
 * receive new data
 */
const triggerBottom = async entry => {
  if (cache.bottom.length > 0) {
    appendCache();
  } else {
    token = await exposedAPI.getData(fetchNextMessages, token);
  }
  useCache("top");
};

/** Initialize intersection observer api */
export const initIntersectionObserver = () => {
  const options = {};

  const fn = entries => {
    entries.forEach(entry => {
      if (entry.target.id === "isl_loading-bottom" && entry.isIntersecting) {
        triggerBottom(entry);
      } else if (
        entry.target.id === "isl_loading-top" &&
        entry.isIntersecting
      ) {
        triggerTop(entry);
      }
    });
  };

  var observer = new IntersectionObserver(fn, options);
  observer.observe(document.querySelector("#isl_loading-bottom"));
  observer.observe(document.querySelector("#isl_loading-top"));
};
