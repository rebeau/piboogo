import { useMemo, useCallback } from 'react';
import { Editor, Transforms } from 'slate';
import { useSlate } from 'slate-react';

// 스타일을 토글하는 버튼
const MarkButton = ({ format, children }) => {
  const editor = useSlate();

  const isActive = useMemo(() => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  }, [editor, format]);

  const toggleMark = () => {
    Transforms.toggleMark(editor, format);
  };

  return (
    <button
      onClick={toggleMark}
      style={{
        color: isActive ? 'black' : 'gray',
      }}
    >
      {children}
    </button>
  );
};

const Toolbar = () => (
  <div>
    <MarkButton format="bold">Bold</MarkButton>
    <MarkButton format="italic">Italic</MarkButton>
    <MarkButton format="underline">Underline</MarkButton>
  </div>
);

export default Toolbar;
