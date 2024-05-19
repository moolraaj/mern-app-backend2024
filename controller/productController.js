const asyncError = require('../middleware/asyncError')
const productModel = require('../model/productModel')
const ErrorHandler = require('../utils/errorhandler')
const ApiFeatures=require('../utils/apiFeatures')

const createProduct = asyncError (async (req, res, next) => {
    req.body.user=req.user.id
    let products = await productModel.create(req.body)
    res.status(201).json({
        success: true,
        products
    })
})


const findAllProducts =  asyncError(async (req, res, next) => {
    let resultPerPage=5
    let totalProducts=await productModel.countDocuments()
    let apiFeatures=new ApiFeatures(productModel.find(),req.query).search().filter().pagination(resultPerPage)
    let products = await apiFeatures.query
    res.status(200).json({
        success: true,
        products,
        totalProducts
    })
})

const findSingleProduct =  asyncError(async (req, res, next) => {
    let product = await productModel.findById(req.params.id)
    if (!product) {
        return res.status(500).json({
            success: false,
            message: 'no single product found'
        })
    }
    res.status(200).json({
        success: true,
        product
    })
})

const deleteSingleProduct = asyncError(async (req, res, next) => {
    let data = await productModel.findByIdAndDelete(req.params.id)
    if (!data) {
        return  next(new ErrorHandler('no such product found',400))
    }
    res.status(200).json({
        success: true,
        message: 'product deleted successfully'
    })
})

const updateSingleProduct = asyncError(async (req, res, next) => {
    let product = await productModel.findById(req.params.id);
    if (!product) {
        return  next(new ErrorHandler('no product found',400))
    }

    product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        product,
        message: 'Product updated successfully',
        
    });
})

module.exports = {
    createProduct,
    findAllProducts,
    findSingleProduct,
    deleteSingleProduct,
    updateSingleProduct
}

