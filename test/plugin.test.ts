import rehypeSlugSectionizeAnchorize, {
  type RehypeSlugAnchorSectionizeOptions,
} from '../src'

import { deepStrictEqual } from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, it } from 'node:test'

import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const cwd = process.cwd()
const path = (file: string) => resolve(cwd, 'test', 'markdown', file)

function createProcessor(options?: RehypeSlugAnchorSectionizeOptions) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlugSectionizeAnchorize, options)
    .use(rehypeStringify)

  return processor
}

describe('plugin test', () => {
  it('should render headings with default options', async () => {
    const { value } = await createProcessor().process(
      await readFile(path('markdown.md'), { encoding: 'utf8' })
    )

    deepStrictEqual(
      value,
      '<section id="heading-21-section"><h2 id="heading-21" role="presentation"><a href="#heading-21" class="heading-anchor"><button type="button" class="heading-anchor__btn">#</button></a><span role="heading" aria-level="2">Heading 2.1</span></h2>\n<p>Paragraph 1</p>\n</section><section id="heading-22-section"><h2 id="heading-22" role="presentation"><a href="#heading-22" class="heading-anchor"><button type="button" class="heading-anchor__btn">#</button></a><span role="heading" aria-level="2">Heading 2.2</span></h2>\n<p>Paragraph 2</p>\n<section id="heading-31-section"><h3 id="heading-31" role="presentation"><a href="#heading-31" class="heading-anchor"><button type="button" class="heading-anchor__btn">#</button></a><span role="heading" aria-level="3">Heading 3.1</span></h3>\n<p>Paragraph 3</p>\n</section></section><section id="heading-23-section"><h2 id="heading-23" role="presentation"><a href="#heading-23" class="heading-anchor"><button type="button" class="heading-anchor__btn">#</button></a><span role="heading" aria-level="2">Heading 2.3</span></h2>\n<p>Paragraph 4</p></section>'
    )
  })
})
