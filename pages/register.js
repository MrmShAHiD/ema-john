import Link from 'next/link'
import {useState} from 'react'
import baseUrl from '../helpers/baseUrl'
import { useRouter } from 'next/router'

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const router = useRouter()

  const userRegister = async(e)=>{
    e.preventDefault()
    const res = await fetch(`${baseUrl}/api/register`,{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        name,
        email,
        password
      })
    })

    const res2 = await res.json()
    if(res2.error) {
      console.log(res2.error)
    }else{
      console.log(res2.message)
      router.push('/login')
    }
  }

  return (
    <div className="login-card">
      <img src="https://i.ibb.co/BrbQhHK/avatar-2x.png"/>
      <h3>Register</h3>
      <form onSubmit={(e)=>userRegister(e)}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />
        <br/>
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
        <button type="submit">Register</button>
        <Link href="/login"><a><h5>Already have an account? Login</h5></a></Link>
      </form>
    </div>
  )
}

export default Register