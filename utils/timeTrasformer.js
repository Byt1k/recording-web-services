const timeTransformer = (date) => {
    const hours = Math.floor(date / 3600)
    const minutes = Math.floor(date / 60) - (hours * 60)
    const seconds = Math.floor(date % 60)

    const valueFormat = (value) => {
        if (value < 10) {
            value = '0' + value
        }
        return value
    }

    return {
        hours: valueFormat(hours),
        minutes: valueFormat(minutes),
        seconds: valueFormat(seconds)
    }
}

export default timeTransformer