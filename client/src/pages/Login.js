import { useState } from 'react'

function App() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function loginUser(event) {
        event.preventDefault();

        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })

        const data = await response.json();

        if(data.user) {
            localStorage.setItem('token', data.user)
            alert('Login sucessfull !!');
            window.location.href = '/dashboard'
        } else {
            alert('Wrong Credentials !! Try again.. ')
        }
    }

    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={loginUser}>                
                <input 
                    type="text" 
                    placeholder='Your email..'
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />
                <br/>
                <input 
                    type="password" 
                    placeholder='Your password..'
                    value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <br/>
                <input type="submit" value='Login'/>
            </form>
        </div>
    )
}

export default App;