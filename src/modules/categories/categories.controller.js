import { categoryModel } from "../../../database/models/category.model.js";

import slugify from "slugify";

// A function used to catch errors and send a response to the client INSTEAD of crashing the server and making it unresponsive!
const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const createCategory = catchAsyncError(async (req, res, next) => {
  let { name } = req.body;
  let { filename } = req.file;

  if (!name) {
    return res.status(400).json({ message: "Name Category is required!" });
  }

  let newCategory = await categoryModel.insertMany({
    name,
    slug: slugify(name),
    image: filename,
  });

  res.status(201).json({
    message: "Category created successfully!",
  });
});

const getAllCategories = catchAsyncError(async (req, res, next) => {
  let categories = await categoryModel.find();

  if (!categories) {
    return res.status(404).json({
      message: "No categories was found! Create a new category to get started!",
    });
  }

  res.status(200).json({ categories });
});

const getCategoryById = catchAsyncError(async (req, res, next) => {
  let { categoryId } = req.params;

  let category = await categoryModel.findById(categoryId);

  res.status(200).json({ category });
});

const updateCategory = catchAsyncError(async (req, res, next) => {
  let { categoryId } = req.params;
  let { name } = req.body;

  let updatedCategory = await categoryModel.findByIdAndUpdate(
    categoryId,
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!updatedCategory) {
    return res
      .status(404)
      .json({ message: "Couldn't update! Category not found!" });
  }

  res.status(200).json({ message: "Category updated successfully!" });
});

const deleteCategory = catchAsyncError(async (req, res, next) => {
  let { categoryId } = req.params;

  let deletedCategory = await categoryModel.findByIdAndDelete(categoryId);

  if (!deletedCategory) {
    return res
      .status(404)
      .json({ message: "Couldn't delete! Category not found!" });
  }

  res.status(200).json({ message: "Category deleted successfully!" });
});

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
