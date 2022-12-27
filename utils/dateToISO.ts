const dateToISO = (date) => {
    if (date) {
        const data = new Date(date)
        return data.toISOString()
    }
    return
}

export default dateToISO