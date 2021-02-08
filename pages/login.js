import Link from 'next/link'
import {useState} from 'react'
import baseUrl from '../helpers/baseUrl'
import cookie from 'js-cookie'
import { useRouter } from 'next/router'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter()
  const userLogin = async(e)=> {
    e.preventDefault()
    const res = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const res2 = await res.json()
    if(res2.error) {
      console.log(res2.error)
    }else{
      console.log(res2)
      cookie.set('token', res2.token)
      cookie.set('user',res2.user)
      router.push('/account')
    }
  }

  return (
    <div className="login-card">
      <img src="https://i.ibb.co/BrbQhHK/avatar-2x.png"/>
      <h3>Login</h3>
      <form onSubmit={(e)=>userLogin(e)}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <br/>
        <button type="submit">Login</button>
        <Link href="/register"><a><h5>New Member? Register</h5></a></Link>
      </form>
      
    </div>
  )
}

export default Login