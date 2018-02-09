import React, {Component} from 'react'

class User extends Component{

  constructor(props){
    super(props);
    this.state={

    };
  }

  componentDidMount(){
    this.props.firebase.auth().onAuthStateChanged( user => {
      console.log('auth changed');
      this.props.setUser(user);
    });
  }

  render(){

    return(
      <div className='row'>

        <div className="col-lg-10 col-md-10 col-sm-10 col-10">
          <div className='float-left'>{this.props.displayName} </div>
        </div>
        <div className="col-lg-2 col-md-2 col-sm-2 col-2">
          <input type="button" className="btn btn-md btn-signin" value={this.props.signedIn?"Sign Out":"Sign In"} onClick={this.props.signedIn?()=>this.props.handleSignOut():()=>this.props.handleSignIn()}/>
        </div>

        </div>
    );
  }

}
export default User;
