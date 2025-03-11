import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Products } from "../models/products.models.js";
import { updloadToCloudinary } from "../utils/cloudinary.js";
import logger from "../utils/logger.js";

const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body;

  if (
    [name, price].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(401, `${field} must have a value!`);
  }

  const existingProduct = await Products.findOne({
    name: name,
  });

  if (existingProduct) {
    throw new ApiError(401, "Product with the same name already exists");
  }

  const productImageLocalPath = req?.file?.path;

  let productImage = "";
  try {
    productImage = await updloadToCloudinary(productImageLocalPath);
    logger.info("Product image loaded successfully!");
  } catch (error) {
    throw new ApiError(401, "Something went wrong in uploading product image");
  }

  try {
    const product = await Products.create({
      name,
      description,
      price,
      stock,
      productImage: productImage?.url,
    });

    const createdProduct = await Products.findById(product._id);
    if (!createdProduct) {
      throw new ApiError(401, "Something went wrong in adding a product in DB");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, createdProduct, "New Product Added Successfully!")
      );
  } catch (error) {
    throw new ApiError(401, "Something went wrong is adding a product");
  }
});
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(404, "Product ID not found!");
  }

  const product = await Products.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully!"));
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body;
  const { id } = req.params;

  const product = await Products.findByIdAndUpdate(id, {
    name,
    description,
    price,
    stock,
  });

  if (!product) {
    new ApiError(401, "Product not updated");
  }

  const updatedProduct = await Products.findById(product._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        "Product Details Updated Successfully!"
      )
    );
});

const updateProductImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedProductImageLocalPath = req?.file?.path;

  let updatedProductImageCloudinary = "";
  try {
    updatedProductImageCloudinary = await updloadToCloudinary(
      updatedProductImageLocalPath
    );
    logger.info("Product image updated successfully on cloudinary!");
  } catch (error) {
    throw new ApiError(
      401,
      "Something went wrong in updating product image on cloudinary!"
    );
  }

  const productImage = await Products.findByIdAndUpdate(id, {
    productImage: updatedProductImageCloudinary?.url,
  });
  const updatedProduct = await Products.findById(productImage._id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProduct, "Product Image updated successfully")
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(404, "Product ID not found!");
  }
  const deletedProduct = await Products.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, deletedProduct, "Product Deleted Successfully"));
});

export {
  addProduct,
  getProduct,
  updateProductDetails,
  deleteProduct,
  updateProductImage,
};
