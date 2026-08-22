const formatDate = (date, options) => {
  if (date == null || date === '') {
    return '';
  }
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    // Fall back to the raw value when it is not a parseable date.
    return String(date);
  }
  return new Intl.DateTimeFormat('fr-FR', options).format(d);
};

const dateHelpers = {
  MY: date => formatDate(date, { month: 'short', year: 'numeric' }),
  Y: date => formatDate(date, { year: 'numeric' }),
  DMY: date => formatDate(date, { day: 'numeric', month: 'short', year: 'numeric' })
};

module.exports = { dateHelpers };
