const express = require("express");
const router = express.Router();
const Drinks = require('../drinks/drinkSchema')

const multer = require("multer")
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/productImages');  // Specify the folder where images will be stored
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);  // Generate a unique filename for each image
    }
  });

const upload = multer({storage});



router.post('/addDrink', upload.single('productImage') ,async(req,res) => {
    console.log(req.body);
    console.log(req.file);
    try {
        const {product_name_en,
            product_name_ch,
            product_price,
            product_description} = req.body;
        const imagePath = `/uploads/productImages/${req.file.filename}`;     
        const drink = new Drinks({
            product_name_en : product_name_en,
            product_name_ch : product_name_ch,
            product_price : product_price,
            product_description : product_description,
            image_url : imagePath
        });
        await drink.save();
        res.status(200).send({message: "drink added successfully", drink: drink})
    } catch (error) {
        console.error("Error adding drink", error);
        res.status(500).send({message: "Failed to add drink"})
    }
})

//Create API to retrive single drink 
router.get("/:id", async(req,res)=>{
  try {
    const {id} = req.params;
    const drink = await Drinks.findById(id);
    if(!drink){
      res.status(404).send({message: "drink are not Found!"})
    }
    res.status(200).send(drink)

  } catch (error) {
    console.error("Error fetching book", error);
    res.status(500).send({message: "Failed to fetch drink"})
  }
})


// get all drink
router.get("/", async(req,res)=>{
  try {

    const drinks = await Drinks.find();
    if(!drinks){
      res.status(404).send({message:"There is no drink in the database"})
    }
    res.status(200).send(drinks);

  } catch (error) {
    console.error("Error fetching book", error);
    res.status(500).send({message: "Failed to fetch drink"})
  }
})






module.exports = router;