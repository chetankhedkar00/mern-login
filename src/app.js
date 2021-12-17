require("dotenv").config();
const express = require("express");
const path = require('path');
const app = express();
const bcrypt = require('bcryptjs')
require("./db/conn")
const hbs = require("hbs");
const Register = require("./models/registers")
const port = process.env.PORT || 8000;


app.use(express.json());
app.use(express.urlencoded({extended: false}))

// 
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path)



app.get("/", (req, res)=>{
    res.render("index");
})
app.get("/register", (req, res)=>{
    res.render("register")
})
app.get("/login", (req, res)=>{
    res.render("login")
})

//Login  check
app.post("/login", async (req, res)=>{
    try {
        const email = req.body.email;
        const pass = req.body.password;
        const userEmail = await Register.findOne({email: email});

        const isMatch = await bcrypt.compare(pass, userEmail.Password);
        const token = await userEmail.generateAuthToken();
           // console.log("the token part" + token)

        if (isMatch){
            res.status(201).render("index");
        }else{
            res.send("Invalid login Details")
        }
    } catch (error) {
        res.status(400).send("invalid login Details");
    }
})

// create a new user in database
app.post("/register", async (req, res) =>{
    try {
        const password = req.body.password;
        const cpassword = req.body.password1;

        if (password === cpassword){
        const registerEmployee = new Register({
            fname: req.body.fname,
            lastname: req.body.lname,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            Password: password,
            confirmpassword: cpassword  
        })
            //console.log("the cucces part " + registerEmployee);
            const token = await registerEmployee.generateAuthToken();
            //console.log("the token part" + token)
            const regdata = await registerEmployee.save()


            res.status(201).render("index")
        }else{
            res.send("Password are not matching")
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));