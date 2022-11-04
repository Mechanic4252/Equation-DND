const mongoose = require("mongoose");

//Schema for Database
const symbolSchema = new mongoose.Schema({
    symbol :{
        type: String,
        required: [true,'Symbol must have a symbol'],
        unique: true
    },
    value :{
        type: Number,        
        required: [true,'Symbol must have a symbol']
    }
})

const Data = mongoose.model('Data',symbolSchema);

module.exports = Data;