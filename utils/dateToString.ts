const dateToString = (date) => {
    const data = new Date(date)
    return data.toLocaleString().split(', ').join(' ')
}

export default dateToString