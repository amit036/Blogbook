import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'

const MAX_LENGTH = 250

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allBlogs: [],
            user_id: '',
            tokenId: localStorage.getItem("token"),
            per_page: 0,
            page: 1,
            total_page: 0
        }
    }
    componentDidMount = (page = 1) => {
        axios.get(`http://127.0.0.1:5000/show-all-blog?page=${page}`)
            .then((response) => {
                this.setState({
                    allBlogs: response.data.data,
                    total_pages: response.data.total_pages
                })
                console.log(response.data)
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
    pagination = (pageNo) => {
        this.setState({
            page: pageNo
        })
        this.componentDidMount(this.page = pageNo)
    }
    render() {
        const pageNumbers = [];
        for (let i = 1; i <= this.state.total_pages; i++) {
            pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <button className="btn btn-secondary ml-2" onClick={() => this.pagination(number)}>{number}</button>
            );
        });
        let user = this.state.allBlogs
        let showBlogs = user.map(e => {
            let text = e.blog_content
            return (

                <div class="card mb-3 w-50 offset-3">
                    <div class="row no-gutters">
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">{e.blog_title}</h5>
                                <div>
                                {text.length > MAX_LENGTH ?   
                                    <p class="card-text"> {`${text.substring(0, MAX_LENGTH)} ...`} <Link to={`/addComments/${e.blog_id}`}><span className="">Read More</span></Link></p>
                                     :
                                    <p>{text}</p>
                                }
                                </div>
                                <p class="card-text"><small class="text-muted">Category: {e.category}</small></p>
                                <p class="card-text"><small class="text-muted">Posted at {e.postedAt}</small></p>
                                <p class="card-text mt-2" style={{ float: "left" }}><b>Author:</b> {e.name}</p>
                                <Link to={`/addComments/${e.blog_id}`}><img src="https://image.flaticon.com/icons/svg/1381/1381552.svg" style={{ width: "30px", height: "30px", float: "right", marginRight: "150px" }}></img></Link>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <img src={`http://127.0.0.1:5000/${e.postImageLink}`} style={{ height: "270px", marginTop: "15px" }} class="card-img" alt="..." />
                        </div>

                    </div>
                </div>
            )
        })
        return (
            <div>
                <Navbar />
                <h1 className="text-center">All Blogs</h1>
                {showBlogs}
                <div className="offset-5 mt-3 mb-5">
                    {renderPageNumbers}
                </div>
            </div>
        )
    }
}
