import React, { Component } from 'react'
import axios from 'axios'
import Navbar from './Navbar'

export default class AddBlog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allCategories: [],
            cat_id: '',
            blog_title: '',
            user_id: '',
            blog_content: '',
            postImageLink: '',
            tokenId: localStorage.getItem("token"),
            image: ''

        }
    }
    inputChange = (e) => {
        this.setState({
            postImageLink: e.target.files[0]
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('postImageLink', this.state.postImageLink)
        axios.post("http://127.0.0.1:5000/add-blog", formData, {
            headers: {
                cat_id: this.state.cat_id,
                user_id: this.state.user_id,
                blog_content: this.state.blog_content,
                blog_title: this.state.blog_title
            }
        })
            .then(response => {
                this.setState({
                    image: response.data.path

                })
                this.props.history.push('/home')
            })
            .catch(error => {
                console.log(error)
            })

    }
    componentDidMount = (e) => {
        axios.get("http://127.0.0.1:5000/show-blog-category")
            .then((response) => {
                this.setState({
                    allCategories: response.data
                })
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
            .catch((err) => alert(err))
    }
    render() {
        let blogCategory = this.state.allCategories.map(e => {
            return (
                <option value={e.cat_id}>{e.category}</option>
            )
        })
        return (
            <div>
                <Navbar />
                <form onSubmit={this.onSubmit}>
                    <h2 className="offset-3 mt-3 text-danger" >Post a Blog</h2>
                    <h4 className="offset-3 mt-2">Title</h4>
                    <textarea className="offset-3 mt-2" rows="2" cols="80" name="blog_title" onChange={this.onChange}></textarea>
                    <h4 className="offset-3 mt-2">Content</h4>
                    <textarea className="offset-3 mt-2" rows="8" cols="80" name="blog_content" onChange={this.onChange}></textarea>
                    <br></br>
                    <h4 className="offset-3 mt-2"> Blog Category</h4>
                    <select className="offset-3 form-control" style={{ "width": "300px" }} name="cat_id" onChange={this.onChange} required>
                        <option selected>Select Category</option>
                        {blogCategory}
                    </select>
                    <div className="form-group" style={{ "marginLeft": "900px", "marginTop": "-65px" }}>
                        <label>Choose Picture</label>
                        <input type="file" className="form-control-file" name="postImageLink" onChange={this.inputChange} />
                    </div>
                    <button className="btn btn-primary offset-4 w-25 mt-2 btn-lg">POST</button>
                </form>
            </div>
        )
    }
}
