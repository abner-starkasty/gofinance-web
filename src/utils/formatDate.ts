const formatDate = (dateISOStringFormat: string | Date) => {
  const dateInstance = new Date(dateISOStringFormat)
  const year = dateInstance.getFullYear()
  const month = dateInstance.getMonth() + 1
  const day = `0${dateInstance.getDate()}`.slice(-2)

  return `${day}/${month}/${year}`
}

export default formatDate
