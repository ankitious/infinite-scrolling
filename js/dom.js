import { BASE_URL } from "./api";
import { isObject } from "./utils/isObject";
import { isProp } from "./utils/isProp";
import moment from "moment";
import { uniqueAttribute } from "./utils/utils";

/**  Counter for elements added by dom */
let elementCount = 1;

export function draw(message) {
  /** Validate if message is an object with properties */
  if (isObject(message) && Object.keys(message).length > 0) {
    /****  Get the dom nodes from template *********/
    const template = document.getElementById("output");
    const clone = document.importNode(template.content, true);
    let card = clone.querySelector(".card");
    let avatar = card.querySelector(".card_author_image > img");
    let name = card.querySelector(".card_author_info > strong");
    let text = card.querySelector(".card_author_message");
    let time = card.querySelector(".card_author_info > time");

    /**** Set Content into the elements based on response */
    card.setAttribute(uniqueAttribute, elementCount);
    card.setAttribute("tabindex", elementCount);
    text.innerText = message.content;
    time.innerText = moment(message.updated).fromNow();

    /** Check if message has a author property  */
    if (isProp(message, "author")) {
      avatar.src = `${BASE_URL}/${message.author.photoUrl}`;
      avatar.alt = `Image of ${message.author.name}`;
      name.innerText = message.author.name;
    } else {
      avatar.src = "";
      avatar.alt = "";
      name.innerText = "";
    }

    /** Append the template to dom */
    document.getElementById("isl_content-section").appendChild(clone);
    elementCount++;
  }
}
