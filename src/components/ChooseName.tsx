function ChooseName(props:any) {
    const {clientName} = props;
    const {saveName} = props;
    const {nameState} = props
    
  return (
    <div className={"h-screen flex flex-col space-y-6 items-center justify-center"}>
        <h3 className={"text-white font-bold text-3xl font-sans"}>Choose your Name</h3>
        <input type="text" name="name" id="name" value={nameState} onChange={clientName} className={"rounded-xl px-2 py-1 border-black border-2"}/>
        {nameState.length >= 3 && nameState.length <= 10 && <button onClick={saveName} className={"border-2 rounded-xl p-2 border-violet-600 text-white bg-slate-800 shadow hover:shadow-lg hover:ring hover:ring-violet-600 hover:font-bold "}>Go chat!</button>}
        {(nameState.length < 3 || nameState.length > 10) && <p className="text-white text-sm">please choose a name between 3 and 10 characters</p>}
    </div>
  )
}

export default ChooseName