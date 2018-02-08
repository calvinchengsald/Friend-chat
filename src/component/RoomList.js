import React, {Component} from 'react'

//import {Link} from 'react-router-dom';

class RoomList extends Component{

  constructor(props){
    super(props);
    this.state = {
      rooms : [],
      currentRoom: "",
    }
    this.roomsRef = this.props.firebase.database().ref('rooms');
    this.listeners = {
      nameListener: (snapshot) =>{
          console.log("in name listener");
          if(snapshot.key === "name"){
            this.props.updateCurrentRoomName(snapshot.val(), snapshot.ref.parent.parent.key);
          }
      },
    }
  }


  componentDidMount(){
    this.roomsRef.on('child_added', snapshot => {
      const addedRoom = snapshot.val();
      addedRoom.key = snapshot.key;
    //  addedRoom.name = snapshot.val().roomdata.name
      addedRoom.name = snapshot.val().roomdata.name;
      this.setState({rooms: this.state.rooms.concat(addedRoom)});
      this.props.updateRooms(this.state.rooms.concat(addedRoom), false);
      const dummyRef= 'rooms/'+addedRoom.key+'/roomdata';
      this.props.firebase.database().ref(dummyRef).on('child_changed',this.listeners.nameListener);
    });
    this.roomsRef.on('child_removed', snapshot => {
      var leftCurrentChatRoom = snapshot.key === this.state.currentRoom.key;
      var tempRooms = this.state.rooms;
      tempRooms = tempRooms.filter(roomb=> roomb.key !==snapshot.key);
      this.setState({rooms: tempRooms});
      this.props.updateRooms(tempRooms,leftCurrentChatRoom);
      const dummyRef= 'rooms/'+snapshot.key+'/roomdata';
      this.props.firebase.database().ref(dummyRef).off('child_changed',this.listeners.nameListener);
      console.log("took out listener");
    });

  }
//  componentDidUnmount(){
    //remove soem listenenrs?
//  }
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
        <div >
          <input type='button' value='+' className='btn btn-lg btn-room room-button-add' onClick={()=>this.props.handleCreatingNewRoom()}/>
        </div>
        {this.state.rooms.map((room,index)=>
          <div className={'room-button-'+index + ' '} key={index}>

            <input type='button' value={room.name} className='btn btn-lg btn-room' onClick={()=>this.handleRoomSelect(room)}/>

          </div>
        )}

      </section>
    );
  }


}
export default RoomList;
