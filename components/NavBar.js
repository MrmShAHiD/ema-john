import Link from 'next/link'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import cookie from 'js-cookie'

const NavBar = () => {
  const router = useRouter()
  const cookieUser = parseCookies()
  const user = cookieUser.user ? JSON.parse(cookieUser.user) : ""
  return (
    <div className="nav-bar">
      <Link href="/"><a><img src="https://i.ibb.co/2d6bCzD/logo.png" style={{width:"35%", marginLeft:"20px"}}/></a></Link>
      <div className="nav-item">
        <Link href="/cart"><a>Cart</a></Link>
          {
            user.role == 'admin' &&
            <Link href="/create"><a>Create</a></Link>
          }
          {
            user ?
            <>
              <Link href="/account"><a>Account</a></Link>
              <button onClick={()=>{
                cookie.remove('token')
                cookie.remove('user')
                router.push('/login')
              }}>Logout</button>
              <p>{user.name}</p>
              <img src="https://i.ibb.co/BrbQhHK/avatar-2x.png"/>
            </>
            :
            <>
              <Link href="/login"><a>Login</a></Link>
              <Link href="/register"><a>Register</a></Link>
            </>
          }
      </div>
    </div>
  )
}

export default NavBar