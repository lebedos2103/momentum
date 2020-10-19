export function addZero(number) {
    if (number < 10 && number >= 0)
        return `0${number}`;
    return number.toString();
}

export function getDayState(time) {
    let hours = time.getHours();

    if (hours < 4)
        return 1;
    else if (hours < 11)
        return 2;
    else if (hours < 17)
        return 3;
    else if (hours < 23)
        return 4;

    return 1;
}