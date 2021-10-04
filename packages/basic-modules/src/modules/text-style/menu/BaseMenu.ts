/**
 * @description simply style base menu
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { isMenuDisabled } from '../helper'

abstract class BaseMenu implements IButtonMenu {
  abstract readonly mark: string
  abstract readonly title: string
  abstract readonly iconSvg: string
  abstract readonly hotkey: string
  readonly tag = 'button'

  /**
   * 获取：是否有 mark
   * @param editor editor
   */
  getValue(editor: IDomEditor): string | boolean {
    const mark = this.mark
    const [match] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => n[mark] === true,
    })
    return !!match
  }

  isActive(editor: IDomEditor): boolean {
    const isMark = this.getValue(editor)
    return !!isMark
  }

  isDisabled(editor: IDomEditor): boolean {
    return isMenuDisabled(editor, this.mark)
  }

  /**
   * 执行命令
   * @param editor editor
   * @param value 是否有 mark
   */
  exec(editor: IDomEditor, value: string | boolean) {
    const mark = this.mark
    if (value) {
      // 已，则取消
      editor.removeMark(mark)
    } else {
      // 没有，则执行
      editor.addMark(mark, true)
    }
  }
}

export default BaseMenu
