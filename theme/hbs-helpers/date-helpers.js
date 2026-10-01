const { parseDate } = require('./parse-date.js');

const formatDate = (date, options) => {
  const d = parseDate(date);
  if (!d) {
    if (date == null || date === '') {
      return '';
    }
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
