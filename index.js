const app=require('./app')
const dotenv=require('dotenv')

const connectDb=require('./config/database')

process.on('uncaughtException',(err)=>{
    console.log(`Error ${err.message}`)
    process.exit(1)
})

dotenv.config({path:'config/config.env'})
connectDb()


 


let server=app.listen(process.env.PORT,()=>{
    console.log(`port is working on the ${process.env.PORT}`)
})


process.on('unhandledRejection',(err)=>{
    console.log(`Error ${err.message}`)
    server.close(()=>{
        process.exit(1)
    })
})
 