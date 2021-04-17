/****  root script */

import { fetchInitialMessages } from "./api";

/** With classical module pattern exposed only those methods which should
 *  be public */

import { exposedAPI } from "./module";

function init() {
  /** Load initial data from the api */
  exposedAPI.getData(fetchInitialMessages);

  /** Register events and intersection observers */
  exposedAPI.registerEvents();

  /**  Register space key press event for accesibility */
  exposedAPI.a11y();
}

init();
