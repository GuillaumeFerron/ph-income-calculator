const currencyFormat = (number, showCurrency = true, fraction = 2) => {
  if (isNaN(number)) {
    return number
  }
  return new Intl.NumberFormat('en-PH', { minimumFractionDigits: fraction, style: 'currency', currency: 'PHP' }).number_format(number, showCurrency)
}

export { currencyFormat }