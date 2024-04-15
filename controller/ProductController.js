const {createFactory,getAllFactory,getByIdFactory,deleteByIdFactory}=require("../utility/crudFactory");
const ProductModel=require("../model/ProductModel")
const createProductHandler= createFactory(ProductModel);
const getAllProductHandler= getAllFactory(ProductModel);
const getProductByIdHandler= getByIdFactory(ProductModel);
const deleteProductById = deleteByIdFactory(ProductModel);
const categories=["electronics", "men's clothing", "women's clothing", "jewelery"];
const getProductCategories= async function(req, res){
    res.json({
        status:"categories",
        message: categories,
        
    });
    
}
module.exports={createProductHandler,getAllProductHandler,getProductByIdHandler,deleteProductById,getProductCategories};