import React, { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Select from 'react-select'
import useLocalStorage from '../hooks/useLocalStorage'
import Editor from './Editor'
import Navbar from './Navbar'


var REST_ENDPOINT = 'http://localhost:8080/api/v1/javaCode';
const WS_URL = 'http://localhost:8080/ws-endpoint';
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
  const [text, setText] = useLocalStorage('text', '')
  const [java, setJava] = useLocalStorage('java', 
  `public class Main {
    public static void main (String[] args) {
        System.out.print("Hello World from Java!");
    }
  }`
  )
  const [python, setPython] = useLocalStorage('python',`print("Hello World from Python")`)
  const [code, setCode] = useLocalStorage('code', java)

  const [selectedOption, setSelectedOption] = useState({ label: 'Java 21', value: "java", displayName: 'Main.java', language: 'text/x-java' });

  const options = [
    { label: 'Java 21', value: "java", displayName: 'Main.java', language: 'text/x-java' },
    { label: 'Python 3', value: "python", displayName: 'Main.py', language: 'python' }
  ]
  
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

  function setSelectedOptions(value){
    if(value.label === 'Java 21'){
      REST_ENDPOINT = 'http://localhost:8080/api/v1/javaCode'
      setCode(java)
    } else if(value.label === 'Python 3'){
      REST_ENDPOINT = 'http://localhost:8080/api/v1/pythonCode'
      setCode(python)
    }
    setSelectedOption(value)
  }

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
          }
        }
      });
    });
  }

  function onChangeUpdate(value, type, functionSet) {
    var quote = {message: value, type: type, from: socket._transport.unloadRef};
    stompClient.send("/topic/reply-"+ pathSession, {}, JSON.stringify(quote));
    console.log(value, type)
    functionSet(value)
  }

  function onChangeText(value) {
    onChangeUpdate(value, "Text", setText)
  }

  function onChangeCode(value) {
    onChangeUpdate(value, "Code", setCode)
  }

  function onChangeConsole(value) {
    onChangeUpdate(value, "Console", setApiResponse)
  }

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
              onChange={onChangeText}
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
              onChange={onChangeCode}
            />
        </Panel>
        <PanelResizeHandle />
        <Panel className="pane top-pane" minSize={10} defaultSizePercentage={25}>
          <Editor
              language="powershell"
              displayName="Console"
              lineNumbers={false}
              funtion={callRunAPI}
              value={apiResponse}
              onChange={onChangeConsole}
            />
        </Panel>
      </PanelGroup>
    </div>
    </>
  )
}

export default App;
