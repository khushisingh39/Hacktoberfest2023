import { Box } from '@chakra-ui/react'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

import React, { type ReactElement, useEffect, useRef } from 'react'
import { basicSetup, EditorView } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { barf, noctisLilac } from 'thememirror'
import { syntaxHighlighting } from '@codemirror/language'
import customKeymap from '~/components/Editor/customKeymap'
import { sampleNote } from '~/components/Editor/sampleNote'

import { useCustomTheme } from '~/hooks/useCustomTheme/useCustomTheme'

import { ThemeType } from '~/config/allThemes'
import { customSyntaxHighlighting } from '~/components/Editor/customSyntaxHighlighting'

interface EditorProps {
  _onInit?: (_: EditorView) => void
  _onUpdate?: () => void
}

const Editor = ({
  _onInit = (_: EditorView) => {},
  _onUpdate = () => {},
}: EditorProps): ReactElement => {
  const editorRef = useRef<HTMLDivElement>(null)
  const {
    theme: { type: themeType },
  } = useCustomTheme()

  useEffect(() => {
    const view = new EditorView({
      state: EditorState.create({
        doc: sampleNote,
        extensions: [
          basicSetup,
          markdown({
            base: markdownLanguage,
            codeLanguages: languages,
          }),
          syntaxHighlighting(customSyntaxHighlighting()),
          customKeymap,
          themeType === ThemeType.Dark ? barf : noctisLilac,
          EditorView.theme({
            '&': {
              height: '100%',
            },
            '&.cm-focused .cm-activeLine': {
              backgroundColor: 'transparent !important',
            },
          }),
        ],
      }),
      parent: editorRef.current as HTMLDivElement,
    })
    if (editorRef.current !== null) {
      _onInit(view)
    }
    return () => {
      view.destroy()
    }
  }, [themeType])

  return <Box w="100%" h="100%" ref={editorRef}></Box>
}

export default Editor
