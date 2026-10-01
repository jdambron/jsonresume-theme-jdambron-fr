// `new Date('2020-01-01')` is parsed as UTC midnight, then formatted in local
// time — so in any timezone behind UTC (e.g. America/Los_Angeles) it renders as
// "Dec 2019". Date-only and year-month strings are therefore built from their
// calendar parts in local time. Everything else (full ISO timestamps carrying an
// offset, Date instances, ...) is parsed natively, where the instant is already
// unambiguous.
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const YEAR_MONTH = /^(\d{4})-(\d{2})$/;

const matchesParts = (date, year, month, day) =>
  date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;

const parseDate = (value) => {
  if (value == null || value === '') {
    return null;
  }

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string') {
    const dateOnly = DATE_ONLY.exec(value);
    if (dateOnly) {
      const [, year, month, day] = dateOnly.map(Number);
      const date = new Date(year, month - 1, day);
      // Reject overflow such as 2020-02-31, which would silently roll over.
      return matchesParts(date, year, month - 1, day) ? date : null;
    }

    const yearMonth = YEAR_MONTH.exec(value);
    if (yearMonth) {
      const [, year, month] = yearMonth.map(Number);
      const date = new Date(year, month - 1, 1);
      return matchesParts(date, year, month - 1, 1) ? date : null;
    }
  }

  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

module.exports = { parseDate };