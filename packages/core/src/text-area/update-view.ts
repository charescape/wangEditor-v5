/**
 * @description patch textarea view
 * @author wangfupeng
 */

import { h, VNode } from 'snabbdom'
import { IDomEditor } from '../editor/interface'
import { DomEditor } from '../editor/dom-editor'
import TextArea from './TextArea'
import { genPatchFn, normalizeVnodeData } from '../utils/vdom'
import $, { Dom7Array } from '../utils/dom'
import { node2Vnode } from '../formats/node2Vnode'
import {
  IS_FIRST_PATCH,
  TEXTAREA_TO_PATCH_FN,
  TEXTAREA_TO_VNODE,
  EDITOR_TO_ELEMENT,
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE,
} from '../utils/weak-maps'

function genElemId(id: number) {
  return `w-e-textarea-${id}`
}

/**
 * 生成编辑区域节点的 vnode
 * @param elemId elemId
 * @param readOnly readOnly
 */
function genRootVnode(elemId: string, readOnly = false): VNode {
  return h(`div#${elemId}`, {
    props: {
      contentEditable: readOnly ? false : true,
      suppressContentEditableWarning: true,
    },
    datasets: {
      slateEditor: true, // data-slate-editor
      slateNode: 'value', // data-slate-node
    },
  })
}

/**
 * 生成编辑区域的 elem
 * @param elemId elemId
 * @param readOnly readOnly
 */
function genRootElem(elemId: string, readOnly = false): Dom7Array {
  const contentEditableAttr = readOnly ? '' : 'contenteditable="true"'
  return $(`<div
        id="${elemId}"
        ${contentEditableAttr}
        data-slate-editor
        data-slate-node="value"
        suppressContentEditableWarning
    ></div>`)
}

/**
 * 获取 editor.children 渲染 DOM
 * @param textarea textarea
 * @param editor editor
 */
function updateView(textarea: TextArea, editor: IDomEditor) {
  const $scroll = textarea.$scroll
  const elemId = genElemId(textarea.id)
  const { readOnly, autoFocus } = editor.getConfig()

  // 生成 newVnode
  const newVnode = genRootVnode(elemId, readOnly)
  const content = editor.children || []
  newVnode.children = content.map((node, i) => {
    let vnode = node2Vnode(node, i, editor, editor)
    normalizeVnodeData(vnode) // 整理 vnode.data 以符合 snabbdom 的要求
    return vnode
  })

  let textareaElem
  let isFirstPatch = IS_FIRST_PATCH.get(textarea)
  if (isFirstPatch == null) isFirstPatch = true // 尚未赋值，也是第一次
  if (isFirstPatch) {
    // 第一次 patch ，先生成 elem
    const $textArea = genRootElem(elemId, readOnly)
    $scroll.append($textArea)
    textarea.$textArea = $textArea // 存储下编辑区域的 DOM 节点
    textareaElem = $textArea[0]

    // 再生成 patch 函数，并执行
    const patchFn = genPatchFn()
    patchFn(textareaElem, newVnode)

    // 存储相关信息
    IS_FIRST_PATCH.set(textarea, false) // 不再是第一次 patch
    TEXTAREA_TO_PATCH_FN.set(textarea, patchFn) // 存储 patch 函数
  } else {
    // 不是第一次 patch
    const curVnode = TEXTAREA_TO_VNODE.get(textarea)
    const patchFn = TEXTAREA_TO_PATCH_FN.get(textarea)
    if (curVnode == null || patchFn == null) return

    patchFn(curVnode, newVnode)
  }

  if (textareaElem == null) {
    textareaElem = document.getElementById(elemId)

    // 通过 getElementById 获取的有可能是 null （销毁、重建时，可能会发生这种情况）
    if (textareaElem == null) return
  }

  // focus
  let isFocused
  if (isFirstPatch) {
    // 初次渲染
    isFocused = autoFocus
  } else {
    // 非初次渲染
    isFocused = DomEditor.isFocused(editor)
  }
  if (isFocused) {
    textareaElem.focus({
      preventScroll: true, // 必须添加 preventScroll 选项，否则弹窗或者编辑器失焦会导致编辑区域自动滚动到顶部
    })
  }

  // 存储相关信息
  TEXTAREA_TO_VNODE.set(textarea, newVnode) // 存储 vnode
  EDITOR_TO_ELEMENT.set(editor, textareaElem) // 存储 editor -> elem 对应关系
  NODE_TO_ELEMENT.set(editor, textareaElem)
  ELEMENT_TO_NODE.set(textareaElem, editor)
}

export default updateView
