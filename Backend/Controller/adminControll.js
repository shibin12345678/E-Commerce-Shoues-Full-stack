require("dotenv").config();
const mongoos=require("mongoose");
const products=require("../Models/productSchema");
const jwt=require("jsonwebtoken");
const {joiProductSchema}=require("../Models/validationSchema");
const Users=require("../Models/userSchema");
const Order=require("../Models/orederSchema");
const { default: mongoose } = require("mongoose");
const productSchema = require("../Models/productSchema");



   //admin login
    const login = async (req,res) => {  
    const { username, password } = req.body;
    console.log(req.body)
    // console.log("Emil",process.env.ADMIN_EMAIL , process.env.ADMIN_PASSWORD)
       
        if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
        ) {
        const toekn = jwt.sign(
            { username: username },
            process.env.ADMIN_ACCES_TOKEN_SECRET
        );
        return res.status(200).send({
            statu: "Succes",
            message: "Admin registratin succs full",
            data: toekn,
        });
        } else {
        return res.status(404).json({
            status: "error",
            message: "Thsi is no an admin ",
        });
        }
  };   
  // finding all users
 const allUsers=async(req,res)=>{
       const allUsers=await Users.find();
       console.log(allUsers)

       if(allUsers.length===0){
          return res.status(404).json({
             status:"error",
             message:"Users not found"
          })
       }
     res.status(200).json({
          status:"succeful",
          message:'success fully feched used data',
          data:allUsers
          
     })
      

  }

  //View a specific user details by id;
  const findById = async (req, res) => {
  const userId = req.params.id;

 try {
        const user = await Users.findById(userId);
        console.log(user)

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: 'User not found',
            });
        }

        res.status(200).json({
            status: "success",
            message: 'Successfully found user',
            data: user,
        });
    }catch (error) {
       
        res.status(500).json({
            status: "error",
            message: 'Internal Server Error',
        });
    }
};

/////-> Create a product.

const  createProduct= async (req, res) => {
    // console.log('.....')
    // console.log('aaaaaaaaa');
    const { value, error } = joiProductSchema.validate(req.body);
    // console.log(value)
    const { title, description, price, image, category } = value;
    // console.log(value)
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    } else {
        try {
           
            // Assuming 'products' is your model or schema
            const createdProduct = await products.create({
                title,    
                description,
                price,
                image,
                category,
            });
  
            res.status(201).json({
                status: 'success',
                message: "Successfully created product",
                data: createdProduct,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        }
    }
}

///View all the products by category

const allProducts = async (req, res) => {
    try {
        const prods = await products.find();

        if (prods.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Products not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Successfully fetched products detail.",
            data: prods,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};
 //Product by id 
     const  productsById=async(req,res)=>{
        const  productId=req.params.id;
            if(!mongoose.Types.ObjectId.isValid(productId)){
                  return  res.status(400).json({
                       status:"fail",
                       message:"inValid Id format"
                  })
            }
             const product=await productSchema.findById(productId);
             if(!product){
                return res.status(404).json({
                    status:'fail',   
                    message:'product not found'
                })
             }
             res.status(200).json({
                status:'success',
                message:'successfully fetched data',
                product:product
            })
     }
//Delete Product
 const deleteProduct= async (req, res) => {
    const { productId } = req.body;
    
  
    const deletePro = await products.findByIdAndDelete(productId); 
  console.log(deletePro,'delete')
    res.status(200).json({
      status: "success", 
      message: "Product successfully deleted",
    });
  }   

 // admin update product
    const updateProduct = async (req, res) => {
    const { value, error } = joiProductSchema.validate(req.body);
    console.log(req.body,'body');
    if (error) {
    return res.status(400).json({ message: error.details[0].message });
    }
    const { id, title, description, price, image, category } = value;
    // Use findOne instead of find for a single product
    const product = await products.findOne({ _id: id });
// Check if the product exists
    if (!product) {
    return res.status(404).json({
    status: "Failure",
        message: "Product not found in the database",
      });
    }
    // Use findByIdAndUpdate with the proper options
    await products.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        image,
        category,
      },
      { new: true } 
    );
    res.status(200).json({
      status: "Success",
      message: "Product successfully updated",
      data: product
    });
  };
  
  // admin Order details


   const orderDtails=async(req,res)=>{
        const products= await Order.find();
      console.log(products)
             if(products.length===0){
                   return res.status(200).json({
                       message:"No products"
                   });
             }
             res.status(200).json({
                status:"succcess",
                  message:"Successfully fetched order details",
                  products,
             })
   }
  module.exports = {
    login,
    allUsers,
    findById,
    allProducts,
    productsById,
    deleteProduct,
    createProduct,
    updateProduct,
    orderDtails
  };
  