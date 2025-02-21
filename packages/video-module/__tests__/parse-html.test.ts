/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../tests/utils/create-editor'
import { preParseHtmlConf } from '../src/module/pre-parse-html'
import { parseHtmlConf } from '../src/module/parse-elem-html'

describe('video - pre parse html', () => {
  it('iframe', () => {
    const $iframe = $('<iframe></iframe>')

    // match selector
    expect($iframe[0].matches(preParseHtmlConf.selector)).toBeTruthy()

    // pre parse
    const res = preParseHtmlConf.preParseHtml($iframe[0])
    expect(res.outerHTML).toBe(
      '<div data-w-e-type="video" data-w-e-is-void=""><iframe></iframe></div>'
    )
  })

  it('video', () => {
    const $video = $('<video></video>')

    // match selector
    expect($video[0].matches(preParseHtmlConf.selector)).toBeTruthy()

    // pre parse
    const res = preParseHtmlConf.preParseHtml($video[0])
    expect(res.outerHTML).toBe(
      '<div data-w-e-type="video" data-w-e-is-void=""><video></video></div>'
    )
  })
})

describe('video - parse html', () => {
  const editor = createEditor()

  it('iframe', () => {
    const iframeHtml = '<iframe src="xxx"></iframe>'
    const $container = $(`<div data-w-e-type="video" data-w-e-is-void>${iframeHtml}</div>`)

    // match selector
    expect($container[0].matches(parseHtmlConf.selector)).toBeTruthy()

    // parse
    expect(parseHtmlConf.parseElemHtml($container[0], [], editor)).toEqual({
      type: 'video',
      src: iframeHtml,
      children: [{ text: '' }], // void 元素有一个空 text
    })
  })

  it('video', () => {
    const src = 'xxx.mp4'
    const videoHtml = `<video><source src="${src}"/></video>`
    const $container = $(`<div data-w-e-type="video" data-w-e-is-void>${videoHtml}</div>`)

    // match selector
    expect($container[0].matches(parseHtmlConf.selector)).toBeTruthy()

    // parse
    expect(parseHtmlConf.parseElemHtml($container[0], [], editor)).toEqual({
      type: 'video',
      src,
      children: [{ text: '' }], // void 元素有一个空 text
    })
  })
})
