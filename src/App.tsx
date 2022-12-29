import {useState} from 'react';

type Message = {
  clientId: string,
  content: string
}

function App() {

  const [ws, setWs] = useState<any>({})
  const [clientId, setClientId] = useState("")
  const [onlineNum, setOnlineNum] = useState(0)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const handleMessage = (e : React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);
  
  const openConnection = () => {
    const protocol = window.location.protocol.includes('https') ? 'wss': 'ws'
    const connection = new WebSocket(`${protocol}://localhost:9090`)
    setWs(connection)    
  }
  ws.onopen = () => console.log("openeeeed")
  ws.onclose = () => {
    console.log("closeeee")
    setOnlineNum(0)
  }
  ws.onmessage = (msg:any) => {
    const response = JSON.parse(msg.data);
    console.log(response);

    if(response.method === "connect"){
      setClientId(response.clientId)
    }

    if(response.method === "details"){
      setOnlineNum(response.onlineNum)
    }

    if(response.method === "sendMessages" || response.method === "connect"){
      setMessages(response.content)
    }
  }

  const handleSubmit = () => {
    const payLoad = {
      "method": "newMessage",
      "clientId": clientId,
      "content": message
    }
    ws.send(JSON.stringify(payLoad))
    setMessage("")
  }

  const deleteMessage = () => {
    const payLoad = {
      "method": "deleteMessage",
      "clientId": clientId,
      "content": message
    }
    ws.send(JSON.stringify(payLoad))
  }
  
 

  return (
    <div className="App">
      {messages && messages.map(msg => {
        return (
          <div key={msg.content}>
          <span>{msg.content}</span>
          {msg.clientId === clientId && <button onClick={deleteMessage}>delete</button>}
          </div>
        )
      })}
      <input type="text" name="messages" id="messages" value={message} onChange={handleMessage}/>
      <button onClick={handleSubmit}>Send Message</button>
      <button onClick={() => ws.close()}>close connection</button>
      <button onClick={openConnection}>open connection</button>
      {onlineNum ? <p>Online: {onlineNum}</p> : null}
    </div>
  );
}

export default App;
