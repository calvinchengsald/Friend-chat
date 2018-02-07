import React, {Component} from 'react'

class RoomList extends Component{

  constructor(props){
    super(props);
    this.state = {
      rooms : []
    }
    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  componentDidMount(){
    this.roomsRef.on('child_added', snapshot => {
      const addedRoom = snapshot.val();
      addedRoom.key = snapshot.key;
      this.setState({rooms: this.state.rooms.concat(addedRoom)});
    });

  }

  render(){
    return(
      <section className='room-list'>
        <h1>Rooms </h1>
        {this.state.rooms.map((room,index)=>
          <div className={'room-button-'+index}>
            <input type='button' value={room.name} className='btn btn-lg btn-room' />
          </div>
        )}
      </section>
    );
  }


}
export default RoomList;
