import React, { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Select from 'react-select'
import useLocalStorage from '../hooks/useLocalStorage'
import Editor from './Editor'
import Navbar from './Navbar'


//const HOST = 'https://afdevs.ddns.net';
const HOST = 'http://localhost:8080';

var REST_ENDPOINT = HOST + '/api/v1/javaCode';
const WS_URL = HOST + '/ws-endpoint';

const pathSession = window.location.href.split('/')[3]

const socket = new SockJS(WS_URL);
const stompClient = Stomp.over(socket);

const callPOST = async () => {
  const response = await fetch(REST_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      code: btoa(JSON.parse(localStorage.getItem('apex-code-challenge-' + pathSession + "code"))),
      session_id: pathSession,
      case_id: 545,
      input_values: btoa(JSON.parse(localStorage.getItem('apex-code-challenge-' + pathSession + "input")))
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  const jsonResponse = await response.json()
  return jsonResponse["result"] + " in " + jsonResponse["duration"] + " ms\n\nOutput: \n" + jsonResponse["output"];
};

function redirect(){
  if(pathSession === ""){
    let path = (Math.random() + 1).toString(36).substring(2);
    window.location.replace(window.location.href+path);
  }
}

function App() {
  redirect();
  const [apiResponse, setApiResponse] = useState("Run your code and see the result here");
  //const [inputValue, setInputValue] = useState("Put your input values here");
  const [casesValue, setCasesValue] = useState("See the cases results here");
  const [text, setText] = useLocalStorage('text', `You'll see the code challenge here`)
  const [java] = useLocalStorage('java', `public class Main {
    public static void main (String[] args) {
        System.out.print("Hello World from Java!");
    }
  }`
  )
  const [python] = useLocalStorage('python',`print("Hello World from Python")`)
  const [code, setCode] = useLocalStorage('code', java)
  const [inputValue, setInputValue] = useLocalStorage('input', "Put your input values here");

  const [selectedOption, setSelectedOption] = useState({ label: 'Java 21', value: "java", displayName: 'Main.java', language: 'text/x-java' });

  const options = [
    { label: 'Java 21', value: "java", displayName: 'Main.java', language: 'text/x-java' },
    { label: 'Python 3', value: "python", displayName: 'Main.py', language: 'python' }
  ]

  function setSelectedOptions(value){
    if(value.label === 'Java 21'){
      REST_ENDPOINT = HOST + '/api/v1/javaCode'
      setCode(java)
    } else if(value.label === 'Python 3'){
      REST_ENDPOINT = HOST + '/api/v1/pythonCode'
      setCode(python)
    }
    setSelectedOption(value)
  }
  
  const langSelector = () => (
    <Select 
      defaultValue={{ label: 'Java 21'}}
      options={options} 
      onChange={setSelectedOptions}
      theme={(theme) => ({
        ...theme,
        colors: {
          primary: 'black',
        },
      })}
    />
  )

  function connectWS() {
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/reply-'+ pathSession, (msg) => {
        let chat = JSON.parse(msg.body);
        if(socket._transport.unloadRef !== chat.from){
          console.log(chat)
          if (chat.type === "Code"){
            setCode(chat.message)
          } else if (chat.type === "Text"){
            setText(chat.message)
          } else if (chat.type === "Console"){
            setApiResponse(chat.message)
          } else if (chat.type === "Input"){
            setInputValue(chat.message)
          } else if (chat.type === "Test Cases"){
            setCasesValue(chat.message)
          }
        }
      });
    });
  }

  function onChangeUpdate(value, type, functionSet) {
    var quote = {message: value, type: type, from: socket._transport.unloadRef};
    stompClient.send("/topic/reply-"+ pathSession, {}, JSON.stringify(quote));
    functionSet(value)
  }

  const onChangeFunc = (value, displayName, functionSet) => {
    onChangeUpdate(value, displayName, functionSet)
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
    }, 250)
    return () => clearTimeout(timeout)
  }, [text, code])

  function callRunAPI () {
    callPOST().then(result => {
      onChangeUpdate(result, "Console", setApiResponse)
    });
  }

  connectWS();

  return (
    <>
    <Navbar />
    <div className="pane top-pane">
      <PanelGroup autoSaveId="save" direction="horizontal">
        <Panel className="pane top-pane" minSize={10} defaultSizePercentage={50}>
          <Editor
              language="xml"
              displayName="Text"
              lineNumbers={false}
              value={text}
              onChange={(e) => onChangeFunc(e, "Text", setText)}
            />
        </Panel>
        <PanelResizeHandle />
        <Panel className="pane top-pane" minSize={10}>
          <Editor
              language={selectedOption.language}
              displayName={selectedOption.displayName}
              lineNumbers={true}
              value={code}
              funtion={langSelector}
              onChange={(e) => onChangeFunc(e, "Code", setCode)}
            />
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSizePercentage={25}>
          <PanelGroup direction="vertical">
            <Panel className="pane " minSize={10} defaultSizePercentage={33}>
              <Editor
                  language="powershell"
                  displayName="Console"
                  lineNumbers={false}
                  funtion={callRunAPI}
                  value={apiResponse}
                  onChange={(e) => onChangeFunc(e, "Console", setApiResponse)}
                />
            </Panel>
            <PanelResizeHandle className="resizer"/>
            <Panel className="pane vertical-pane" minSize={10} defaultSizePercentage={33}>
              <Editor
                  language="powershell"
                  displayName="Input"
                  lineNumbers={false}
                  value={inputValue}
                  onChange={(e) => onChangeFunc(e, "Input", setInputValue)}
                />
            </Panel>
            <PanelResizeHandle />
            <Panel className="pane vertical-pane" minSize={10} defaultSizePercentage={33}>
              <Editor
                  language="powershell"
                  displayName="Test Cases"
                  lineNumbers={false}
                  value={casesValue}
                  onChange={(e) => onChangeFunc(e, "Test Cases", setCasesValue)}
                />
            </Panel>
          </PanelGroup>;
        </Panel>
      </PanelGroup>
    </div>
    </>
  )
}

export default App;
