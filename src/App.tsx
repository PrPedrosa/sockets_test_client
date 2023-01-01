import {useState} from 'react';
import Home from './components/Home';
import ChooseName from './components/ChooseName';
import moment from 'moment';

type Message = {
  clientId: string,
  content: string,
  messageId: string,
  date: string,
  clientName: string
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

const env:any = process.env.REACT_APP_API_URL

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
    const connection = new WebSocket("ws://localhost:8080")
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
      "clientName": clientName,
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
    <div className={"container h-screen bg-sky-900 flex flex-col items-center justify-between"}>
      <div className='self-start mx-5'>
      <button onClick={() => ws.close()} className={"border-2 rounded-xl px-2 border-red-900 text-white bg-slate-900 shadow hover:shadow-lg hover:ring hover:ring-red-900 hover:font-bold my-2"}>Log Out</button>
          {onlineClients ?
          <>
          <p>Online: {onlineClients.length}</p>
          {onlineClients.map(client => <p key={client.clientId}>{client.name}</p>)} 
          </>
          : null}
      </div>

      {!ws.url && <Home connect={openConnection}/>}
      {ws.url && !toggleName && <ChooseName clientName={handleClientName} saveName={toggleClientName} nameState={clientName}/>}

      <div className='h-4/5 flex flex-col items-center justify-end'>

      <div className='overflow-y-auto'>
      {toggleName && messages && messages.map(msg => {
        return (
          <div key={msg.messageId} className="border-2 border-red-500 px-2 py-1 my-2 rounded-xl w-80">
            <div className='flex justify-between'>
              <span className='text-white'>{msg.clientName}</span>
              <span className='text-xs'>{msg.date}</span>
            </div>
          <p className='whitespace-normal break-words'>{msg.content}</p>
          <div className='rounded-full flex justify-center items-center w-[22px] h-[22px] border-2 border-red-900 text-red-900 bg-slate-900 shadow hover:shadow-lg hover:ring-1 hover:ring-red-900 hover:font-bold my-2'>
          {msg.clientId === clientId && <button onClick={() => deleteMessage(msg.messageId)} className="">X</button>}
          </div>
          </div>
        )
      })}
      </div>

      {toggleName &&
        <div className='flex justify-start items-center py-2'>
          <input type="text" name="messages" id="messages" value={message} onChange={handleMessage} className={"rounded-xl px-2 py-1 border-black border-2"}/>
          <button onClick={handleSubmit} className={"border-2 rounded-xl p-2 border-violet-600 text-white bg-slate-800 shadow hover:shadow-lg hover:ring hover:ring-violet-600 hover:font-bold mx-2"}>Send</button>  
        </div> 
      }
      </div>
    </div>
  );
}

export default App;
