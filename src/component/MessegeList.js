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

          this.setState( (prevState, props) => ({
            messeges : prevState.messeges.concat(messege)
          }));
        },
    }
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



  render(){

    return(
      <div className='MessegeList right-container chatroom col-lg-9'>
        <h1> {this.props.chatroom.name} </h1>
        {
          this.state.messeges.map((messege, index)=>
            <div className='d-flex justify-content-between messege-box' key={index} >
              <span className='p-2 font-weight-bold name-tag'>{messege.sender}:</span>
              <span className='p-2 input-group-addon messege-tag'> {messege.content}</span>
              <span className='p-2 time-tag'>{messege.time}</span>
            </div>
          )
        }
        <div className='d-flex flex-row-reverse input-text-bar'>
          <input type="button" className='p-2 btn btn-sm' value='send' onClick={()=>this.handleTextSend()} />
          <input type="text" className='p-2 input-text-box' id='input-text-box'/>
        </div>
      </div>
    );
  }

}
export default MessegeList;
