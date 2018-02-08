import React, {Component} from 'react'

class MessegeList extends Component{

  constructor(props){
    super(props);
    this.state={
      messeges: []
    };
    this.chatRoomRef = 'rooms/' + this.props.chatroom.key + '/messege';
    this.messegeRef = this.props.firebase.database().ref(this.chatRoomRef);
    this.listeners = {
        addMessege: (snapshot) =>{
          let messege = snapshot.val();
          messege.key = snapshot.key;
          const date = new Date(messege.time);
          messege.realTime = date.toTimeString().substring(0,5);
          this.setState( (prevState, props) => ({
            messeges : prevState.messeges.concat(messege)
          }));
        },
        
    };
  }
  componentDidMount(){
    this.removeAndAddListener(true);
  }

  removeAndAddListener(isNew){
    if(!isNew){
      try{
        this.messegeRef.off('child_added', this.listeners.addMessege);
      } catch (e){
      }
      this.setState({
        messeges: []
      });
    }
    this.chatRoomRef = 'rooms/' + this.props.chatroom.key + '/messege';
    this.messegeRef = this.props.firebase.database().ref(this.chatRoomRef);
    this.messegeRef.on('child_added', this.listeners.addMessege);
  }
  componentDidUpdate(prevProps, prevState){
    if(this.props.chatroom.name !== prevProps.chatroom.name){
      this.removeAndAddListener(false);
    }
  }

  handleTextSend(){
    var msg = document.getElementById('input-text-box').value;
    if(msg){
      this.props.handleTextSend(msg);
      document.getElementById('input-text-box').value = "";
    } else{
      console.log('msg was null');
    }
  }
  handleKeyUp(e){
    if(e.keyCode!==13){
      return;
    }
    this.handleTextSend();
  }
  turnToTextBox(e){
    var inputTag = e.target;
    inputTag.classList = "";
    inputTag.classList.add('invisible');
    inputTag.disabled = true;
    var inputBox = document.getElementById('room-name-input');
    inputBox.disabled = false;
    inputBox.classList = "";
    inputBox.value="";
    inputBox.focus();
  }
  handleRenameRoom(){
    var inputBox = document.getElementById('room-name-input');
    this.props.handleRenameRoom(inputBox.value);
    inputBox.classList.add("invisible");
    inputBox.disabled = true;
    var inputTag = document.getElementById('room-name');
    inputTag.classList = "";
    inputTag.disabled = false;
  }

  render(){

    return(
      <div className='MessegeList right-container chatroom col-lg-9'>
        <h1 id='room-name' onClick={(e)=>this.turnToTextBox(e)}> {this.props.chatroom.name} </h1>
        <input type="text" id='room-name-input' className='invisible' disabled={true}  onBlur={()=>this.handleRenameRoom()}/>
        {
          this.state.messeges.map((messege, index)=>

            <div className='input-group messege-box' key={index} >
              <div className="input-group-prepend name-tag">
                <span className="input-group-text font-weight-bold name-tag">{messege.sender}:</span>
              </div>
              <span className='form-control messege-tag' >{messege.content} </span>
              <div className="input-group-append time-tag">
                <span className="input-group-text time-tag" >{messege.realTime}</span>
              </div>
            </div>
          )
        }
        <div className='d-flex flex-row-reverse input-text-bar'>
          <input type="button" className='p-2 btn btn-sm' value='send' onClick={()=>this.handleTextSend()} />
          <input type="text" className='p-2 input-text-box' id='input-text-box' onKeyUp={(e)=>this.handleKeyUp(e)}/>
        </div>
      </div>
    );
  }

}
export default MessegeList;
