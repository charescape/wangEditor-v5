import { html } from 'dom7'
/**
 * @description paragraph - elem to html test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import { pToHtmlConf } from '../../src/modules/paragraph/elem-to-html'

describe('paragraph - elem to html', () => {
  const editor = createEditor()

  it('paragraph to html', () => {
    expect(pToHtmlConf.type).toBe('paragraph')

    const elem = { type: 'paragraph' }
    const html = pToHtmlConf.elemToHtml(elem, 'hello', editor)
    expect(html).toBe('<p>hello</p>')
  })
})
