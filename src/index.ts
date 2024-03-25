import { slug } from 'github-slugger'
import type { Element, Root } from 'hast'
import { toString as hastToString } from 'hast-util-to-string'
import type { Plugin } from 'unified'
import { findAfter } from 'unist-util-find-after'
import type { Test } from 'unist-util-is'
import { visit } from 'unist-util-visit'

export interface RehypeSlugAnchorSectionizeOptions {
  /** The heading level depth to sectionize. defaults to `3` */
  depth: number

  /** The wrapper Element `tagName`. defaults to `section` */
  wrapperTagName?: string

  /** The wrapper Element `properties`. defaults to `undefined` */
  wrapperProperties?: Element['properties'] | undefined

  /** Adds an additive at end of the wrappers id.  defaults to `-section` */
  wrapperSlugAdditive?: string

  /** The link Element `properties`. defaults to `{ className: 'heading-anchor' }` */
  linkProperties?: Element['properties']

  /** The button Element `properties`. defaults to `{ className: 'heading-anchor__btn' }` */
  buttonProperties?: Element['properties']
}

const defaults: RehypeSlugAnchorSectionizeOptions = {
  depth: 3,
  wrapperTagName: 'section',
  wrapperProperties: undefined,
  wrapperSlugAdditive: '-section',
  linkProperties: {
    className: 'heading-anchor',
  },
  buttonProperties: {
    className: 'heading-anchor__btn',
  },
}

const rehypeSlugAnchorSectionize: Plugin<
  [RehypeSlugAnchorSectionizeOptions?],
  Root
> = (userOptions?: RehypeSlugAnchorSectionizeOptions) => {
  const options = { ...defaults, ...userOptions }

  const findEndHeading = (
    parent: Root | Element,
    start: Element,
    depthTag: string
  ) => {
    const isEnd = (node: Element) =>
      node.type === 'element' && node.tagName === depthTag
    return findAfter(parent, start, isEnd as Test) || -1
  }

  return (tree) => {
    for (let depth = 0; depth <= options.depth; depth++) {
      visit(
        tree,
        { type: 'element', tagName: `h${depth}` },
        (node, index, parent) => {
          if (!parent || parent == null || typeof index !== 'number') return

          const start = node
          const depthTag = start.tagName

          const end = findEndHeading(parent, start, depthTag)

          const startIndex = parent.children.indexOf(node)
          const endIndex = parent.children.indexOf(end as Element)

          const between = parent.children.slice(
            startIndex,
            endIndex > 0 ? endIndex : undefined
          )

          const slugId = slug(hastToString(node)) || null

          const linkProps = {
            href: `#${slugId}`,
            ...options.linkProperties,
          }

          const buttonProps = {
            type: 'button',
            ...options.buttonProperties,
          }

          const sectionProps: Element['properties'] = {
            ...(options.wrapperProperties || {}),
            ...(slugId && {
              id: `${slugId}${options.wrapperSlugAdditive || ''}`,
            }),
          }

          node.properties = {
            ...(slugId && {
              id: slugId,
            }),
            role: 'presentation',
          }

          node.children = [
            {
              type: 'element',
              tagName: 'a',
              properties: linkProps,
              children: [
                {
                  type: 'element',
                  tagName: 'button',
                  properties: buttonProps,
                  children: [{ type: 'text', value: '#' }],
                },
              ],
            },
            {
              type: 'element',
              tagName: 'span',
              properties: { role: 'heading', ariaLevel: depthTag.slice(1) },
              children: node.children,
            },
          ]

          const section = {
            type: 'element',
            tagName: options.wrapperTagName,
            properties: sectionProps,
            children: between,
          } as Element

          parent.children.splice(startIndex, section.children.length, section)
        }
      )
    }
  }
}

export { rehypeSlugAnchorSectionize }
export default rehypeSlugAnchorSectionize
