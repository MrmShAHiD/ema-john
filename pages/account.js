import { parseCookies } from 'nookies'
import baseUrl from '../helpers/baseUrl'
import UserRoles from '../components/UserRoles/UserRoles'
import { useRef } from 'react'

const Account = ({orders}) =>{
    const orderCard = useRef(null)
    const cookie = parseCookies()
    const user = cookie.user ? JSON.parse(cookie.user):""
    const OrderHistory = () => {
        return (
            <ul ref={orderCard}>
                {orders.map(item =>{
                    return (
                        <li key={item._id}>
                            <div>{item.createdAt}</div>
                            <div>
                                <h5>Total (BDT){item.total}</h5>
                                {
                                    item.products.map(pitem =>{
                                        return <h6 key={pitem._id}>{pitem.product.name} X {pitem.quantity}</h6>
                                    })
                                }
                            </div>
                        </li>
                    )
                })}
            </ul>
        )
    }
    return (
        <div className="login-card">
            <div>
                <h2>{user.name}</h2>
                <h5>{user.role}</h5>
                <h4>{user.email}</h4>
            </div>
            <h3>Order History</h3>
            {
                orders.length == 0 ?
                <div>
                    <h5>You have no order history.</h5>
                </div>
                :<OrderHistory/>
            }
            {
                user.role == 'root' && <UserRoles/>
            }
        </div>
    )
}

export async function getServerSideProps(ctx){
    const {token} = parseCookies(ctx)
    if(!token){
        const {res} = ctx
        res.writeHead(302,{Location:"/login"})
        res.end()
    }

    const res = await fetch(`${baseUrl}/api/orders`,{
        headers:{
            "Authorization": token
        }
    })

    const res2 = await res.json()
    console.log(res2)

    return {
        props:{orders:res2}
    }
}

export default Account