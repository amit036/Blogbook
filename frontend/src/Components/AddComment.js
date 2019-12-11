import React, { Component } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'
export default class AddComment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allComment: [],
            blog: [],
            user_id: '',
            blog_id: this.props.match.params.blog_id,
            comment: '',
            tokenId: localStorage.getItem("token")
        }
    }
    componentDidMount = (e) => {
        axios.get("http://127.0.0.1:5000/all-comment-blog/" + this.props.match.params.blog_id)
            .then((response) => {
                this.setState({
                    allComment: response.data
                })
                console.log(this.state.allComment)
            })
            .catch((err) => alert(err))

        axios.get("http://127.0.0.1:5000/show-one-blog/" + this.props.match.params.blog_id)
            .then((response) => {
                this.setState({
                    blog: response.data[0]
                })
                console.log(response.data[0])
            })
            .catch((err) => alert(err))

        axios.get("http://127.0.0.1:5000/get-user-token", {
            headers: {
                Authorization: "Bearer " + this.state.tokenId,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data)
                this.setState({
                    user_id: response.data.user_id
                })
            })
            .catch((err) => alert(err))
    }

    onChange = (e) => {
        e.preventDefault()
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onClick = (e) => {
        e.preventDefault()
        var commentDetails = {
            comment: this.state.comment,
            user_id: this.state.user_id.toString(10),
            blog_id: this.state.blog_id
        }
        console.log(commentDetails)
        axios.post("http://127.0.0.1:5000/add-comment", commentDetails)
            .then((response) => {
                console.log(response.data)
                window.location.reload(false);
            })
            .catch((err) => alert(err))
    }

    deleteComment = (comm_id) => {
        axios.delete("http://127.0.0.1:5000/delete-comment/" + comm_id, {
            headers: {
                user_id: this.state.user_id
            }
        })
            .then((response) => {
                console.log(response.data)
                this.props.history.push(`/addComments/${this.state.blog_id}`)
                window.location.reload(false);
            })
            .catch((err) => alert(err))

    }
    render() {
        let showComment = () => {
            if (this.state.allComment !== null) {
                return (
                    this.state.allComment.map(e => {
                        if (e.user_id == this.state.user_id) {
                            return (
                                <div className="card w-50 offset-3 mt-2">

                                    <img style={{ width: "50px", height: "50px" }} className="rounded-circle mt-5 ml-3" src={`http://127.0.0.1:5000/${e.profileImageLink}`}></img>
                                    <div className="ml-4 mt-3 text-danger"><b>You</b></div>
                                    <div className="offset-2" style={{ marginTop: "-70px" }}>{e.comment}</div>
                                    <div className="text-success" style={{ marginLeft: "800px" }}>{e.commentedAt}</div>
                                    <button onClick={() => this.deleteComment(e.comm_id)} className="btn btn-secondary mb-1" style={{ width: "100px", marginLeft: "500px" }}>Delete</button>
                                    <Link to={`/editComment/${e.comm_id}`}><button className="btn btn-secondary" style={{ width: "100px", marginTop: "-75px", marginLeft: "650px" }}>Edit</button></Link>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className="card w-50 offset-3 mt-2">
                                    <img style={{ width: "50px", height: "50px" }} className="rounded-circle mt-3 ml-3" src={`http://127.0.0.1:5000/${e.profileImageLink}`} alt="..."></img>
                                    <div className="ml-3 mt-3 text-danger"><b>{e.name}</b></div>
                                    <div className="offset-2 mb-5" style={{ marginTop: "-70px" }}>{e.comment}</div>
                                    <div className="text-success" style={{ marginLeft: "800px" }}>{e.commentedAt}</div>
                                </div>
                            )

                        }

                    })
                )
            }
            else {
                return (
                    <div>No Comments</div>
                )

            }
        }
        let blogDetials = this.state.blog
        return (
            <div>
                <Navbar />

                <div class="card mb-3 w-50 offset-3 mt-5">
                    <div class="row no-gutters">
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">{blogDetials.blog_title}</h5>
                                <div>
                                    <p class="card-text">{blogDetials.blog_content}</p>
                                </div>
                                <p class="card-text mt-3"><small class="text-muted">Category: {blogDetials.category}</small></p>
                                <p class="card-text"><small class="text-muted">Posted at {blogDetials.postedAt}</small></p>
                                <p class="card-text mt-2" style={{ float: "left" }}><b>Author:</b> {blogDetials.name}</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <img src={`http://127.0.0.1:5000/${blogDetials.postImageLink}`} style={{ height: "270px", marginTop: "15px" }} class="card-img" alt="..." />
                        </div>

                    </div>
                </div>
                <h4 className="offset-3 mt-3">Add Comment</h4>
                <textarea className="offset-3 mt-2" rows="10" cols="105" name="comment" onChange={this.onChange} value={this.state.comment}></textarea>
                <button className="btn btn-primary offset-3 mt-1" onClick={this.onClick}>Comment</button>
                <h3 className="offset-3 mt-5">
                    All Comments
                </h3>
                <div className="mb-3">
                    {showComment()}
                </div>
            </div>
        )
    }
}
