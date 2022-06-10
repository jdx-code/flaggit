import React, {useState, useEffect} from 'react'
import jwt_decode from "jwt-decode"
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'


const Dashboard = () => {

    const navigate = useNavigate()
    const [user_id, setUserId] = useState()
    const [username, setUsername] = useState()
    const [myPost, setMyPost] = useState('')
    const [listOfPosts, setListOfPosts] = useState([])
    // const [listOfUsers, setListOfUsers] = useState([])

    async function welcomeMsg() {
        const req = await fetch('http://localhost:3001/api/welcome', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })

        const data = await req.json()
        if(data.status === 'ok') {            
            setUserId(data.user_id)
            setUsername(data.username)
            
        } else {
            alert('not ok man')
        }
    }    

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token) {
            const user = jwt_decode(token)
            if(!user) {
                localStorage.removeItem('token')
                navigate('/login')
            } else {
                welcomeMsg();
            }
        }

        Axios.get("http://localhost:3001/api/readPost")
        .then((response) => {

             console.log(response.data);

        }).catch(() => {
            console.log("err")
        });

    }, [])


    async function submitPost(event) {
        event.preventDefault()

        const response = await fetch('http://localhost:3001/api/addpost',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                myPost,
                user_id,
            }),
        })

        const data = await response.json()
    }

    return (
        <div>
            <h1>Hello { user_id } { username || 'guest'}</h1>
            <form onSubmit={submitPost}>
                <textarea 
                    placeholder='Your post here..'
                    value={myPost}
                    onChange={(e) => setMyPost(e.target.value)}
                />
                <input type="submit" value="Post it"/>
            </form>
            
        </div>
    )
}

export default Dashboard;