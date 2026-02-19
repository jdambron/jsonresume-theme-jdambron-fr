const { SafeString } = require('handlebars');
const markdown = require('markdown-it')();

const paragraphSplit = (text) => {
  if (text == null) {
    return '';
  }
  return new SafeString(markdown.render(text));
};

module.exports = { paragraphSplit };
