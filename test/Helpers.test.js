const { birthDate } = require('../theme/hbs-helpers/birth-date.js');
const { dateHelpers } = require('../theme/hbs-helpers/date-helpers.js');
const { formatPhone } = require('../theme/hbs-helpers/format-phone.js');
const { paragraphSplit } = require('../theme/hbs-helpers/paragraph-split.js');
const { parseDate } = require('../theme/hbs-helpers/parse-date.js');
const { spaceToDash } = require('../theme/hbs-helpers/space-to-dash.js');
const { toLowerCase } = require('../theme/hbs-helpers/to-lower-case.js');
const { execFileSync } = require('node:child_process');
const { join } = require('node:path');

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

describe('parseDate helper', () => {
  test('returns null for empty and nullish values', () => {
    expect(parseDate('')).toBeNull();
    expect(parseDate(null)).toBeNull();
    expect(parseDate(undefined)).toBeNull();
  });

  test('builds date-only strings at local midnight, not UTC', () => {
    const date = parseDate('2020-01-01');
    expect(date.getFullYear()).toBe(2020);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(1);
    expect(date.getHours()).toBe(0);
  });

  test('builds year-month strings at local midnight', () => {
    const date = parseDate('2020-07');
    expect(date.getFullYear()).toBe(2020);
    expect(date.getMonth()).toBe(6);
    expect(date.getDate()).toBe(1);
  });

  test('accepts a valid leap day', () => {
    const date = parseDate('2020-02-29');
    expect(date.getDate()).toBe(29);
  });

  test('rejects out-of-range dates instead of rolling over', () => {
    expect(parseDate('2020-02-31')).toBeNull();
    expect(parseDate('2021-02-29')).toBeNull();
    expect(parseDate('2020-13-01')).toBeNull();
    expect(parseDate('2020-00-10')).toBeNull();
  });

  test('still honours the offset of full ISO timestamps', () => {
    // An explicit offset makes the instant unambiguous, so it must not be
    // reinterpreted as a local calendar date.
    expect(parseDate('2020-07-01T23:30:00Z').getHours()).toBe(new Date('2020-07-01T23:30:00Z').getHours());
    expect(parseDate('2020-07-01T00:00:00+02:00').getTime())
      .toBe(new Date('2020-07-01T00:00:00+02:00').getTime());
  });

  test('passes through Date instances', () => {
    const input = new Date(2020, 6, 1);
    expect(parseDate(input).getTime()).toBe(input.getTime());
    expect(parseDate(new Date('nope'))).toBeNull();
  });

  test('returns null for unparseable strings', () => {
    expect(parseDate('en cours')).toBeNull();
    expect(parseDate('not-a-date')).toBeNull();
  });
});

describe('date helpers', () => {
  test('MY formats month + year', () => {
    expect(dateHelpers.MY('2020-07-01')).toBe('juil. 2020');
  });

  test('formats identically in timezones behind UTC', () => {
    // `new Date('2020-01-01')` is UTC midnight, which would render as "déc. 2019"
    // in America/* and break the PDF output for those users.
    const script = `
      const { dateHelpers } = require(${JSON.stringify(join(__dirname, '../theme/hbs-helpers/date-helpers.js'))});
      process.stdout.write(JSON.stringify([dateHelpers.MY('2020-01-01'), dateHelpers.MY('2020-07-01')]));
    `;
    const results = ['UTC', 'America/Los_Angeles', 'America/New_York', 'Europe/Paris', 'Asia/Tokyo']
      .map(zone => execFileSync(process.execPath, ['-e', script], { env: { ...process.env, TZ: zone } }).toString());

    for (const out of results) {
      expect(JSON.parse(out)).toEqual(['janv. 2020', 'juil. 2020']);
    }
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
