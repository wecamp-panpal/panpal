import React, { useEffect, useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

type Props = {
  value?: string;
  onChange?: (html: string) => void;
};

export default function DescriptionEditor({ value = '', onChange }: Props) {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: ['textStyle'] }),
      TextStyle,
      Underline,
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
        codeBlock: {},
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
      Placeholder.configure({
        placeholder: 'Type your description...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const onPickImage = () => fileRef.current?.click();
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result || '');
      editor?.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(f);
    e.target.value = '';
  };

  const btn = (active?: boolean): React.CSSProperties =>
    ({
      border: 'none',
      background: active ? '#e6d2b7' : 'transparent',
      color: '#391F06',
      padding: '6px 8px',
      borderRadius: 6,
      cursor: 'pointer',
    } as const);

  const sep: React.CSSProperties = {
    height: 20,
    width: 1,
    background: '#e6d2b7',
    alignSelf: 'center',
  };

  const blockValue = useMemo(() => {
    if (!editor) return 'paragraph';
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    return 'paragraph';
  }, [editor?.state]);

  if (!editor) return null;

  return (
    <Box
      sx={{
        background: '#f5e2cc',
        border: '1.5px solid #391F06',
        borderRadius: 2,

        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          background: '#f5e2cc',
          color: '#391F06',
          p: '6px 10px',
          display: 'flex',
          gap: 1.5,
          flexWrap: 'wrap',
          alignItems: 'center',
          borderBottom: '1.5px solid #e6d2b7',
        }}
      >
        <button title="Undo" style={btn()} onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </button>
        <button title="Redo" style={btn()} onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </button>
        <select
          title="Normal text / Heading"
          value={blockValue}
          onChange={e => {
            const v = e.target.value;
            const chain = editor.chain().focus();
            if (v === 'paragraph') chain.setParagraph().run();
            else if (v === 'h1') chain.toggleHeading({ level: 1 }).run();
            else if (v === 'h2') chain.toggleHeading({ level: 2 }).run();
            else if (v === 'h3') chain.toggleHeading({ level: 3 }).run();
          }}
          style={{
            background: 'transparent',
            color: '#391F06',
            padding: '4px 8px',
            borderRadius: 6,
            border: '1px solid #e6d2b7',
          }}
        >
          <option value="paragraph">Normal text</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button
            title="Bullet list"
            style={btn(editor.isActive('bulletList'))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            •
          </button>
          <button
            title="Ordered list"
            style={btn(editor.isActive('orderedList'))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1.
          </button>
        </div>
        <input
          type="color"
          title="Text color"
          onChange={e => (editor.chain() as any).focus().setColor(e.target.value).run()}
          style={{
            width: 20,
            height: 20,
            border: '1px solid #e6d2b7',
            borderRadius: 4,
            background: 'transparent',
            padding: 0,
          }}
        />
        <button
          title="Bold"
          style={btn(editor.isActive('bold'))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <b>B</b>
        </button>
        <button
          title="Italic"
          style={btn(editor.isActive('italic'))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </button>
        <button
          title="Underline"
          style={btn(editor.isActive('underline'))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <u>U</u>
        </button>
        <button
          title="Strike"
          style={btn(editor.isActive('strike'))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          S
        </button>
        <button
          title="Inline code"
          style={btn(editor.isActive('code'))}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          {'</>'}
        </button>
        <button
          title="Code block"
          style={btn(editor.isActive('codeBlock'))}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {'</'}
          <span style={{ letterSpacing: -2 }} />
          {'>'}
        </button>
        <button
          title="Insert link"
          style={btn(editor.isActive('link'))}
          onClick={() => {
            const prev = editor.getAttributes('link').href as string | undefined;
            const url = window.prompt('Enter URL', prev || 'https://');
            if (url === null) return;
            if (url === '') editor.chain().focus().extendMarkRange('link').unsetLink().run();
            else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }}
        >
          🔗
        </button>
        <button title="Insert image" style={btn()} onClick={onPickImage}>
          🖼️
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
        <button
          title="Blockquote"
          style={btn(editor.isActive('blockquote'))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          “ ”
        </button>
        <button
          title="Horizontal rule"
          style={btn()}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ─
        </button>
        <div style={sep} />
        <button
          title="Align left"
          style={btn(editor.isActive({ textAlign: 'left' }))}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          ⟸
        </button>
        <button
          title="Align center"
          style={btn(editor.isActive({ textAlign: 'center' }))}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          ≡
        </button>
        <button
          title="Align right"
          style={btn(editor.isActive({ textAlign: 'right' }))}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          ⟹
        </button>
        <div style={sep} />
        <button
          title="Clear formatting"
          style={btn()}
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          Clear
        </button>
      </Box>
      <EditorContent
        editor={editor}
        style={{
          minHeight: 240,
          padding: '6px 16px 16px 16px', 
          color: '#391F06',
          fontFamily: 'Playfair Display, Poppins, system-ui, sans-serif',
          outline: 'none',
          background: '#f5e2cc',
        }}
      />
    </Box>
  );
}
