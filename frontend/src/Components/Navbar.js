import React, { Component } from 'react'
import { BrowserRouter, Link } from "react-router-dom";
import axios from 'axios'
class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tokenId: localStorage.getItem("token"),
      userDetails: []
    }
  }
  componentDidMount = (e) => {
    axios.get("http://127.0.0.1:5000/get-user-token", {
      headers: {
        Authorization: "Bearer " + this.state.tokenId,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        this.setState({
          userDetails: response.data
        })
      })
  }
  render() {
    let e = this.state.userDetails
    if (e.profileImageLink == "") {
      return (
        <div>
          <nav className="nav navbar-static-top bg-dark" style={{ height: "70px" }}>
            <Link className="nav-item nav-link text-white" to="/home"> <h1 style={{ marginLeft: "20px", marginRight: "10px", fontSize: "40px" }}><span>Blogbook</span></h1></Link>
            <Link className="nav-item nav-link text-white mt-3" style={{ fontSize: "18px", marginLeft: "180px" }} to="/home">HOME</Link>
            <Link className="nav-item nav-link text-white mt-3" style={{ fontSize: "18px", marginLeft: "90px" }} to="/allUser">ALL USER</Link>
            <Link className="nav-item nav-link text-white mt-3" style={{ fontSize: "18px", marginLeft: "90px" }} to="/addBlog">POST BLOG</Link>
            <Link className="nav-item nav-link text-white mt-3" style={{ fontSize: "18px", marginLeft: "90px" }} to="/myAccount">MY ACCOUNT</Link>
            <Link className="nav-item nav-link text-white mt-3" style={{ fontSize: "18px", marginLeft: "90px" }} to="/" >LOGOUT</Link>
            <div className="nav-item nav-link text-white mt-3 font-weight-bold" style={{ fontSize: "22px", marginLeft: "90px" }}>{e.name}</div>
            <div className="nav-item nav-link text-white mt-1"><img style={{ width: "50px" }} className="rounded-circle" src="https://www.w3schools.com/howto/img_avatar.png"></img></div>
          </nav>

        </div>
      )
    }
    else {
      return (
        <div>
          <nav className="nav navbar-static-top bg-dark" style={{ height: "70px" }}>
            <Link className="nav-item nav-link text-white" to="/home"> <h1 style={{ marginLeft: "20px", marginRight: "10px", fontSize: "40px" }}><span>Blogbook</span></h1></Link>
            <Link className="nav-item nav-link text-white mt-3" style={{ fontSize: "18px", marginLeft: "180px" }} to="/home">HOME</Link>
            <Link className="nav-item nav-link text-white mt-3" style={{ fontSize: "18px", marginLeft: "90px" }} to="/allUser">ALL USER</Link>
            <Link className="nav-item nav-link text-white mt-3" style={{ fontSize: "18px", marginLeft: "90px" }} to="/addBlog">POST BLOG</Link>
            <Link className="nav-item nav-link text-white mt-3" style={{ fontSize: "18px", marginLeft: "90px" }} to="/myAccount">MY ACCOUNT</Link>
            <Link className="nav-item nav-link text-white mt-3" style={{ fontSize: "18px", marginLeft: "90px" }} to="/" >LOGOUT</Link>
            <div className="nav-item nav-link text-white mt-3 font-weight-bold" style={{ fontSize: "22px", marginLeft: "90px" }}>{e.name}</div>
            <div className="nav-item nav-link text-white mt-1"><img style={{ width: "50px" }} className="rounded-circle" src={`http://127.0.0.1:5000/${e.profileImageLink}`}></img></div>
          </nav>
        </div>
      )

    }

  }
}

export default Navbar;  