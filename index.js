const express = require('express')
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

// enable http cookie
app.use(cookieParser());

app.use(cors({
  origin : "http://localhost:5173",
  credentials: true
}));

require('dotenv').config();

const mongoose = require('mongoose');

const port = process.env.PORT  || 3000;

app.use("/uploads", express.static("uploads"));   
// make expree to serve static file in folder uploads when request make to /uploads/....jpg

app.use(express.json()); 
// routes
const drinkRoute = require('./src/drinks/drink.route');
const adminRoute = require('./src/admin/admin.route');

app.use('/api/drinks', drinkRoute);
app.use('/api/auth', adminRoute);


async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    app.use("/", (req, res) => {
      res.send("Book Store Server is running!");
    });
}

main().then(() => console.log("Mongodb connect successfully!")).catch(err => console.log(err));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
