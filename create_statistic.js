const Product = require('./app/models/Product')
const Statistic = require('./app/models/Statistic')
async function auto_create(){
    let date = new Date()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    let statistic = await Statistic.find({year}).lean()
    let product = await Product.find({}).lean()
    if(product.length > 0){
        let quantity_product = product.reduce((acc, item) => {
            return acc += item.quantity
        }, 0)
        console.log(quantity_product)
        if(statistic.length === 0){
            for(let i = 1; i <= 12; i++){
                let data = {
                    month: i,
                    year,
                    all_product: quantity_product,
                    product_sold: 0,
                    product_remain: quantity_product,
                }
                let statistic_add = new Statistic(data)
                statistic_add.save()
            }   
        }
    }
}

module.exports = {auto_create}