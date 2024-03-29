import React, { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Select from 'react-select'
import useLocalStorage from '../hooks/useLocalStorage'
import Editor from './Editor'
import Navbar from './Navbar'


const HOST = 'https://afdevs.ddns.net';
//const HOST = 'http://localhost:8080';

var REST_ENDPOINT_RUN = HOST + '/api/v1/java_code';
var REST_ENDPOINT_TEST_CASES = HOST + '/api/v1/java_test_cases';
var REST_ENDPOINT_LOAD = HOST + '/api/v1/load_case';
const WS_URL = HOST + '/ws-endpoint';

const pathSession = window.location.href.split('/')[3]
const testCase = window.location.href.split('/')[4]
const PREFIX = 'apex-code-challenge-' + pathSession +"-"+ testCase

const socket = new SockJS(WS_URL);
const stompClient = Stomp.over(socket);

const callPOST = async (endpoint, body, type) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    body: body,
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  const jsonResponse = await response.json()
  if(type === "result"){
    return jsonResponse["result"] + " in " + jsonResponse["duration"] + " ms\n\n" + jsonResponse["output"];
  }
  if(type === "load"){
    return jsonResponse
  }
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
  const [text, setText] = useLocalStorage('text', `See the code challenge here`)
  const [java] = useLocalStorage('java', `public class Main {
    public static void main (String[] args) {
        System.out.print("Hello World from Java!");
    }
  }`
  )
  const [initialState, setInitialState] = useLocalStorage('initialState', true)
  const [python] = useLocalStorage('python',`print("Hello World from Python")`)
  const [code, setCode] = useLocalStorage('code', java)
  const [inputValue, setInputValue] = useLocalStorage('input', "Put your input values here");
  const [selectedOption, setSelectedOption] = useState({ label: 'Java 21', value: "java", displayName: 'Main.java', language: 'text/x-java' });
  const options = [
    { label: 'Java 21', value: "java", displayName: 'Main.java', language: 'text/x-java' },
    { label: 'Python 3', value: "python", displayName: 'Main.py', language: 'python' }
  ]

  document.addEventListener('visibilitychange', handleVisibilityChange);
  document.addEventListener('mouseleave', handleVisibilityChange);
  document.addEventListener("copy", handleCopyData);

  function loadTestCase(){
    if(testCase !== undefined && initialState){
      let body = JSON.stringify({
        session_id: pathSession,
        case_id: testCase,
        user_name: ""
      })
      setInitialState(false)
      callPOST(REST_ENDPOINT_LOAD, body, "load").then(result => {
        setCode(atob(result["code_starter"]))
        setText(atob(result["description"]))
        setInputValue(atob(result["input_values"]))
      });
    }
  }

  function setSelectedOptions(value){
    if(value.label === 'Java 21'){
      REST_ENDPOINT_RUN = HOST + '/api/v1/java_code'
      setCode(java)
    } else if(value.label === 'Python 3'){
      REST_ENDPOINT_RUN = HOST + '/api/v1/python_code'
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
          primary25: 'silver',
          primary: 'black',
        },
      })}
    />
  )

  function connectWS() {
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/reply-'+ pathSession +"-"+ testCase, (msg) => {
        let chat = JSON.parse(msg.body);
        if(socket._transport.unloadRef !== chat.from){
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
    stompClient.send("/topic/reply-"+ pathSession +"-"+ testCase, {}, JSON.stringify(quote));
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
    let body = JSON.stringify({
      code: btoa(JSON.parse(localStorage.getItem(PREFIX + "code"))),
      session_id: pathSession,
      case_id: testCase,
      input_values: btoa(JSON.parse(localStorage.getItem(PREFIX + "input")))
    })
    callPOST(REST_ENDPOINT_RUN, body, "result").then(result => {
      onChangeUpdate(result, "Console", setApiResponse)
    });
  }

  function callTestCasesAPI () {
    let body = JSON.stringify({
      code: btoa(JSON.parse(localStorage.getItem(PREFIX + "code"))),
      session_id: pathSession,
      case_id: testCase,
      input_values: btoa(JSON.parse(localStorage.getItem(PREFIX + "input")))
    })
    callPOST(REST_ENDPOINT_TEST_CASES, body, "result").then(result => {
      onChangeUpdate(result, "Test Cases", setCasesValue)
    });
  }

  function handleVisibilityChange() {
    if (document.hidden) {
        console.log('Candidate left the Tab');
    } else {
        console.log('Candidate came back the Tab');
    }
  };

  function handleCopyData() {
    const selection = document.getSelection();
    console.log(selection.toString());
  };

  connectWS();
  loadTestCase();

  return (
    <>
    <Navbar />
    <div className="pane top-pane">
      <PanelGroup autoSaveId="save" direction="horizontal">
        <Panel className="pane top-pane" minSize={10} defaultSizePercentage={50}>
          <Editor
              language="powershell"
              displayName="Text"
              lineNumbers={false}
              value={text}
              onChange={(e) => onChangeFunc(e, "Text", setText)}
              theme="dracula"
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
              theme="material-darker"
            />
        </Panel>
        <PanelResizeHandle />
        <Panel className={testCase !== undefined? "":"pane top-pane"} defaultSizePercentage={25} minSize={10}>
          {testCase !== undefined? (
            <>
            <PanelGroup direction="vertical">
              <Panel className="pane " minSize={10} defaultSizePercentage={33}>
                <Editor
                    language="powershell"
                    displayName="Console"
                    lineNumbers={false}
                    funtion={callRunAPI}
                    value={apiResponse}
                    onChange={(e) => onChangeFunc(e, "Console", setApiResponse)}
                    theme="3024-night"
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
                    theme="3024-night"
                  />
              </Panel>
              <PanelResizeHandle />
              <Panel className="pane vertical-pane" minSize={10} defaultSizePercentage={33}>
                <Editor
                    language="powershell"
                    displayName="Test Cases"
                    lineNumbers={false}
                    value={casesValue}
                    funtion={callTestCasesAPI}
                    onChange={(e) => onChangeFunc(e, "Test Cases", setCasesValue)}
                    theme="3024-night"
                  />
              </Panel>
            </PanelGroup>
          </>
          ):(
            <>
              <Editor
                language="powershell"
                displayName="Console"
                lineNumbers={false}
                funtion={callRunAPI}
                value={apiResponse}
                onChange={(e) => onChangeFunc(e, "Console", setApiResponse)}
                theme="3024-night"
              />
            </>
          )}
        </Panel>
      </PanelGroup>
    </div>
    </>
  )
}




export default App;
