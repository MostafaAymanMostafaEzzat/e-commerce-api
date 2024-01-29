require('dotenv').config()
require('express-async-errors')

const express =require('express');
const app =express();
const connectDB =require('./db/connect')
const notFoundMiddleware= require('./middleware/not-found')
const errorHandlerMiddleware= require('./middleware/error-handler')
const morgan = require('morgan')
const authRoute=require('./routers/authRouter')
const cookie_parser=require('cookie-parser')
const userRoute=require('./routers/UserRouters')
const prodctRoute=require('./routers/productRouter')
const fileUpload= require('express-fileupload')
const ReviewProduct= require('./routers/reviewRouter')
const OrderRoute=require('./routers/orderRouter')
//secure packages
const ratelimiter=require('express-rate-limit')
const helmet=require('helmet')
const xss=require('xss-clean')
const cors=require('cors')
const mongoSanitize=require('express-mongo-sanitize')
//Middleware
app.use(ratelimiter({
    windowMs:15 *1000 *60,
    max:60,
}))
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())
app.use(express.json())
app.use(morgan('tiny'))
app.use(cookie_parser(process.env.JWT_SECRET))
app.use(express.static('./public'));
app.use(fileUpload())

//routes
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/users',userRoute)
app.use('/api/v1/products',prodctRoute)
app.use('/api/v1/reviews',ReviewProduct)
app.use('/api/v1/orders',OrderRoute)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port=process.env.PORT || 5000
const start =async  ()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
        
    } catch (error) {
       console.log(error) 
    }

}
start()


