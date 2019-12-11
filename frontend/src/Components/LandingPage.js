import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Home extends Component {
    constructor(props) {
        super(props)    
        this.state = {             
        }
    }
    componentDidMount =()=>{
        window.localStorage.removeItem("token")
    }
    
    render() {
        return (
            <div>
                <Link  to="/login"><button className="btn btn-primary mt-5 offset-5">Login</button></Link>
                <Link to="/signup"><button className="btn btn-danger mt-5 ml-3">Sign Up</button></Link>
            </div>
        )
    }
}
