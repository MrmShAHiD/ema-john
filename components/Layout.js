import NavBar from "./NavBar"
import Head from 'next/head'

const layout = ({ children }) => {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="/style.css"></link>
            </Head>
            <NavBar/>
            { children }
        </>
    )
}

export default layout