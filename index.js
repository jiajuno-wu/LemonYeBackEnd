const express = require('express')
const app = express()

require('dotenv').config();

const mongoose = require('mongoose');

const port = process.env.PORT  || 3000;

app.use("/uploads", express.static("uploads"));   
// make expree to serve static file in folder uploads when request make to /uploads/....jpg


// routes
const drinkRoute = require('./src/drinks/drink.route');

app.use('/api/drinks', drinkRoute);



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