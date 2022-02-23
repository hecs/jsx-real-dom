import { getRefs } from "./getRefs";
import { createEvent } from "./utils/events";

export function hydrate(content, elm?) {
    if (!elm) {
        elm = document.body;
    }
    elm.innerHTML = "";

    elm.append(content);
    elm.dispatchEvent(createEvent("rendered"));
    return getRefs(elm);
}
