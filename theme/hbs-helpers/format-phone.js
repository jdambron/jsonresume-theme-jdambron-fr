const { SafeString } = require('handlebars');

const formatPhone = (phone) => {
  if (!phone) {
    return '';
  }
  let formattedPhone = phone.replace(/ /g, '&nbsp;');
  formattedPhone = formattedPhone.replace(/-/g, '&#8209;');
  return new SafeString(formattedPhone);
};

module.exports = { formatPhone };