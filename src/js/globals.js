Intl.NumberFormat.prototype.number_format = function (
  number, showCurrency = true) {
  try {
    const f = this.formatToParts(number).reduce((p, c) => {
      return (c.type === 'minusSign')
        ? { ...p, minusSign: c.value }
        : (c.type === 'currency')
          ? { ...p, currency: c.value }
          : { ...p, value: p.value + c.value }
    }, { value: '' })
    return showCurrency
      ? `${f.currency} ${f.minusSign || ''}${f.value}`
      : `${f.minusSign || ''}${f.value}`
  } catch (e) {
    try {
      return this.format(number)
    } catch (ee) {
      return showCurrency ? `₱ ${number}` : number
    }
  }
}