const mongoose = require('mongoose')

async function connect(){
    try{
        await mongoose.connect('mongodb://localhost:27017/CloneShopee', {
        //'mongodb://localhost:27017/CloneShopee'
        //'mongodb+srv://Apocalysed:anhtien2812@cluster0.jwouo.mongodb.net/CloneShopee?retryWrites=true&w=majority'
            useNewUrlParser: true,
            useUnifiedTopology: true
        })  
        console.log("Connect Successfully")
    }
    catch(error){
        console.log("Connect Failure")
    }
}

module.exports = {connect};

