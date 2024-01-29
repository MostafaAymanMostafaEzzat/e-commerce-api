const StatusCodes =require('http-status-codes')
const CustomError =require('../errors')
const Order =require('../model/Order');
const Product=require('../model/Product')
const { checkPermissions } = require('../utils');

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue';
  return { client_secret, amount };
};

const getAllOrders=async (req,res)=>{
  const orders = await Order.find({}).populate({
    path:'user',
    select:'name'
  })
res.status(StatusCodes.OK).json({orders,count: orders.length})
}
const getSingleOrder=async (req,res)=>{
  const {id:orderId}=req.params
  const order = await Order.findOne({_id:orderId})
  if(!order ){
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`)
  }
  checkPermissions({reqUser:req.user,resourceId:order.user})
  res.status(StatusCodes.OK).json({order})
  }
const getCurrentUserOrders=async (req,res)=>{
  const orders = await Order.find({user:req.user.userId})
res.status(StatusCodes.OK).json({orders,count: orders.length})
}
const createOrder=async (req,res)=>{
  const {items:cartItems,tax,shippingFee}=req.body
  if(!cartItems || cartItems.length < 1){
    throw new CustomError.BadRequestError('there isnt any product in cartItems')
  }
  if(!tax || !shippingFee ){
    throw new CustomError.BadRequestError('please, Enter tax and shippingFee ')
  }
  let orderItems=[]
  let subtotal = 0 
  for(const item of cartItems){
    const dbProduct = await Product.findOne({_id:item.product})
    if(!dbProduct ){
      throw new CustomError.NotFoundError(`No product with id : ${item.product}`)
    }
    const {name,image,price}=dbProduct;
    if(!item.amount){
      throw new CustomError.NotFoundError(`please provide the amount of product for ${name}  `)
    }
   
    const singleOrderItem={
      name,
      image,
      price,
      amount:item.amount,
      product:item.product
    }
     orderItems=[...orderItems,singleOrderItem]
    subtotal += price*item.amount

  }
  const total =subtotal+shippingFee+tax
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  });
  const order = await Order.create({
    tax,shippingFee,subtotal,total,orderItems,user:req.user.userId,clientSecret:paymentIntent.client_secret
  })
  res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret });
  }
const updateOrder=async (req,res)=>{
  const {id:orderId}=req.params
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({_id:orderId})
  if(!order ){
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`)
  }
  checkPermissions({reqUser:req.user,resourceId:order.user})
  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });

}

module.exports={
  getAllOrders,getSingleOrder,getCurrentUserOrders,createOrder,updateOrder
}