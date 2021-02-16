import { useRouter } from 'next/router'
import baseUrl from '../../helpers/baseUrl'
import { parseCookies } from 'nookies'
import { useState } from 'react'
import cookie2 from 'js-cookie'

const Product = ({product}) => {
    const [quantity, setQuantity] = useState(1)
    const router = useRouter()
    const cookie = parseCookies()
    const user = cookie.user ? JSON.parse(cookie.user) : ""
    if(router.isFallback){
        return (
            <h3>Loading...</h3>
        )
    }

    const deleteProduct = async () => {
        const res = await fetch(`${baseUrl}/api/product/${product._id}`,{
            method:"DELETE"
        })
        await res.json()
        router.push('/')
    }

    const AddToCart = async ()=>{
        const res = await fetch(`${baseUrl}/api/cart`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": cookie.token
            },
            body:JSON.stringify({
                quantity,
                productId:product._id
            })
        })
        const res2 = await res.json()
        if(res2.error){
            cookie2.remove("user")
            cookie2.remove("token")
            router.push('/login')
        }
        console.log(res2.message)
    }

    return(
        <div style={{textAlign: 'center'}}>
            <div style={{border: '2px solid grey', borderRadius:"2%", margin:'3% 10% 1% 10%'}}>
                <h2>{product.name}</h2>
                <img src={product.mediaUrl} alt="" style={{width: '30%'}}/>
                <h4>${product.price}</h4>
            </div>
            <input
                type="number"
                style={{width:"100px", margin:'10px'}}
                min="1"
                value={quantity}
                onChange={(e)=>setQuantity(Number(e.target.value))}
                placeholder="Quantity"
            />
            {
                user ? <button onClick={()=>AddToCart()}>Add to Cart</button>
                :
                <button onClick={()=>router.push('/login')}>Login to add</button>
            }
            <p style={{marginBottom:'20px'}}>{product.description}</p>
            {
                user.role == 'admin' &&
                <button  style={{marginBottom:'20px'}} onClick={()=>deleteProduct()}>Delete</button>
            }
        </div>
    )
}

export async function getServerSideProps({params:{id}}) {
    const res = await fetch(`${baseUrl}/api/product/${id}`)
    const data = await res.json()
    return {
        props: {product:data}
    }
}

// export async function getStaticProps({params:{id}}) {
//     const res = await fetch(`${baseUrl}/api/product/${id}`)
//     const data = await res.json()
//     return {
//         props: {product:data}
//     }
// }

// export async function getStaticPaths() {
//     return {
//         paths: [
//             { params: { id: "6016016f5f48fde9711daa72"} }
//         ],
//         fallback: true
//     }
// }

export default Product