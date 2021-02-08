import Link from 'next/link'
import {useState} from 'react'
import baseUrl from '../helpers/baseUrl'
import {parseCookies} from 'nookies'

const Create = () => {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [media, setMedia] = useState("")
    const [description, setDescription] = useState("")

    const handleSubmit = async (e) => { 
        e.preventDefault()
        try{
            const mediaUrl = await imageUpload()
            const res = await fetch(`${baseUrl}/api/products`,{
                method: "POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    name,
                    price,
                    mediaUrl,
                    description
                })
            })
            const res2 = await res.json()
            if(res2.error){
                console.log(res2.error)
            }else{
                console.log("Product saved")
            }
        }catch(err){
            console.log(err)
        }
    }

    const imageUpload = async () => {
        const data = new FormData()
        data.append('file',media)
        data.append('upload_preset', "mystore")
        data.append('cloud_name', "shahidsimg")
        const res = await fetch("https://api.cloudinary.com/v1_1/shahidsimg/image/upload", {
            method:"POST",
            body:data
        })
        const res2 = await res.json()
        return res2.url
    }

    return (
        <form onSubmit={(e)=>handleSubmit(e)}>
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => {setName(e.target.value)}}
            />
            <input
                type="text"
                name="price"
                placeholder="Price"
                value={price}
                onChange={(e) => {setPrice(e.target.value)}}
            />
            <input
                type="file"
                accept="image/*"
                onChange={(e)=>setMedia(e.target.files[0])}
            />
            <img style={{width:"5%"}} src={media?URL.createObjectURL(media):""} alt=""/>
            <textarea
                name="description"
                placeholder="Description"
                value={description} cols="30"
                rows="10"
                onChange={(e) =>{setDescription(e.target.value)}}
            ></textarea>
            <button type="submit">Submit</button>
        </form>
    )
}

export async function getServerSideProps(ctx){
    const cookie = parseCookies(ctx)
    const user = cookie.user ? JSON.parse(cookie.user) : ""
    if(user.role != 'admin'){
        const {res} = ctx
        res.writeHead(302,{Location:"/"})
        res.end()
    }

    return {
        props:{}
    }
}

export default Create