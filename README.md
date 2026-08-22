# French localized Julien Dambron's theme for jsonresume [![npm version](https://badge.fury.io/js/jsonresume-theme-jdambron-fr.svg)](https://badge.fury.io/js/jsonresume-theme-jdambron-fr)

A theme for my resume, freely inspired from the Stackoverflow theme.

## Usage

Install the theme and render with the [resume-cli](https://github.com/jsonresume/resume-cli):

```sh
npm install -g resume-cli
npm install jsonresume-theme-jdambron-fr
resume export resume.pdf --theme jsonresume-theme-jdambron-fr --format A4
```

The theme exports:

- `render(resume)` — returns a full HTML string (CSS is inlined; the Inter font is base64-embedded for PDF output).
- `pdfRenderOptions` — A4 page with 0.8 cm margins, passed to the PDF renderer.

## Non-standard fields

On top of the [JSON Resume schema](https://jsonresume.org/schema/), this theme supports:

- `basics.birth` — `{ place, state, date }`, rendu sous la forme « Né à … » dans l'en-tête.
- `skills[].levelDisplay` — free-form text shown instead of the numeric/standard `level`.
- `languages[].fluencyDisplay` — free-form text shown instead of the standard `fluency` value.

## Notes

- Profile icons use Font Awesome brand icons: the `network` field must match a [Font Awesome brand slug](https://fontawesome.com/search?icons=brands) (e.g. `github`, `linkedin`).
- Font Awesome itself is loaded from a CDN (`cdnjs.cloudflare.com`), so HTML rendering requires an internet connection. Fonts and CSS, however, are embedded.
- Markdown is supported in `summary` / `highlights` fields (raw HTML is disabled, links are auto-linkified).

## Development

```sh
bun install        # install dependencies
bun run test       # run Jest tests with coverage
bun run updateTestSnapshots   # update the HTML snapshot after intentional changes
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Acknowledgements

 - [jsonresume-theme-curzy](https://github.com/Curzy/jsonresume-theme-curzy)
 - [jsonresume-theme-stackoverflow](https://github.com/phoinixi/jsonresume-theme-stackoverflow)
 - [JSON Resume](https://jsonresume.org/)
 - [HackMyResume](https://github.com/hacksalot/HackMyResume)
