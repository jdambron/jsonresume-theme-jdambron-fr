const dateHelpers = {
  MY: date => new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' }).format(new Date(date)),
  Y: date => new Intl.DateTimeFormat('fr-FR', { year: 'numeric' }).format(new Date(date)),
  DMY: date => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
};

module.exports = { dateHelpers };
