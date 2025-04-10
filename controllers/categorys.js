var categoryModel = require('../schemas/category')
module.exports = {
    GetAllCategorys: async function(){
        return await roleModel.categoryModel({})
    },
    CreateACategory:async function(name){
       try {
        let newCategory = new categoryModel({
            name:name
        })
        return await newCategory.save()
       } catch (error) {
        throw new Error(error.message)
       }
    }
}