const express = require('express')
const app = express()
const dotenv = require("dotenv")
const cors = require('cors');
const connectDB = require("./db/db.js")
const bodyParser = require('body-parser');

// const admin = require("../backend/routes/adminRoutes.js")
dotenv.config()
// const port = 3000

const PORT = process.env.PORT  || 6000 

connectDB()

//cors policy 
app.use(cors()) //this allow all origin 

// app.use(express.json());
app.use(express.json());  // Add this line
app.use(bodyParser.json());
// For form-data (optional if using multer)
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('🙋‍♂️🙋‍♂️🙋‍♂️MUKUNDPUR HELP.IN')
})
//user add routes
const user = require("./routes/user.routes.js")
const admin = require("./routes/adminRoutes.js")
 //upload Routes
// const upload = require("./routes/upload.routes.js")
//routes 
app.use("/api/user" ,  user)
app.use("/admin" ,  admin)
 // app.use("/api/user" ,upload)
//app.use("admin routes / create user / edit user / delete user 
// ")
// app.use("/api/admin/" ,  admin)
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})