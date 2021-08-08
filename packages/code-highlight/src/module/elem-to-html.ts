/**
 * @description to html
 * @author wangfupeng
 */

import { Element } from 'slate'
import { IDomEditor } from 'wangeditor-re'
import { CodeElement } from '../custom-types'

function codeToHtml(elem: Element, childrenHtml: string, editor: IDomEditor): string {
  const { language = '' } = elem as CodeElement

  const cssClass = language
    ? `class="language-${language}"` // prism.js 根据 language 代码高亮
    : ''

  return `<code ${cssClass}>${childrenHtml}</code>`
}

// 覆盖 basic-module 中的 code to html
export const codeToHtmlConf = {
  type: 'code',
  elemToHtml: codeToHtml,
}
