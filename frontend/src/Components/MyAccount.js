import React, { Component } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class MyAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            allBlogsUser: [],
            profileImageLink: '',
            name: '',
            email: '',
            tokenId: localStorage.getItem("token"),
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
                    profileImageLink: response.data.profileImageLink,
                    name: response.data.name,
                    email: response.data.email,
                    user_id: response.data.user_id
                })
                axios.get("http://127.0.0.1:5000/show-user-blog/" + response.data.user_id)
                    .then((response) => {
                        this.setState({
                            allBlogsUser: response.data,
                        })
                    })

                    .catch((err) => (alert(err)))

            })
    }
    render() {
        if (this.state.profileImageLink == "") {
            return (
                <div>
                    <Navbar />
                    <h1 className="text-center text-danger mt-4">My Profile</h1>
                    <h2 className="offset-5 mt-5" style={{ marginBottom: "-100px" }}>Total number of blogs: {this.state.allBlogsUser.length}</h2>
                    <div>
                        <img style={{ width: "300px", height: "300px" }} className="offset-1 mt-5 rounded-circle" src="https://www.w3schools.com/howto/img_avatar.png"></img>
                        <Link to={`/userBlog/${this.state.user_id}`}><button className="btn btn-secondary" style={{ marginLeft: "460px" }}>See My Blogs</button></Link>
                        <h3 style={{ marginLeft: "120px" }} className="mt-3 mb-2">Name: {this.state.name}</h3>
                        <h3 style={{ marginLeft: "120px" }}>Email: {this.state.email}</h3>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                    <Navbar />
                    <h1 className="text-center text-danger mt-4">My Profile</h1>
                    <h2 className="offset-5 mt-5" style={{ marginBottom: "-100px" }}>Total number of blogs: {this.state.allBlogsUser.length}</h2>
                    <div>
                        <img style={{ width: "300px", height: "300px" }} className="offset-1 mt-5 rounded-circle" src={`http://127.0.0.1:5000/${this.state.profileImageLink}`}></img>
                        <Link to={`/userBlog/${this.state.user_id}`}><button className="btn btn-secondary" style={{ marginLeft: "460px" }}>See My Blogs</button></Link>
                        <h3 style={{ marginLeft: "120px" }} className="mt-3 mb-2">Name: {this.state.name}</h3>
                        <h3 style={{ marginLeft: "120px" }}>Email: {this.state.email}</h3>
                    </div>
                </div>
            )
        }

    }
}
