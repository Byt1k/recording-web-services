const dateToString = (date) => {
    const data = new Date(date)
    const response = data.toLocaleString().split(', ').join(' ')
    return response !== 'Invalid Date' ? response : null
}

export default dateToString