function Home(props:any) {
    const {connect} = props
  return (
    <div>
        <button onClick={connect}>Start Chatting!</button>
    </div>
  )
}

export default Home