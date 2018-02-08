import React,  {Component} from 'react'
import RoomList from './../component/RoomList'
import CreateNewRoom from './../component/CreateNewRoom'
import MessegeList from './../component/MessegeList'

//import {Route} from 'react-router-dom';

class Home extends Component{

  constructor(props){
    super(props);
    this.state={
      rooms:[],
      creatingNewRoom: false,
      currentChatRoom: "",
      roomCreateMessage: "",
      roomCreateSuccess: false,
      roomCreateFailure: false,
      roomChanged : false,
    }
  }
  updateRooms(roomsData){
    this.setState({
      rooms: roomsData
    });
  }
  handleCreatingNewRoom(){
    this.setState({
      creatingNewRoom: true,
      roomCreateFailure: false,
      roomCreateSuccess: false,
      roomCreateMessage: ""
    });
  }
  handleSelectedChatRoom(room){
    if(this.state.currentChatRoom === ""){
      this.setState({
        currentChatRoom: room,
        creatingNewRoom: false,
        roomChanged: true,
      });
//      console.log(`entered ${room.name} from nothing`);
    }
    else if(this.state.currentChatRoom.name !== room.name){
      this.setState({
        currentChatRoom: room,
        creatingNewRoom: false,
        roomChanged : true,
      });
//      console.log(`changed to room ${room.name} from ${this.state.currentChatRoom.name}`);
    }
    else{
//      console.log('clicked on same room');
      return;
    }
  }
  resetRoomChanged(){
    this.setState({
      roomChanged:false
    })
  //  console.log("room changed set to false");
  }
  handleNewRoomName(newName){
    if(!newName){
      this.setState({
        roomCreateFailure: true,
        roomCreateMessage: "Cannot create empty room name"
      });
      return;
    }
    if(this.state.rooms.find(room => {return room.name === newName;})){
      this.setState({   //room already exist
        roomCreateFailure: true,
        roomCreateMessage: "A room already exists with this name"
      });
    }
    else {
      this.roomsRef = this.props.firebase.database().ref('rooms').push({
        name: newName
      });
      this.setState({
        roomCreateSuccess: true,
        roomCreateMessage: "Created room " + newName
      });
    }
  }


  render(){

    if(this.state.creatingNewRoom){
      this.rightSide=
      <CreateNewRoom
      handleNewRoomName={(newName)=>this.handleNewRoomName(newName)}
      failure = {this.state.roomCreateFailure}
      message = {this.state.roomCreateMessage}
      success = {this.state.roomCreateSuccess}
      />;
    }
    else if(!this.state.currentChatRoom){
      this.rightSide =
      <div className='right-container col-lg-9'>
      <h1> Select a chat room</h1>
      </div>
      ;
    }
    else {
      this.rightSide =
      //    <Route path = "/messege/:slug" component = {MessegeList}/>
      <MessegeList
      chatroom = {this.state.currentChatRoom}
      firebase= {this.props.firebase}
      roomChanged = {this.state.roomChanged}
      resetRoomChanged={()=>this.resetRoomChanged()}
      />
      ;
    }

    return(
        <div className ='row'>
          <div className='left-container col-lg-3'>
            <RoomList
            firebase= {this.props.firebase}
            creatingNewRoom = {this.state.creatingNewRoom}
            handleCreatingNewRoom = {()=>this.handleCreatingNewRoom()}
            handleSelectedChatRoom = {(room)=>this.handleSelectedChatRoom(room)}
            updateRooms = {(rom)=>this.updateRooms(rom)}
            />
          </div>
          {this.rightSide}
        </div>
    );
  }
}
export default Home;
