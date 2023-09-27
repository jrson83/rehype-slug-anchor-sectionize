# rehype-slug-anchor-sectionize

**[rehype](https://github.com/rehypejs/rehype)** plugin which wraps headings and their descendants in nested `<section>` elements and applies `slugged anchor links` to them.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Demo](#demo)
- [Install](#install)
- [Use](#use)
- [API](#api)
- [`unified().use(rehypeSlugAnchorSectionize, options?)`](#unifieduserehypesluganchorsectionize-options)
- [Types](#types)
- [Security](#security)
- [License](#license)

## What is this?

This package is a [unified](https://github.com/unifiedjs/unified) ([rehype](https://github.com/rehypejs/rehype)) plugin to wrap headings and their descendants in nested `<section>` elements and apply `slugged anchor links` to them.

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**rehype** adds support for HTML to unified.
**vfile** is the virtual file interface used in unified.
**hast** is the HTML AST that rehype uses.

This is a rehype plugin that inspects and transforms hast.

## When should I use this?

The plugin tries to minimize the configuration effort and complexity by combining the following already existing similar plugin approaches:

- `sectionize` or `section`
- `section-headings`
- `heading-anchor`
- `autolink-headings`
- `slug`

It is useful if you want to use `IntersectionObserver` or similar to observe changes in the intersection of a target element with an ancestor.

## Demo

Inspect the DOM tree and heading elements on any of my [Blog posts](https://jrson.me/blog/).

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 16+), install with [npm](https://docs.npmjs.com/cli/install):

```shell
npm install rehype-slug-anchor-sectionize
```

In Deno, with [esm.sh](https://esm.sh/):

```ts
import rehypeSlugAnchorSectionize from 'https://esm.sh/rehype-slug-anchor-sectionize'
```

In browsers, with [esm.sh](https://esm.sh/):

```html
<script type="module">
  import rehypeSlugAnchorSectionize from 'https://esm.sh/rehype-slug-anchor-sectionize?bundle'
</script>
```

## Use

Say our module `example.js` looks as follows:

```ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSlugAnchorSectionize from 'rehype-slug-anchor-sectionize'
import rehypeStringify from 'rehype-stringify'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeSlugAnchorSectionize)
  .use(rehypeStringify).process(`## Heading 2.1

Paragraph 1

## Heading 2.2

### Heading 3.1

Paragraph 3

## Heading 2.3

Paragraph 4`)

console.log(value)
```

…now running `node example.js` yields HTML Output::

```html
<section id="heading-21-section">
  <h2 id="heading-21" role="presentation">
    <a href="#heading-21" class="heading-anchor">
      <button type="button" class="heading-anchor__btn">#</button>
    </a>
    <span role="heading" aria-level="2">Heading 2.1</span>
  </h2>
  <p>Paragraph 1</p>
</section>

<section id="heading-22-section">
  <h2 id="heading-22" role="presentation">
    <a href="#heading-22" class="heading-anchor">
      <button type="button" class="heading-anchor__btn">#</button>
    </a>
    <span role="heading" aria-level="2">Heading 2.2</span>
  </h2>
  <p>Paragraph 2</p>
  <section id="heading-31-section">
    <h3 id="heading-31" role="presentation">
      <a href="#heading-31" class="heading-anchor">
        <button type="button" class="heading-anchor__btn">#</button>
      </a>
      <span role="heading" aria-level="3">Heading 3.1</span>
    </h3>
    <p>Paragraph 3</p>
  </section>
</section>

<section id="heading-23-section">
  <h2 id="heading-23" role="presentation">
    <a href="#heading-23" class="heading-anchor">
      <button type="button" class="heading-anchor__btn">#</button>
    </a>
    <span role="heading" aria-level="2">Heading 2.3</span>
  </h2>
  <p>Paragraph 4</p>
</section>
```

## Styling

The following styles should be added as minimal setup.

```css
h2 a[class="heading-anchor"],
h3 a[class="heading-anchor"] {
  margin-left: -2rem;
}

.heading-anchor__btn {
  all: unset; /** replace with buttom reset */
  width: 2rem;
  opacity: 0;
  color: #eee;
}

h2:hover a[class="heading-anchor"] .heading-anchor__btn,
h3:hover a[class="heading-anchor"] .heading-anchor__btn {
  opacity: 1;
  cursor: pointer;
}
```

You can change the class names by providing a custom `property` for the element class attributes.

## API

This package exports no identifiers.
The default export is `rehypeSlugAnchorSectionize`.

### `unified().use(rehypeSlugAnchorSectionize, options?)`

- Wraps headings and their descendants in `<section>` elements.
- In addition it applies slugged anchor-id's to the `<section>` and heading elements.

##### `options`

Configuration (optional).

##### `options.depth`

The heading level depth to sectionize. (`number`, default: `3`).

##### `options.wrapperTagName`

The wrapper Element `tagName`. (`string`, default: `section`).

##### `options.wrapperProperties`

The wrapper Element `properties`. (`Element['properties']`, default: `undefined`).

##### `options.wrapperSlugAdditive`

Adds an additive at end of the wrappers id. (`string`, default: `-section`).

##### `options.linkProperties`

The link Element `properties`. (`Element['properties']`, default: `{ className: 'heading-anchor' }`).

##### `options.buttonProperties`

The button Element `properties`. (`Element['properties']`, default: `{ className: 'heading-anchor__btn' }`).

## Types

This package is fully typed with [TypeScript](https://www.typescriptlang.org/).
The additional type `RehypeSlugAnchorSectionizeOptions` is exported.

## Security

As improper use of HTML can open you up to a [cross-site scripting (XSS)][xss]
attacks, use of rehype can also be unsafe.
Use [`rehype-sanitize`][rehype-sanitize] to make the tree safe.

Use of rehype plugins could also open you up to other attacks.
Carefully assess each plugin and the risks involved in using them.

## License

[MIT](./LICENSE.md)
