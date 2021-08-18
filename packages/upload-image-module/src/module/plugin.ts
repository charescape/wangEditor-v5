/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/core'
import { isMenuDisabled } from './helper'
import uploadFiles from './upload-files'

function withUploadImage<T extends IDomEditor>(editor: T): T {
  const { insertData } = editor
  const newEditor = editor

  // 重写 insertData - 粘贴图片、拖拽上传图片
  newEditor.insertData = (data: DataTransfer) => {
    if (isMenuDisabled(newEditor)) {
      insertData(data)
      return
    }

    // 获取文件
    const { files } = data
    if (files.length <= 0) {
      insertData(data)
      return
    }

    // 判断是否有图片文件（可能是其他类型的文件）
    const fileList = Array.prototype.slice.call(files)
    let _hasImageFiles = fileList.some(file => {
      const [mime] = file.type.split('/')
      return mime === 'image'
    })

    if (_hasImageFiles) {
      // 有图片文件，则上传图片
      uploadFiles(editor, files)
    } else {
      // 如果没有， 则继续 insertData
      insertData(data)
    }
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withUploadImage
