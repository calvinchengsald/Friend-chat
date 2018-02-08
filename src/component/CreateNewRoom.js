import React, {Component} from 'react'

class CreateNewRoom extends Component{

  constructor(props){
    super(props);
    this.state = {
      message: "",
      success: false,
      failure: false,
    }
  }
  handleCreateNewRoom(){
    // var msg = document.getElementById('create-room-message');
    // msg.classList.clear();
    // msg.classList.add('alert');
    var newRoomName = document.getElementById('create-room-name').value;
    this.props.handleNewRoomName(newRoomName);
  }
  handleKeyUp(e){
    if(e.keyCode!==13){
      return;
    }
    this.handleCreateNewRoom();
  }
  componentDidMount(){
    document.getElementById('create-room-name').focus();
  }

  render(){

    return(
      <section className='right-container col-lg-9'>
        <div className='container'>
          <h1 > Create a New Room </h1>
          <input id='create-room-name' placeholder="Room Name" type="text" className="template" onKeyUp={(e)=>this.handleKeyUp(e)}/>
          <input type="submit" value="Create" onClick={()=>this.handleCreateNewRoom()}/>
          <p id="create-room-message"
          className = {((this.props.success||this.props.failure)?'':'')+(this.props.success?'alert alert-success':'')+(this.props.failure?'alert alert-warning':'')+' notice'}>{this.props.message}
          </p>
        </div>
      </section>
    );
  }


}
export default CreateNewRoom;
