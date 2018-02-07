import React,  {Component} from 'react'
import RoomList from './../component/RoomList'

class Home extends Component{

  render(){
    return(
        <div className ='row'>
          <div className='left-container col-lg-3'>
            <RoomList
            firebase= {this.props.firebase}/>
          </div>
          <div className='right-container col-lg-9'>
            <p>This is the right side</p>
          </div>
        </div>
    );
  }
}
export default Home;
