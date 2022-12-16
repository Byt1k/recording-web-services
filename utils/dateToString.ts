const dateToString = (date) => {
    return date.split('T').join(' ').split('+').slice(0, 1)
}

export default dateToString