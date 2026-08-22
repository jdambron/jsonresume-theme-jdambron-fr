module.exports = {
  spaceToDash: str => (str == null ? '' : String(str).replace(/\s/g, '-').toLowerCase())
};
