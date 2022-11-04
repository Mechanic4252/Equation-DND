const Tiles = require('./model/tiles');

//Function to fetch all symbols from database
//This database is hosted at MongoDB Atlas
exports.getAllSymbols =async (req,res)=>{
    const data = await Tiles.find();
    console.log(data);
    if(!data){
        res.status(300).send("Some Error Occured");
    }
    res.status(200).json(data);
}

//For Post request this function create new entry in database
exports.setSymbol = async (req,res)=>{
    try{
        const sym = await Tiles.create({
            symbol:req.body.symbol,
            value: req.body.value
        })
        const data =Tiles.find().then((data)=>{
            res.status(200).json({
            status:"Success",
            data
            })
        })
    }catch (err){
        res.status(400).json({
            status: "failure",
            message:"Please provide valid data"
        })
    }
    
    
}

//This function delete entry from database
exports.deleteSymbol= async (req,res)=>{
    
    const id=req.params.Id;
    console.log(id);
    const sym=await Tiles.findByIdAndDelete(id);
    
    res.status(200).json({
        status:"success"
    })
    
}