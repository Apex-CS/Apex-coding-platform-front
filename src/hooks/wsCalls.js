import React, { useState } from "react";
import { useSubscription, useStompClient, StompSessionProvider } from "react-stomp-hooks"
const WS_URL = 'http://localhost:8080/ws-endpoint';

function App() {
}

export default App;

export function SendingMessages() {
    console.log("sending" + input)
    const [input, setInput] = useState("");
    const stompClient = useStompClient();
    //useSubscription("/app/broadcast", (message) => setLastMessage(message.body));
    console.log("sending" + input)
    const sendMessage = () => {
        if(stompClient) {
          //Send Message
          stompClient.publish({
            destination: "/app/broadcast",
            body: "Echo " + input
          });
        }
        else {
          //Handle error
        }
    };
   
}