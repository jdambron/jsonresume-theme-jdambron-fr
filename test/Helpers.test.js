const { birthDate } = require('../theme/hbs-helpers/birth-date.js');
const { dateHelpers } = require('../theme/hbs-helpers/date-helpers.js');
const { formatPhone } = require('../theme/hbs-helpers/format-phone.js');
const { paragraphSplit } = require('../theme/hbs-helpers/paragraph-split.js');
const { spaceToDash } = require('../theme/hbs-helpers/space-to-dash.js');
const { toLowerCase } = require('../theme/hbs-helpers/to-lower-case.js');

describe('birth-date helper', () => {
  test('returns empty string for missing or empty birth', () => {
    expect(String(birthDate())).toBe('');
    expect(String(birthDate(null))).toBe('');
    expect(String(birthDate({}))).toBe('');
  });

  test('renders year only', () => {
    expect(String(birthDate({ date: '1990-05-10' }))).toContain('Né en 1990');
  });

  test('renders place only', () => {
    const out = String(birthDate({ place: 'Paris' }));
    expect(out).toContain('Né à Paris');
    expect(out.trim().endsWith('</div>')).toBe(true);
  });

  test('renders place and state', () => {
    const out = String(birthDate({ place: 'Paris', state: 'Île-de-France' }));
    expect(out).toBe('<div> Né à Paris, Île-de-France</div>');
  });

  test('renders place, state and date with a closing div', () => {
    const out = String(birthDate({ place: 'Paris', state: 'Île-de-France', date: '1990-05-10' }));
    expect(out).toContain('Né à Paris, Île-de-France en 1990');
    expect(out.trim().endsWith('</div>')).toBe(true);
  });

  test('ignores an invalid date but still renders place', () => {
    const out = String(birthDate({ place: 'Paris', date: 'not-a-date' }));
    expect(out).toBe('<div> Né à Paris</div>');
  });
});

describe('date helpers', () => {
  test('MY formats month + year', () => {
    expect(dateHelpers.MY('2020-07-01')).toBe('juil. 2020');
  });

  test('Y formats year only', () => {
    expect(dateHelpers.Y('2020-07-01')).toBe('2020');
  });

  test('DMY formats day + month + year', () => {
    expect(dateHelpers.DMY('2020-07-04')).toMatch(/^4 juil\. 2020$/);
  });

  test('empty values return empty string', () => {
    expect(dateHelpers.MY('')).toBe('');
    expect(dateHelpers.Y(null)).toBe('');
  });

  test('invalid dates fall back to the raw value', () => {
    expect(dateHelpers.MY('en cours')).toBe('en cours');
  });
});

describe('formatPhone helper', () => {
  test('returns empty string for falsy input', () => {
    expect(String(formatPhone(''))).toBe('');
    expect(String(formatPhone(undefined))).toBe('');
  });

  test('replaces spaces with non-breaking spaces', () => {
    expect(String(formatPhone('+33 1 23'))).toBe('+33&nbsp;1&nbsp;23');
  });

  test('replaces hyphens with non-breaking hyphens', () => {
    expect(String(formatPhone('01-23'))).toBe('01&#8209;23');
  });
});

describe('paragraphSplit helper', () => {
  test('returns empty string for null/undefined', () => {
    expect(String(paragraphSplit(null))).toBe('');
    expect(String(paragraphSplit(undefined))).toBe('');
  });

  test('wraps plain text in a paragraph and escapes HTML', () => {
    const out = String(paragraphSplit('Hello <b>world</b>'));
    expect(out).toContain('<p>Hello &lt;b&gt;world&lt;/b&gt;</p>');
  });

  test('linkifies URLs', () => {
    expect(String(paragraphSplit('see example.com here'))).toContain('<a href=');
  });

  test('splits paragraphs on blank lines', () => {
    const out = String(paragraphSplit('one\n\ntwo'));
    expect(out).toContain('<p>one</p>');
    expect(out).toContain('<p>two</p>');
  });
});

describe('spaceToDash helper', () => {
  test('converts spaces to dashes and lowercases', () => {
    expect(spaceToDash('GitHub Profile')).toBe('github-profile');
  });

  test('handles null/undefined safely', () => {
    expect(spaceToDash(null)).toBe('');
    expect(spaceToDash(undefined)).toBe('');
  });
});

describe('toLowerCase helper', () => {
  test('lowercases the input', () => {
    expect(toLowerCase('ABC')).toBe('abc');
  });

  test('handles null/undefined safely', () => {
    expect(toLowerCase(null)).toBe('');
    expect(toLowerCase(undefined)).toBe('');
  });
});
