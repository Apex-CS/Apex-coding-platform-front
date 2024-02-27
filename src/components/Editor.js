import React from 'react';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-darker.css'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/powershell/powershell'
import 'codemirror/mode/python/python'
import "codemirror/addon/hint/show-hint";
import { Controlled as ControlledEditor } from 'react-codemirror2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

export default function Editor(props) {
  
  const {
    language,
    displayName,
    value,
    onChange,
    lineNumbers,
    funtion
  } = props
  

  function handleChange(editor, data, value) {
    if(displayName !== "Console"){
      onChange(value)
    }
  }

  function isConsole(funtion){
   if(displayName === "Console"){
      return(
        <button
          type="button"
          className="run-btn"
          onClick={() => funtion()}
          > 
          <FontAwesomeIcon icon={faPlay} /> Run Code
        </button>
      )
    }
    else if(displayName.includes("Main")){
      return(
        funtion()
      )
    }
  }

  return (
    <div className={"editor-container"}>
      <div className="editor-title">
        {displayName}{isConsole(funtion)}
      </div>
      <ControlledEditor
        onBeforeChange={handleChange}
        value={value}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          lint: true,
          mode: language,
          matchBrackets: true,
          theme: 'material-darker',
          lineNumbers: lineNumbers,
          indentWithTabs: true,
          autocomplete: true,
          smartIndent: true,
          autofocus: true,
        }}
      />
    </div>
  )
}

