import {useState} from 'react';
import Home from './components/Home';
import ChooseName from './components/ChooseName';
import moment from 'moment';

type Message = {
  clientId: string,
  content: string,
  messageId: string,
  date: string
}

type Client = {
  clientId: string,
  name: string
}

let randId = () => {
  let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4() + s4() + s4();
}

function App() {
 
  const [ws, setWs] = useState<any>({})
  const [clientId, setClientId] = useState("")
  const [onlineClients, setOnlineClients] = useState<Client[]>([])
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [clientName, setClientName] = useState("")
  const [toggleName, setToggleName] = useState(false)

  const handleMessage = (e : React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);
  const handleClientName = (e : React.ChangeEvent<HTMLInputElement>) => setClientName(e.target.value);
  const toggleClientName = () => {
    setToggleName(true);
    const payload = {
      "method": "setName",
      "clientId": clientId,
      "clientName": clientName
    }
    ws.send(JSON.stringify(payload))
  };
  
  const openConnection = () => {
    /* const protocol = window.location.protocol.includes('https') ? 'wss': 'ws' */
    const connection = new WebSocket(`${process.env.REACT_APP_API_URL}`)
    setWs(connection)    
  }
  ws.onopen = () => console.log("opened connection")
  ws.onclose = () => {
    console.log("closed connection")
    setOnlineClients([])
    setWs({})
    setToggleName(false)
  }

  ws.onmessage = (msg:any) => {
    const response = JSON.parse(msg.data);

    if(response.method === "connect"){
      setClientId(response.clientId) 
    }

    if(response.method === "details"){
      setOnlineClients(response.onlineClients)
    }

    if(response.method === "sendMessages" || response.method === "connect"){
      setMessages(response.content)
    }
  }

  const handleSubmit = () => {
    const payLoad = {
      "method": "newMessage",
      "clientId": clientId,
      "content": message,
      "messageId": randId(),
      "date": moment().format('MMM Do YYYY, h:mm:ss a')
    }
    ws.send(JSON.stringify(payLoad))
    setMessage("")
  }

  const deleteMessage = (id:string) => {
    const payLoad = {
      "method": "deleteMessage",
      "clientId": clientId,
      "content": message,
      "messageId": id
    }
    ws.send(JSON.stringify(payLoad))
  }
  
  return (
    <div>
      {!ws.url && <Home connect={openConnection}/>}
      {ws.url && !toggleName && <ChooseName clientName={handleClientName} saveName={toggleClientName} nameState={clientName}/>}
      {toggleName && messages && messages.map(msg => {
        return (
          <div key={msg.messageId}>
          <span>{msg.content}</span>
          {msg.clientId === clientId && <button onClick={() => deleteMessage(msg.messageId)}>delete</button>}
          <p>{msg.date}</p>
          </div>
        )
      })}
      {toggleName &&
        <div>
          <input type="text" name="messages" id="messages" value={message} onChange={handleMessage}/>
          <button onClick={handleSubmit}>Send Message</button>
          <button onClick={() => ws.close()}>close connection</button>
          {onlineClients ?
          <>
          <p>Online: {onlineClients.length}</p>
          {onlineClients.map(client => <p key={client.clientId}>{client.name}</p>)} 
          </>
          : null}
        </div> 
      }
    </div>
  );
}

export default App;
