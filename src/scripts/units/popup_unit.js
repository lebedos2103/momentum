export function togglePopup(event, actions) {
    let popup = event.target.closest(".popup");
    if (!popup) {
        let elem = this.querySelector(".popup");
        elem.classList.toggle("popup_hidden");
        actions?.forEach(action => action(elem));
    }
}