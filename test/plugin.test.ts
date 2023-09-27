import type { RehypeSlugAnchorSectionizeOptions } from '../src'

import { expect, it } from 'vitest'

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import rehypeSlugSectionizeAnchorize from '../src'

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

it('should ...', async () => {
  const { value } = await createProcessor().process(
    await readFile(path('markdown.md'), { encoding: 'utf8' })
  )

  expect(value).toMatchSnapshot()
})
