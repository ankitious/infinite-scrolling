import { get } from "axios";

/** API base url */
export const BASE_URL = "https://message-list.appspot.com";

/** Message API url */
const MESSAGES_URL = `${BASE_URL}/messages`;

/** inital message call when page loads */
export function fetchInitialMessages() {
  return get(MESSAGES_URL);
}

/** message call once page token is present*/
export function fetchNextMessages(token = "") {
  return get(`${MESSAGES_URL}?${token}`);
}
