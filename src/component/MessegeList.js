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

  // componentDidMount(){
  //   this.listeners = {
  //     addMessege: (snapshot) =>{
  //       let messege = snapshot.val();
  //       messege.key = snapshot.key;
  //       let newMesseges = this.state.messeges.concat(messege);
  //       this.setState({
  //         messeges: newMesseges
  //       })
  //     },
  //   }
  //   this.messegeRef.on('child_added', this.listeners.addMessege);
  // }
  // componentWillUnmount(){
  //   this.messegeRef.off('child_added', this.listeners.addMessege);
  // }



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
      </div>
    );
  }

}
export default MessegeList;
