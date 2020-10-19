let name = document.querySelector(".content__name"),
    focus = document.querySelector(".purpose__focus");

export async function initContent() {
    name.innerHTML = getName();
    focus.innerHTML = getFocus();

    name.addEventListener("keypress", setEditableElement);
    name.addEventListener("blur", setEditableElement);
    focus.addEventListener("keypress", setEditableElement);
    focus.addEventListener("blur", setEditableElement);
}

function setEditableElement(event) {
    if (event.type === "keypress") {
        if (event.key === "Enter") {
            localStorage.setItem(event.target.dataset.elementName, event.target.innerHTML);
            event.target.blur();
        }
    } else
        localStorage.setItem(event.target.dataset.elementName, event.target.innerHTML);
}

function getName() {
    return localStorage.getItem("name") || "[Enter name]";
}

function getFocus() {
    return localStorage.getItem("focus") || "[Enter name]";
}
