import React, { Component } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
class EditBlog extends Component {
    constructor(props) {
        super(props)

        this.state = {
            blog_title: '',
            blog_id: '',
            blog_content: '',
            user_id: '',
            tokenId: localStorage.getItem("token"),
            temp_title: '',
            temp_content: ''
        }
    }
    componentDidMount = (e) => {
        axios.get("http://127.0.0.1:5000/show-one-blog/" + this.props.match.params.blog_id)
            .then((response) => {
                this.setState({
                    temp_title: response.data[0].blog_title,
                    temp_content: response.data[0].blog_content
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
                console.log(response.data.user_id)
                this.setState({
                    user_id: response.data.user_id.toString(10)
                })
            })
    }
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault()
        axios.put("http://127.0.0.1:5000/edit-blog/" + this.props.match.params.blog_id, {
            headers: {
                user_id: this.state.user_id,
                blog_content: this.state.blog_content,
                blog_title: this.state.blog_title
            }
        })
            .then(response => {
                console.log(response.data)

                this.props.history.push(`/userBlog/${this.state.user_id}`)
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
                    <h2 className="offset-3 mt-3 text-danger" >Edit Blog</h2>
                    <h4 className="offset-3 mt-2">Title</h4>
                    <textarea className="offset-3 mt-2" rows="2" cols="80" name="blog_title" value={this.state.temp_title} onChange={this.onChange}></textarea>
                    <h4 className="offset-3 mt-2">Content</h4>
                    <textarea className="offset-3 mt-2" rows="8" cols="80" name="blog_content" value={this.state.temp_content} onChange={this.onChange}></textarea>
                    <br></br>
                    <button className="btn btn-primary offset-5 mt-2 btn-lg">Save Changes</button>
                </form>
            </div>
        )
    }
}
export default EditBlog;
