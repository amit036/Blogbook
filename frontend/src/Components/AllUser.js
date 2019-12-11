import React, { Component } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'

class AllUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allUser: []
        }
    }

    componentDidMount = (e) => {
        axios.get("http://127.0.0.1:5000/show-all-user")
            .then((response) => {
                this.setState({
                    allUser: response.data
                })
                console.log(response.data)
            })
            .catch((err) => alert(err))
    }
    render() {
        let user = this.state.allUser
        let showUsers = user.map(e => {
            if (e.profileImageLink == "") {
                return (
                    <div class="card float-left ml-5 mb-3" style={{ "width": "20rem" }}>
                        <img src="https://www.w3schools.com/howto/img_avatar.png" class="card-img-top" style={{ width: "320px", height: "330px" }} alt="..." />
                        <div class="card-body">
                            <h5 >{e.name}</h5>
                            <Link to={`/userBlog/${e.user_id}`} class="btn btn-primary w-100">See Blogs</Link>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div class="card float-left ml-5 mb-3" style={{ "width": "20rem" }}>
                        <img src={`http://127.0.0.1:5000/${e.profileImageLink}`} class="card-img-top" style={{ width: "320px", height: "330px" }} alt="..." />
                        <div class="card-body">
                            <h5 >{e.name}</h5>
                            <Link to={`/userBlog/${e.user_id}`} class="btn btn-primary w-100">See Blogs</Link>
                        </div>
                    </div>
                )
            }
        })
        return (
            <div>
                <Navbar />
                <h1 className="text-center mt-4">All Users</h1>
                <div className="offset-1">
                    {showUsers}
                </div>
            </div>
        )
    }
}
export default AllUser
