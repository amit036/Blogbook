import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Login from './Components/Login'
import SignUp from './Components/SignUp'
import AddBlogCategory from './Components/AddBlogCategory'
import AddBlog from './Components/AddBlog'
import AddComment from './Components/AddComment'
import Home from './Components/Home'
import LandingPage from './Components/LandingPage'
import AllUser from './Components/AllUser'
import UserBlog from './Components/UserBlog'
import EditBlog from './Components/EditBlog'
import EditComments from './Components/EditComments'
import MyAccount from './Components/MyAccount'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tokenId: localStorage.getItem("token"),
    }
  }
  render() {
    let token = this.state.tokenId
    return (
      <div>
        <Router>
          <Route path="/login" exact render={(props) => { return <Login {...props} /> }} />
          <Route path="/signup" exact render={(props) => { return <SignUp {...props} /> }} />
          <Route path="/allUser" exact render={(props) => token ? (<AllUser {...props} />) : (<Redirect to='login' />)} />
          <Route path="/addBlogCategory" exact render={(props) => { return <AddBlogCategory {...props} /> }} />
          <Route path="/addBlog" exact render={(props) => token ? (<AddBlog {...props} />) : (<Redirect to='login' />)} />
          <Route path="/editBlog/:blog_id" exact render={(props) => token ? (<EditBlog {...props} />) : (<Redirect to='login' />)} />
          <Route path="/addComments/:blog_id" exact render={(props) => token ? (<AddComment {...props} />) : (<Redirect to='login' />)} />
          <Route path="/editComment/:comm_id" exact render={(props) => token ? (<EditComments {...props} />) : (<Redirect to='login' />)} />
          <Route path="/home" exact render={(props) => token ? (<Home {...props} />) : (<Redirect to='login' />)} />
          <Route path="/myAccount" exact render={(props) => token ? (<MyAccount {...props} />) : (<Redirect to='login' />)} />
          <Route path="/userBlog/:user_id" exact render={(props) => token ? (<UserBlog {...props} />) : (<Redirect to='login' />)} />
          <Route path="/" exact render={(props) => { return <LandingPage {...props} /> }} />
        </Router>
      </div>
    )
  }
}


export default App;
