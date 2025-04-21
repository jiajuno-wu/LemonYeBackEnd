const mongoose = require('mongoose');

const drinkSchema = new mongoose.Schema({
    product_name_en:{
        type: String,
        require: true,
    },
    product_name_ch:{
        type: String,
        require: true
    },
    product_price:{
        type : String,
        require : true,
    },
    product_description:{
        type: String,
        require: true
    },
    avaiable:{
        type: Boolean,
        default: false,
    },
    popular:{
        type: Boolean,
        default: false,
    },
    recommend:{
        type: Boolean,
        default: false,
    },
    image_url:{
        type: String,
    }
});

const Drinks = mongoose.model('Drinks', drinkSchema);

module.exports = Drinks





