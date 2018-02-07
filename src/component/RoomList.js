import React, {Component} from 'react'

class RoomList extends Component{

  constructor(props){
    super(props);
    this.state = {
      rooms : [],
      currentRoom: ""
    }
    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  componentDidMount(){
    this.roomsRef.on('child_added', snapshot => {
      const addedRoom = snapshot.val();
      addedRoom.key = snapshot.key;
      this.setState({rooms: this.state.rooms.concat(addedRoom)});
      this.props.updateRooms(this.state.rooms.concat(addedRoom));
    });
  }
  componentDidUnmount(){
    //remove soem listenenrs?
  }
  handleRoomSelect(room){
    this.setState({
      currentRoom: room
    });
    this.props.handleSelectedChatRoom(room);
  }

  render(){
    return(
      <section className='room-list'>
        <h1>Rooms </h1>
        {this.state.rooms.map((room,index)=>
          <div className={'room-button-'+index}>
            <input type='button' value={room.name} className='btn btn-lg btn-room' onClick={()=>this.handleRoomSelect(room)}/>
          </div>
        )}
        <div className='room-button-+'>
          <input type='button' value='+' className='btn btn-lg btn-room' onClick={()=>this.props.handleCreatingNewRoom()}/>
        </div>
      </section>
    );
  }


}
export default RoomList;
