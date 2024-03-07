import React from 'react';

import { createEditor } from 'slate';
import {
  Editable,
  Slate,
} from 'slate-react';

const MyEditor = () => {
  const editor =
    createEditor();

  const initialDocument =  {
    children: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'A line of text!',
          },
        ],
      },
    ],
  }

  return (
    <>
      <div>Editor</div>
      <Slate
        editor={editor}
        value={
          initialDocument
        }>
        <Editable />
      </Slate>
    </>
  );
};

export default MyEditor;