/**
 * @description insert divider menu
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor } from 'wangeditor-core'
import { DIVIDER_SVG } from '../../../constants/icon-svg'
import { DividerElement } from '../custom-types'

class InsertDividerMenu implements IButtonMenu {
  readonly title = '分割线'
  readonly iconSvg = DIVIDER_SVG
  readonly tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 不需要 active
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return true

    const selectedNode = DomEditor.getSelectedNodeByType(editor, 'divider')
    if (selectedNode) {
      // 当前选中了 divider node ，则禁用
      return true
    }
    return false
  }

  exec(editor: IDomEditor, value: string | boolean): void {
    const node: DividerElement = {
      type: 'divider',
      children: [{ text: '' }], // 【注意】void node 需要一个空 text 作为 children
    }

    Transforms.insertNodes(editor, node, { mode: 'highest' })
  }
}

export default InsertDividerMenu
