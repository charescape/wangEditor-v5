/**
 * @description insert video menu
 * @author wangfupeng
 */

import { Transforms, Range, Node } from 'slate'
import {
  IModalMenu,
  IDomEditor,
  DomEditor,
  genModalInputElems,
  genModalButtonElems,
} from 'wangeditor-core'
import $, { Dom7Array } from '../../utils/dom'
import { genRandomStr } from '../../utils/util'
import { VIDEO_SVG } from '../../constants/svg'
import { VideoElement } from '../custom-types'

/**
 * 生成唯一的 DOM ID
 */
function genDomID(): string {
  return genRandomStr('w-e-insert-video')
}

class InsertVideoMenu implements IModalMenu {
  readonly title = '插入视频'
  readonly iconSvg = VIDEO_SVG
  readonly tag = 'button'
  readonly showModal = true // 点击 button 时显示 modal
  readonly modalWidth = 300
  private $content: Dom7Array | null = null
  private readonly srcInputId = genDomID()
  private readonly buttonId = genDomID()

  getValue(editor: IDomEditor): string | boolean {
    // 插入菜单，不需要 value
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 任何时候，都不用激活 menu
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    // 点击菜单时，弹出 modal 之前，不需要执行其他代码
    // 此处空着即可
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return true
    if (!Range.isCollapsed(selection)) return true // 选区非折叠，禁用

    return false
  }

  getModalPositionNode(editor: IDomEditor): Node | null {
    return null // modal 依据选区定位
  }

  getModalContentElem(editor: IDomEditor): Dom7Array {
    const { srcInputId, buttonId } = this

    // 获取 input button elem
    const [$srcContainer, $inputSrc] = genModalInputElems(
      '视频地址',
      srcInputId,
      'mp4 网址，或第三方 <iframe>...'
    )
    const [$buttonContainer] = genModalButtonElems(buttonId, '确定')

    if (this.$content == null) {
      // 第一次渲染
      const $content = $('<div></div>')

      // 绑定事件（第一次渲染时绑定，不要重复绑定）
      $content.on('click', `#${buttonId}`, e => {
        e.preventDefault()
        const src = $(`#${srcInputId}`).val().trim()
        this.insertVideo(editor, src)
        editor.hidePanelOrModal() // 隐藏 modal
      })

      // 记录属性，重要
      this.$content = $content
    }

    const $content = this.$content
    $content.html('') // 先清空内容

    // append inputs and button
    $content.append($srcContainer)
    $content.append($buttonContainer)

    // 设置 input val
    $inputSrc.val('')

    // focus 一个 input（异步，此时 DOM 尚未渲染）
    setTimeout(() => {
      $(`#${srcInputId}`).focus()
    })

    return $content
  }

  private insertVideo(editor: IDomEditor, src: string) {
    if (!src) return

    // 还原选区
    editor.restoreSelection()

    if (this.isDisabled(editor)) return

    // 校验
    const { onInsertedVideo, checkVideo } = editor.getMenuConfig('insertVideo')
    const checkRes = checkVideo(src)
    if (typeof checkRes === 'string') {
      // 校验失败，给出提示
      editor.alert(checkRes, 'error')
      return
    }
    if (checkRes == null) {
      // 校验失败，不给提示
      return
    }

    // 新建一个 video node
    const video: VideoElement = {
      type: 'video',
      src,
      children: [{ text: '' }], // 【注意】void node 需要一个空 text 作为 children
    }

    // 插入图片
    Transforms.insertNodes(editor, video)

    // 调用 callback
    onInsertedVideo(src)
  }
}

export default InsertVideoMenu
