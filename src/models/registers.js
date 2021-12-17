const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const employeeSchema = new mongoose.Schema({
    fname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    phone:{
            type: Number,
            required: true,
            min: 10,
            unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    Password:{
        type: String,
        required: true
    },
    confirmpassword:{
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]

})

//generating token
employeeSchema.methods.generateAuthToken = async function(){
        try {
            // const token = jwt.sign({_id: this._id.toString()} , "chetaniscleverboyandhewilldefinatelygoingtogetthejobsoonwiil");
            // //console.log(token);
            // this.tokens = this.tokens.concat({token: token})
            // await this.save();
            //  return token;

             const user  = this
             const token =  jwt.sign({ _id: user.id.toString() }, process.env.SECRET_KEY)
             user.tokens = user.tokens.concat({ token })
             await user.save()
             return token
        
        } catch (error) {
            res.send("the error " + error);
            console.log("the error part" + error);
        }

    
}


// converting password into hash
employeeSchema.pre("save", async function(next){

    if (this.isModified("Password")){
    this.Password = await bcrypt.hash(this.Password, 10);
    this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
}
    next()
})

// we need to create collection

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;