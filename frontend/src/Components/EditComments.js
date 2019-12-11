import React, { Component } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
export default class EditComments extends Component {
    constructor(props) {
        super(props)

        this.state = {
            temp_comment: "",
            user_id: '',
            comment: '',
            tokenId: localStorage.getItem("token"),
            blog_id: ''
        }
    }
    componentDidMount = (e) => {
        axios.get("http://127.0.0.1:5000/get-comment-blog/" + this.props.match.params.comm_id)
            .then((response) => {
                this.setState({
                    temp_comment: response.data[0].comment,
                    blog_id: response.data[0].blog_id
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
                this.setState({
                    user_id: response.data.user_id.toString(10)
                })
            })
    }
    onChange = (e) => {
        e.preventDefault()
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onSubmit = (e) => {
        e.preventDefault()
        axios.put("http://127.0.0.1:5000/edit-comment/" + this.props.match.params.comm_id, {
            headers: {
                user_id: this.state.user_id,
                comment: this.state.blog_comment
            }
        })
            .then(response => {
                console.log(response.data)

                this.props.history.push(`/addComments/${this.state.blog_id}`)
            })
            .catch(error => {
                console.log(error)
            })
    }
    render() {
        return (
            <div>
                <Navbar />
                <form onSubmit={this.onSubmit}>
                    <h4 className="offset-3 mt-3">Edit Comment</h4>
                    <textarea className="offset-3 mt-2" rows="8" cols="65" name="comment" onChange={this.onChange} value={this.state.temp_comment}></textarea>
                    <br></br>
                    <button className="btn btn-primary btn-lg offset-3">Save Changes</button>
                </form>
            </div>
        )
    }
}
