const express = require("express");
const jwt = require("jsonwebtoken")
const app = express();

app.use(express.json());

app.get("/something", function(req, res, next){
    const header = req.headers['authorization'];
    console.log("hellkzhsldfajlsfjd")
    console.log(header);
    
    const decode = jwt.verify(header, "secret_code");
    if(!decode){
        res.status(400).json({
            "msg": "sorry sir you are not authenticated please try again later..."
        })
        return
    }
    req.username = decode.username;
    req.email = decode.email;

    next();
},(req, res)=> {
    const username = req.username;
    const email = req.email;
    console.log("username", username);
    console.log("email", email);

    res.status(200).json("you are authenticated");
})




app.post("/signup", (req, res)=> {
    const {username, email, age} = req.body;
    console.log(username, email, age);
    res.status(200).json("you are successfully signed up")
})

app.post("/signin", (req, res)=> {
    const {username, email} = req.body;
    console.log(username, email);
    const token = jwt.sign({"username":username,"email": email}, "secret_code");
    console.log("token", token);
    res.status(200).json({
        "msg": "you have successfully logged in",
        token
    })
})

app.listen(3000);