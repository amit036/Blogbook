import React, { Component } from 'react'
import axios from 'axios'
export default class AddBlogCategory extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             category:'',
             auth_password:''
        }
    }
    
    onChange = (e) => {
        e.preventDefault()
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onSubmit = (e) => {
        e.preventDefault()
        var categoryDetails = {
            category: this.state.category,
            auth_password:this.state.auth_password
        }
        axios.post("http://127.0.0.1:5000/add-blog-category",categoryDetails)
            .then(response => {
                 alert(response.data)
                if(response.data =="Added Successfully")
                {
                    this.props.history.push('/')
                }
               
                console.log(response.data)           
            })
            .catch(error => { console.log(error) })

    }
    render() {
        return (
            <div>
                <h2 className="offset-3 mt-5">Add Category</h2>
                <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <div className="input-group">
                        <input type="text" style={{height:"50px"}} className="offset-3 mt-4 w-25 text-center" name="category" placeholder="Add Category" required="required" onChange={this.onChange} />
                    </div>
                </div>
                <div className="form-group">
                    <input type="password" style={{height:"50px"}} className="offset-3 mt-4 w-25 text-center" placeholder="Authentication Password" name="auth_password" required="required" onChange={this.onChange} />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-lg w-25 offset-3">Add</button>
                </div>
                </form>
            </div>

        )
    }
}
