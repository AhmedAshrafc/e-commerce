import { productModel } from "../../../database/models/product.model.js";

import slugify from "slugify";

// A function used to catch errors and send a response to the client INSTEAD of crashing the server and making it unresponsive!
const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const createProduct = catchAsyncError(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  req.body.imgCover = req.files.imgCover[0].filename;
  req.body.images = req.files.images.map((image) => image.filename);

  let newProduct = await productModel.insertMany(req.body);

  if (!newProduct) {
    return res.status(400).json({ message: "Couldn't create a new product!" });
  }

  res.status(201).json({ message: "Product created successfully!" });
});

const getAllProducts = catchAsyncError(async (req, res, next) => {
  // Pagination
  let page = req.query.page * 1 || 1;

  // handle the case when the user enters a page number less than 1 or a string
  if (page < 1 || isNaN(page)) {
    page = 1;
  }

  let skip = (page - 1) * 4;

  // Filters
  let filterObject = { ...req.query };
  let execludedQuery = ["page", "sort", "keyword", "fields"];
  execludedQuery.forEach((el) => delete filterObject[el]);

  filterObject = JSON.stringify(filterObject);
  filterObject = filterObject.replace(
    /\bgt|gte|lt|lte\b/g,
    (match) => `$${match}`
  );
  filterObject = JSON.parse(filterObject);

  // Sorting
  let mongooseQuery = productModel
    .find(filterObject)
    .populate("category")
    .populate("subCategory")
    .populate("brand")
    .skip(skip)
    .limit(4);

  if (req.query.sort) {
    // sort=price (from smallest to greatest). sort=-price (from greatest to smallest)
    let sortBy = req.query.sort.split(",").join("");
    mongooseQuery.sort(sortBy);
  }

  // Search
  if (req.query.keyword) {
    mongooseQuery.find({
      $or: [
        { title: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
      ],
    });
  }

  // Fields
  if (req.query.fields) {
    let fieldsBy = req.query.fields.split("").join("");
    mongooseQuery.select(fieldsBy);
  }

  let products = await mongooseQuery;

  if (!products) {
    return res.status(404).json({
      message: "No products was found! Create a new product to get started!",
    });
  }

  res.status(200).json({ page, products });
});

const getProductById = catchAsyncError(async (req, res, next) => {
  let { productId } = req.params;

  let product = await productModel.findById(productId);

  res.status(200).json({ product });
});

const updateProduct = catchAsyncError(async (req, res, next) => {
  let { productId } = req.params;
  let { title } = req.body;

  if (title) req.body.slug = slugify(title);

  let updatedProduct = await productModel.findByIdAndUpdate(
    productId,
    { $set: req.body },
    { new: true }
  );

  if (!updatedProduct) {
    return res
      .status(404)
      .json({ message: "Couldn't update! Product not found!" });
  }

  res.status(200).json({ message: "Product updated successfully!" });
});

const deleteProduct = catchAsyncError(async (req, res, next) => {
  let { productId } = req.params;

  let deletedProduct = await productModel.findByIdAndDelete(productId);

  if (!deletedProduct) {
    return res
      .status(404)
      .json({ message: "Couldn't delete! Product not found!" });
  }

  res.status(200).json({ message: "Product deleted successfully!" });
});

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
