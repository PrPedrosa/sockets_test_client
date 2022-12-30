function ChooseName(props:any) {
    const {clientName} = props;
    const {saveName} = props;
    const {nameState} = props
    
  return (
    <div>
        <h3>Choose your Name</h3>
        <input type="text" name="name" id="name" value={nameState} onChange={clientName}/>
        {nameState.length >= 3 && nameState.length <= 10 && <button onClick={saveName}>Go chat!</button>}
        {nameState.length < 3 && nameState.length > 10 && <p>please input a name between 3 and 10 characters</p>}
    </div>
  )
}

export default ChooseName