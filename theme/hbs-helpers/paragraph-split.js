const { SafeString } = require('handlebars');
const markdown = require('markdown-it')({ html: false, linkify: true });
// linkify-it v6 (pulled in by markdown-it v15) disables "fuzzy" links by
// default, which stopped bare domains like "example.com" from being turned
// into links. Re-enable it to keep the behavior of markdown-it v14.
markdown.linkify.set({ fuzzyLink: true });

const paragraphSplit = (text) => {
  if (text == null) {
    return '';
  }
  return new SafeString(markdown.render(text));
};

module.exports = { paragraphSplit };
