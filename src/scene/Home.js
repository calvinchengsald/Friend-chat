import React,  {Component} from 'react'
import RoomList from './../component/RoomList'
import CreateNewRoom from './../component/CreateNewRoom'
import MessegeList from './../component/MessegeList'
import User from './../component/User'

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
      firstEnter : false,
      signedIn: false,
      displayName: "",
    }
  }
  updateRooms(roomsData, leftCurrentChatRoom){
    if(!leftCurrentChatRoom){
      this.setState({
        rooms: roomsData
      });
    } else {
      this.setState({
        rooms: roomsData,
        currentChatRoom : ""
      });
    }

  }
  handleCreatingNewRoom(){
    this.setState({
      creatingNewRoom: true,
      roomCreateFailure: false,
      roomCreateSuccess: false,
      roomCreateMessage: "",
      currentChatRoom: ""
    });
  }
  handleSelectedChatRoom(room){
    if(this.state.currentChatRoom === ""){
      this.setState({
        currentChatRoom: room,
        creatingNewRoom: false,
        firstEnter: true,
      });
      try{
        document.getElementById('input-text-box').focus();
      } catch (e){
        console.log('tried to focus element, dont exist yet');
      }
    //  console.log(`entered ${room.name} from nothing`);
    }
    else if(this.state.currentChatRoom.key !== room.key){
      this.setState({
        currentChatRoom: room,
        creatingNewRoom: false,
        firstEnter : false,
      });
      document.getElementById('input-text-box').focus();
  //    console.log(`changed to room ${room.name} from ${this.state.currentChatRoom.name}`);
    }
    else{
  //    console.log('clicked on same room');
      return;
    }
  }
  handleNewRoomName(newName){   //checks if this new room name is acceptable, if so create it
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
      document.getElementById('create-room-name').value = "";
      this.roomsRef = this.props.firebase.database().ref('rooms').push({
        roomdata: {
          name: newName,
        },
        messege : {
          "0" : { content : "Welcome to this chat room", sender : "God", time: this.props.firebase.database.ServerValue.TIMESTAMP }
        }
      });
      this.setState({
        roomCreateSuccess: true,
        roomCreateMessage: "Created room " + newName
      });
    }
  }
  handleRenameRoom(newName){
    console.log("implementing new name");
    if(!newName){
      console.log("Cannot rename to null");
      return;
    }
    if(this.state.rooms.find(room => {return room.name === newName;})){
      console.log("Already Exist!");
    }
    else {
      const roomRef = "rooms/"+this.state.currentChatRoom.key + "/roomdata/name";
      this.props.firebase.database().ref(roomRef).set(newName);
    }
  }
  handleDeleteRoom(){
    this.props.firebase.database().ref('rooms/'+this.state.currentChatRoom.key).remove();
  }
  updateCurrentRoomName(newName, roomID){
    console.log(roomID);
    var dummyRoom = this.state.rooms.find(room =>{return room.key ===roomID});
    dummyRoom.name = newName;
    this.setState( (prevState, props) => ({
      messeges : prevState.rooms.filter(room=>room.key!==roomID).concat(dummyRoom),
    }));
  }
  signIn(){
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider );
  }
  signOut(){
    this.props.firebase.auth().signOut();
  }
  setUser(user){
    if(user){
      this.setState({
        displayName : user.displayName,
        signedIn : true,
      });

    }else {
      this.setState({
        displayName : "Valued Guest",
        signedIn : false,
      });

    }

  }
  handleTextSend(msg){
    if(!this.state.signedIn){
      document.getElementById('input-text-box').placeholder = "You are not signed in!"
      document.getElementById('input-text-box').value = "";
      return;
    } else {
      document.getElementById('input-text-box').placeholder = "";
    }

    var msgRef = 'rooms/' + this.state.currentChatRoom.key + '/messege';
    this.props.firebase.database().ref(msgRef).push({
        content : msg,
        sender : this.state.displayName,
        time: this.props.firebase.database.ServerValue.TIMESTAMP,

    });
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
      <div className='right-container col-lg-9 col-md-9 col-sm-9 col-9'>
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
      firstEnter = {this.state.firstEnter}
      handleTextSend = {(msg)=>this.handleTextSend(msg)}
      handleRenameRoom = {(newName) =>this.handleRenameRoom(newName)}
      handleDeleteRoom = {()=>this.handleDeleteRoom()}

      />
      ;
    }

    return(
      <div >
        <div >
          <User
          handleSignIn ={()=>this.signIn()}
          handleSignOut ={()=>this.signOut()}
          signedIn = {this.state.signedIn}
          displayName = {this.state.displayName}
          firebase = {this.props.firebase}
          setUser = {(user)=>this.setUser(user)}
          />
        </div>
        <div className ='row'>
          <div className='left-container col-lg-3 col-md-3 col-sm-3 col-3'>

            <RoomList
            firebase= {this.props.firebase}
            creatingNewRoom = {this.state.creatingNewRoom}
            handleCreatingNewRoom = {()=>this.handleCreatingNewRoom()}
            handleSelectedChatRoom = {(room)=>this.handleSelectedChatRoom(room)}
            updateRooms = {(rom,leftCurrentChatRoom)=>this.updateRooms(rom,leftCurrentChatRoom)}
            updateCurrentRoomName = {(newName, roomID) => this.updateCurrentRoomName(newName, roomID)}
            />
          </div>
          {this.rightSide}
        </div>
      </div>
    );
  }
}
export default Home;
