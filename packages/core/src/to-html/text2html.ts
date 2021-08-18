/**
 * @description text -> html
 * @author wangfupeng
 */

import { Text } from 'slate'
import { IDomEditor } from '../editor/interface'
import { DomEditor } from '../editor/dom-editor'
import { TEXT_TO_HTML_FN_LIST, TEXT_STYLE_TO_HTML_FN_LIST } from './index'

function replaceSymbols(str: string) {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/®/g, '&reg;')
    .replace(/©/g, '&copy;')
    .replace(/™/g, '&trade;')
}

function textToHtml(textNode: Text, editor: IDomEditor): string {
  const { text } = textNode
  if (text == null) throw new Error(`Current node is not slate Text ${JSON.stringify(textNode)}`)
  let textHtml = text

  // 替换特殊字符
  textHtml = replaceSymbols(textHtml)

  // 替换 \n 为 <br> （一定要在替换特殊字符之后）
  const parents = DomEditor.getParentsNodes(editor, textNode)
  const hasPre = parents.some(p => DomEditor.getNodeType(p) === 'pre') // 上级节点中，是否存在 <pre>
  // 在 <pre> 标签不替换，其他都替换
  if (!hasPre) {
    textHtml = textHtml.replace(/\n|\r/g, '<br/>')
  }

  // 生成 text -> html
  TEXT_TO_HTML_FN_LIST.forEach(fn => (textHtml = fn(textNode, textHtml, editor)))

  // 增加文本样式，如 color bgColor
  TEXT_STYLE_TO_HTML_FN_LIST.forEach(fn => (textHtml = fn(textNode, textHtml)))

  return textHtml
}

export default textToHtml
