export function hydrate(parentElement, content) {
    if (!parentElement) {
        parentElement = document.createElement("div");
        document.body.appendChild(parentElement);
    }
    parentElement.innerHTML = "";
    parentElement.append(content);
    const event = new Event("ssrdone", {
        bubbles: true,
    });
    parentElement.dispatchEvent(event);
}
