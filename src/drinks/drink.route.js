const fs = require('fs');
const verifyAdminToken = require('../middleware/verfiyAdminToken');
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



router.post('/addDrink',verifyAdminToken,upload.single('productImage') ,async(req,res) => {
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
            avaiable: avaiable === 'true',
            popular: popular === 'true',
            recommend: recommend === 'true',
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

// delete a Drink
router.delete("/:id",verifyAdminToken,async(req,res)=>{
  try {
    const {id} = req.params;
    const drink = await Drinks.findById(id);

    if(!drink){
      return res.status(404).send({message: "drink is not Found!"}) 
    }

    // Delete Image
    if (drink.image_url) {
      const imgPath = path.join(__dirname, "..", ".." ,drink.image_url);  
      // __dirname give /home/jiajun/Desktop/LemonYe Project/LemonYeBackEnd/src/drinks, ".." will go up one level.
      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
          return;
        }
      });
    }

    await Drinks.findByIdAndDelete(id);
    res.status(200).send({message:"Drink deleted", drink:drink})

  } catch (error) {
    console.error("Error fetching book", error);
    res.status(500).send({message: "Failed to delete drink"})
  }
})

// update API
/* what if successsfly detele image but fail to delete data in DB or via versa */
router.put("/edit/:id",verifyAdminToken ,upload.single('productImage') ,async(req,res)=>{

  try {

    const {id} = req.params;
    const updateData = { ...req.body };
    const oldDrink = await Drinks.findById(id);

    if(req.file){
      // delete old image
      if (oldDrink.image_url) {
        const imgPath = path.join(__dirname, "..", ".." ,oldDrink.image_url);  
        fs.unlink(imgPath, (err) => {
          if (err) {
            console.error("Failed to delete image:", err);
          }
        });
      }

      // update new image path to image_url 
      updateData.image_url = `/uploads/productImages/${req.file.filename}`;
    
    }
    const newDrink = await Drinks.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).send({message:"drink updated", drink:newDrink});

  } catch (error) {

    console.error('Update error:', error);
    res.status(500).send({ message: 'unable to update' });

  }
})


module.exports = router;