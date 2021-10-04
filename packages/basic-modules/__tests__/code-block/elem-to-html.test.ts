/**
 * @description code-block elem to html test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import { codeToHtmlConf, preToHtmlConf } from '../../src/modules/code-block/elem-to-html'

describe('code-block - elem to html', () => {
  const editor = createEditor()

  it('code to html', () => {
    expect(codeToHtmlConf.type).toBe('code')
    const elem = { type: 'code' }
    const html = codeToHtmlConf.elemToHtml(elem, 'hello', editor)
    expect(html).toBe('<code>hello</code>')
  })

  it('pre to html', () => {
    expect(preToHtmlConf.type).toBe('pre')
    const elem = { type: 'pre' }
    const html = preToHtmlConf.elemToHtml(elem, 'hello', editor)
    expect(html).toBe('<pre>hello</pre>')
  })
})
