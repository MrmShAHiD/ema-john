import mongoose from 'mongoose'

function initDB(){
    if(mongoose.connections[0].readyState){
        console.log('already connected')
        return 
    }
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    mongoose.connection.on('connected', () => {
        console.log('connected to mongo')
    })
    mongoose.connection.on('error', (err) => {
        console.log('error connecting', err)
    })
}

export default initDB