function buildMonthArrayFromLatest(latestMonth) {
  const startDate = new Date('2001-01-01')
  const endDate = new Date(latestMonth.slice(0, 4) + '-' + latestMonth.slice(4) + '-01')
  const currentDate = endDate
  const dateArray = []

  while (currentDate >= startDate) {
    const year = currentDate.getFullYear().toString()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const dateString = year + month
    dateArray.push(dateString)
    currentDate.setMonth(currentDate.getMonth() - 1)
  }

  return dateArray
}

module.exports = {
  buildMonthArrayFromLatest
}