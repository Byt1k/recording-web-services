import moment from "moment"

export type TimeRange = 'custom' | 'currentDay' | 'prevDay'
    | 'currentWeek' | 'prevWeek' | 'currentMonth'
    | 'prevMonth' | 'currentQuarter' | 'prevQuarter'
    | 'currentYear' | 'prevYear'

export type SelectTimeRange = (timeRange: string) => {start: string, end: string}

const selectTimeRange: SelectTimeRange = (timeRange: TimeRange) => {

    const m = moment()
    const format = 'YYYY-MM-DDTHH:mm'
    let start = ''
    let end = ''

    // Текущий день
    if (timeRange === 'currentDay') {
        start = m.startOf('d').format(format)
        end = m.endOf('d').add(1, 's').format(format)
    }

    // Предыдущий день
    if (timeRange === 'prevDay') {
        start = m.add(-1, 'd').startOf('d').format(format)
        end = m.endOf('d').add(1, 's').format(format)
    }

    // Текущая неделя
    if (timeRange === 'currentWeek') {
        start = m.startOf('w').add(1, 'd').format(format)
        end = m.endOf('w').add({d: 1, s: 1}).format(format)
    }

    // Предыдущая неделя
    if (timeRange === 'prevWeek') {
        start = m.startOf('w').add({w: -1, d: 1}).format(format)
        end = m.endOf('w').add({d: 1, s: 1}).format(format)
    }

    // Текущий месяц
    if (timeRange === 'currentMonth') {
        start = m.startOf('M').format(format)
        end = m.endOf('M').add(1, 's').format(format)
    }

    // Предыдущий месяц
    if (timeRange === 'prevMonth') {
        start = m.add(-1, 'M').startOf('M').format(format)
        end = m.endOf('M').add(1, 's').format(format)
    }

    // Текущий квартал
    if (timeRange === 'currentQuarter') {
        start = m.startOf('Q').format(format)
        end = m.endOf('Q').add(1, 's').format(format)
    }

    // Предыдущий квартал
    if (timeRange === 'prevQuarter') {
        start = m.add(-1, 'Q').startOf('Q').format(format)
        end = m.endOf('Q').add(1, 's').format(format)
    }

    // Текущий год
    if (timeRange === 'currentYear') {
        start = m.startOf('y').format(format)
        end = m.endOf('y').add(1, 's').format(format)
    }

    // Предыдущий год
    if (timeRange === 'prevYear') {
        start = m.add(-1, 'y').startOf('y').format(format)
        end = m.endOf('y').add(1, 's').format(format)
    }

    return {start, end}
}

export default selectTimeRange