const { SafeString } = require('handlebars');

const birthDate = (birth) => {
  const out = [];
  if (birth && Object.keys(birth).length) {
    if (birth.place) {
      out.push(`<div> Né à ${birth.place}`);
    }
    if (birth.place && birth.state) {
      out.push(`, ${birth.state}`);
    }
    const year = birth.date ? new Intl.DateTimeFormat('fr-FR', { year: 'numeric' }).format(new Date(birth.date)) : '';
    if (year && birth.place && birth.state) {
      out.push(` en ${year}</div>`);
    } else if (year && (!birth.place || birth.state)) {
      out.push(`<div> Né en ${year}</div>`);
    }
  }

  return new SafeString(out.join(''));
};

module.exports = { birthDate };
