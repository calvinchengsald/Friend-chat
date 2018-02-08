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
      <div>
        <span>{this.props.displayName} </span>
        <input type="button" className="btn btn-md btn-signin" value={this.props.signedIn?"Sign Out":"Sign In"} onClick={this.props.signedIn?()=>this.props.handleSignOut():()=>this.props.handleSignIn()}/>
      </div>
    );
  }

}
export default User;
