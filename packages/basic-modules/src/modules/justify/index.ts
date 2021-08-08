/**
 * @description justify module entry
 * @author wangfupeng
 */

import { IModuleConf } from 'wangeditor-core'
import { renderTextStyle } from './render-text-style'
import { textStyleToHtml } from './text-style-to-html'
import { justifyLeftMenuConf, justifyRightMenuConf, justifyCenterMenuConf } from './menu/index'

const justify: Partial<IModuleConf> = {
  renderTextStyle,
  textStyleToHtml,
  menus: [justifyLeftMenuConf, justifyRightMenuConf, justifyCenterMenuConf],
}

export default justify
