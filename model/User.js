const mongosose= require('mongoose');
const validator= require('validator');
const bcrypt=require('bcryptjs');
const UserSchema = new mongosose.Schema({

    name:{
        type:String,
        required:[true,'please enter your name'],
        maxlength:60
    },
    email:{
        type:String,
        required:[true,'please enter your email'],
        maxlength:60,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'please enter validate email'
        }
    },
    password:{
        type:String,
        required:[true,'please enter your password'],
        minlength:6
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }




})


UserSchema.pre('save',async function(){
    if(!this.isModified('password'))return;
    const salt =await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)

});


UserSchema.methods.comparePassword =async function (candidatePassword){

    const isValid=await bcrypt.compare(candidatePassword,this.password);
  

    return isValid
}


module.exports=mongosose.model('User',UserSchema)