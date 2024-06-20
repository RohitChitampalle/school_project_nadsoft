const express = require("express")
const cors = require('cors');
// const dotenv = require('dotenv')
require('dotenv').config()
const port = 8022;

//db connection 

// dotenv.config();
const connection = require("./Models/model");

//routes
const parentRouter = require("./Routes/parent_routes")
const studentRouter = require("./Routes/routes")

// const statusRouter = require("./routes/statusRoutes")
// const roleRouter = require("./routes/roleBased")

const app = express()

//Middleware - Plugin
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json()); 


//Routes
app.use("/api/parent/", parentRouter)
app.use("/api/student/", studentRouter)
// app.use('/api/role/', roleRouter)


app.listen(port, () => {
    console.log(`server is running on ${port}`)
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connection created with Mysql successfully");
    });
})