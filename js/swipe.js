import { normalize } from "./utils/normalize";
import "hammerjs/hammer";
import { uniqueAttribute } from "./utils/utils";

export function registerSwipe(element, { swipeDirection = "DIRECTION_RIGHT" }) {
  let hammer = new Hammer(element);

  /** Set the swipe direction */
  hammer.get("pan").set({
    direction: !Hammer[swipeDirection]
      ? Hammer.DIRECTION_RIGHT
      : Hammer[swipeDirection]
  });

  /** Attach swipe handler */
  hammer.on("pan", handleSwipe());
}

/**  Remove element smoothly from the dom*/
export function removeElement(element) {
  element.classList.add("remove");
  setTimeout(function() {
    element.remove();
  }, 1000);
}

/** Swipe handler */
function handleSwipe() {
  var previousDragged;
  return function(e) {
    /** Finding the dragged element */
    let draggedElement = e.target.closest("article");

    /**  If swiped right somewhere else on view port then do nothing */
    if (!draggedElement) {
      return;
    }
    /** Thresold position after which element should be deleted */
    const deletePosition = (draggedElement.offsetWidth * 50) / 100;
    if (
      previousDragged &&
      previousDragged.getAttribute(uniqueAttribute) !==
        draggedElement.getAttribute(uniqueAttribute)
    ) {
      previousDragged.style.transform = `unset`;
      previousDragged.style.opacity = 1;
      previousDragged.classList.remove("card_move_back");
    }

    /** Keeping track of previously dragged element, so that if user while swiping
     * one message go down to swipe other message, we can put back previously
     * swiped message to its origianal position
     */
    previousDragged = draggedElement;

    /** Change dragged element's position and its opacity */
    draggedElement.style.transform = `translateX(${e.deltaX}px)`;
    draggedElement.style.opacity = normalize(
      e.deltaX,
      draggedElement.clientWidth,
      0
    );

    /** If user has finished swiping */
    if (e.isFinal) {
      /** Remove element if thresold has been crossed else put message back to
       * its original position
       */
      if (e.deltaX >= deletePosition) {
        removeElement(draggedElement);
      } else {
        draggedElement.style.transform = `unset`;
        draggedElement.classList.add("card_move_back");
        draggedElement.style.opacity = 1;
        setTimeout(function() {
          draggedElement.classList.remove("card_move_back");
        }, 1000);
      }
    }
  };
}
