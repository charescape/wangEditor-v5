/**
 * @description toolbar react component
 * @author wangfupeng
 */

import React, { useRef, useEffect } from 'react'
import { createToolbar, IToolbarConfig, IDomEditor } from 'wangeditor-editor-cattle'

interface IProps {
  editor: IDomEditor | null
  defaultConfig?: Partial<IToolbarConfig>
  mode?: string
}

function ToolbarComponent(props: IProps) {
  const { editor, defaultConfig = {}, mode = 'default' } = props
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current == null) return
    if (editor == null) return

    createToolbar({
      editor,
      toolbarSelector: ref.current,
      config: defaultConfig,
      mode,
    })
  }, [editor])

  return <div ref={ref}></div>
}

export default ToolbarComponent
