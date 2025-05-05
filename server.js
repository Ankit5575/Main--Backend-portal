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
                                          //every thing is perfect author $Ankit Sing ??
//cors policy 
app.use(cors()) //this allow all origin 

// app.use(express.json());
// app.use(express.json());  // Add this line
app.use(cors({
  origin: ['http://localhost:5173/', 'ttps://newportal.onrender.com'],
  credentials: true
}));

app.use(bodyParser.json());
// For form-data (optional if using multer)
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('🙋‍♂️🙋‍♂️🙋‍♂️JTTI HELP.IN')
})
//user add routes
const user = require("./routes/user.routes.js")
const admin = require("./routes/adminRoutes.js")
const announcement = require("./routes/announcement.routes.js")
const quizRoutes = require('./routes/quiz');

app.use('/admin/quiz', quizRoutes); // 🔥 Route for admin

app.use("/api/user" ,  user)
app.use("/admin" ,  admin)
app.use("/admin/announcement" , announcement)
// app.use("/admin/quiz" , quiz)
 
 // app.use("/api/user" ,upload)
//app.use("admin routes / create user / edit user / delete user 
// ")
// app.use("/api/admin/" ,  admin)
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
