import baseUrl from '../helpers/baseUrl'
import { parseCookies } from 'nookies'
import cookie from 'js-cookie'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'

const Cart = ({error,products}) => {
    const {token} = parseCookies()
    const router = useRouter()
    const [cProducts, setCartProduct] = useState(products)
    let price = 0

    if(!token){
        return (
            <div className="login-card">
                <h3>Please login to view your cart</h3>
                <Link href="/login"><a><button style={{marginBottom:"30px"}}>login</button></a></Link>
            </div>
        )
    }

    if(error){
        cookie.remove("user")
        cookie.remove("token")
        router.push('/login')
    }

    const handleRemove = async (pid) => {
        const res = await fetch(`${baseUrl}/api/cart`,{
            method:"DELETE",
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                productId:pid
            })
        })

        const res2 = await res.json()
        setCartProduct(res2)
    }

    const CartItems = () => {
        return (
            <div className="login-card">
                {cProducts.map(item =>{
                    price = price +item.quantity * item.product.price
                    return(
                        <div key={item._id}>
                            <img style={{width:"20%"}} src={item.product.mediaUrl} alt=""/>
                            <div style={{display:"flex", textAlign:'center'}}>
                                <h6 style={{marginLeft:'20%'}}>{item.product.name}</h6>
                                <h6 style={{marginLeft:'20%'}}>{item.quantity} X ${item.product.price}</h6>
                                <button style={{marginLeft:'20%'}} onClick={()=>{handleRemove(item.product._id)}}>Remove</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    const handleCheckout = async (paymentInfo) => {
        console.log(paymentInfo)
        const res = await fetch(`${baseUrl}/api/payment`,{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization":token
            },
            body:JSON.stringify({
                paymentInfo
            })
        })

        const res2 = await res.json()
        console.log(res2.message)
        router.push('/')
    }

    const TotalPrice = ()=>{
        return (
            <div style={{textAlign:'center', marginTop:'20px'}}>
                <h5>Total (BDT){price}</h5>
                {
                    products.length != 0 
                    &&
                    <StripeCheckout
                        name="ema-john"
                        amount={price*100}
                        image={products.length > 0 ? products[0].product.mediaUrl:""}
                        currency="USD"
                        shippingAddress={true}
                        billingAddress={true}
                        zipCode={true}
                        stripeKey="pk_test_51Han5sLHDkDOdrZDOJbGDqy6BxruClMUdkGXH4xUvi4YvTSy0NMi6IbM59sPDj2dYjn68GwaQkmPI6m13izJ8eZE00LTy8ooFK"
                        token={(paymentInfo)=>handleCheckout(paymentInfo)}
                    >
                        <button id="checkout">Checkout</button>
                    </StripeCheckout>
                }
            </div>
        )
    }

    return (
        <div>
            <CartItems/>
            <TotalPrice/>
        </div>
    )
}

export async function getServerSideProps(ctx){
    const {token} = parseCookies(ctx)
    if(!token){
        return {
            props:{products:[]}
        }
    }
    const res = await fetch(`${baseUrl}/api/cart`,{
        headers:{
            "Authorization":token
        }
    })
    const products = await res.json()
    if(products.error){
        return {
            props:{error:products.error}
        }
    }
    console.log("products", products)
    return {
        props:{products}
    }
}

export default Cart