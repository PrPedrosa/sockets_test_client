function Home(props:any) {
    const {connect} = props
  return (
    <div className={"h-screen flex flex-col space-y-6 items-center justify-center"}>
      <h2 className={"text-white font-bold text-3xl font-sans"}>Live Chat App</h2>

      <button onClick={connect} className={"border-2 rounded-xl p-2 border-violet-600 text-white bg-slate-800 shadow hover:shadow-lg hover:ring hover:ring-violet-600 hover:font-bold "}>Start Chatting!</button>
    </div>
  )
}

export default Home