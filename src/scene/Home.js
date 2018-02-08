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
        firstEnter: true,
      });
//      console.log(`entered ${room.name} from nothing`);
    }
    else if(this.state.currentChatRoom.name !== room.name){
      this.setState({
        currentChatRoom: room,
        creatingNewRoom: false,
        firstEnter : false,
      });
//      console.log(`changed to room ${room.name} from ${this.state.currentChatRoom.name}`);
    }
    else{
//      console.log('clicked on same room');
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
      this.roomsRef = this.props.firebase.database().ref('rooms').push({
        name: newName,
        messege : {
          "0" : { content : "Welcome to this chat room", sender : "creator", time: this.props.firebase.database.ServerValue.TIMESTAMP }
        }
      });
      this.setState({
        roomCreateSuccess: true,
        roomCreateMessage: "Created room " + newName
      });
    }
  }
  signIn(){
    console.log("create user");
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider );
    //
    // this.props.firebase.auth().signInWithPopup( provider ).then(function(result) {
    //   // This gives you a Google Access Token. You can use it to access the Google API.
    //   //var token = result.credential.accessToken;
    //
    //   // The signed-in user info.
    //
    //   // var user = result.user;
    //   // this.setState({
    //   //   displayName: user.displayName,
    //   //   signedIn : true,
    //   // });
    //
    //   //console.log(`at sign in method name: ${newDisplayName} with ${newSignedIn}`);
    //   // ...
    // }.bind(this)).catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // The email of the user's account used.
    // //  var email = error.email;
    //   // The firebase.auth.AuthCredential type that was used.
    //   //var credential = error.credential;
    //   // ...
    //   console.log(`Error code ${errorCode}: ${errorMessage}`)
    // });


  }
  signOut(){
    this.props.firebase.auth().signOut();
    // this.setState({
    //   displayName: "",
    //   signedIn : false,
    // });
    console.log(`at sign out`);
  }
  setUser(user){
    console.log('setting the user');
    if(user){
      this.setState({
        displayName : user.displayName,
        signedIn : true,
      });
      console.log(`state set for user`);

    }else {
      console.log('user is null set for user');
      this.setState({
        displayName : "Valued Guest",
        signedIn : false,
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
      firstEnter = {this.state.firstEnter}
      />
      ;
    }

    return(
      <div>
        <div>
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
      </div>
    );
  }
}
export default Home;
