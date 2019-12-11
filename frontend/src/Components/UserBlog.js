import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'

const MAX_LENGTH = 250

export default class UserBlog extends Component {
    constructor(props) {
        super(props)

        this.state = {
            allBlogsUser: [],
            user_id_auth: '',
            user_id_blog: '',
            showUser: [],
            tokenId: localStorage.getItem("token")
        }
    }
    componentDidMount = (e) => {
        axios.get("http://127.0.0.1:5000/show-user-blog/" + this.props.match.params.user_id)
            .then((response) => {
                this.setState({
                    allBlogsUser: response.data,
                    user_id_blog: response.data[0].user_id
                })
                console.log(response.data)
            })

            .catch((err) => (alert('No blogs found')))

        axios.get("http://127.0.0.1:5000/show-one-user/" + this.props.match.params.user_id)
            .then((response) => {
                this.setState({
                    showUser: response.data[0]
                })
                console.log(response.data)
            })

            .catch((err) => (alert(err)))

        axios.get("http://127.0.0.1:5000/get-user-token", {
            headers: {
                Authorization: "Bearer " + this.state.tokenId,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                this.setState({
                    user_id_auth: response.data.user_id
                })
            })
    }

    deleteBlog = (blog_id) => {
        axios.delete("http://127.0.0.1:5000/delete-blog/" + blog_id, {
            headers: {
                user_id: this.state.user_id_auth
            }
        })
            .then((response) => {
                console.log(response.data)
                this.props.history.push(`/userBlog/${this.state.user_id_auth}`)
                window.location.reload(false);
            })
            .catch((err) => alert(err))
    }
    render() {
        console.log(this.state.user_id_auth)
        let user = this.state.allBlogsUser
        let userAuth = this.state.user_id_auth
        let userBlog = this.state.user_id_blog
        let showBlogs = user.map(e => {
            if (Number(userAuth) === Number(userBlog)) {
                let text = e.blog_content
                return (
                    <div class="card mb-3 w-50 offset-3">
                        <div class="row no-gutters">
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">{e.blog_title}</h5>
                                    <div>
                                        <p class="card-text"> {`${text.substring(0, MAX_LENGTH)} ...`} <Link to={`/addComments/${e.blog_id}`}><span className="">Read More</span></Link></p>
                                    </div>
                                    <p class="card-text"><small class="text-muted">Category: {e.category}</small></p>
                                    <p class="card-text"><small class="text-muted">Posted at {e.postedAt}</small></p>
                                    <Link to={`/addComments/${e.blog_id}`}><img src="https://image.flaticon.com/icons/svg/1381/1381552.svg" style={{ width: "30px", height: "30px", float: "right", marginRight: "150px" }}></img></Link>
                                </div>
                                <button className="btn btn-secondary mb-3 ml-5" onClick={() => this.deleteBlog(e.blog_id)}>Delete</button>
                                <Link to={`/editBlog/${e.blog_id}`}><button className="btn btn-primary offset-2" style={{ marginTop: "-18px" }}>Edit</button></Link>
                            </div>
                            <div class="col-md-4">
                                <img src={`http://127.0.0.1:5000/${e.postImageLink}`} style={{ height: "270px", marginTop: "15px" }} class="card-img" alt="..." />
                            </div>
                        </div>
                    </div>
                )
            }
            else {
                let text = e.blog_content
                return (
                    <div class="card mb-3 w-50 offset-3">
                        <div class="row no-gutters">
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">{e.blog_title}</h5>
                                    <div>
                                        <p class="card-text"> {`${text.substring(0, MAX_LENGTH)} ...`} <Link to={`/addComments/${e.blog_id}`}><span className="">Read More</span></Link></p>
                                    </div>
                                    <p class="card-text"><small class="text-muted">Category: {e.category}</small></p>
                                    <p class="card-text"><small class="text-muted">Posted at {e.postedAt}</small></p>
                                    <Link to={`/addComments/${e.blog_id}`}><img src="https://image.flaticon.com/icons/svg/1381/1381552.svg" style={{ width: "30px", height: "30px", float: "right", marginRight: "150px" }}></img></Link>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <img src={`http://127.0.0.1:5000/${e.postImageLink}`} style={{ height: "270px", marginTop: "15px" }} class="card-img" alt="..." />
                            </div>
                        </div>
                    </div>
                )
            }
        })
        return (
            <div>
                <Navbar />
                {}
                <h3 className="text-center mt-3 text-success">Author: {this.state.showUser.name}</h3>
                {showBlogs}
            </div>
        )
    }
}
