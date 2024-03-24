import { subCategoryModel } from "../../../database/models/subcategory.model.js";

import slugify from "slugify";

// A function used to catch errors and send a response to the client INSTEAD of crashing the server and making it unresponsive!
const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const createSubCategory = catchAsyncError(async (req, res, next) => {
  let { name, categoryId } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name Category is required!" });
  }

  let newSubCategory = await subCategoryModel.insertMany({
    name,
    slug: slugify(name),
    category: categoryId,
  });

  res.status(201).json({
    message: "Sub-Category created successfully!",
  });
});

const getAllSubCategories = catchAsyncError(async (req, res, next) => {
  let filters = {};

  if (req.params.categoryId && req.params) {
    filters = {
      category: req.params.categoryId,
    };
  }

  let subCategories = await subCategoryModel
    .find(filters)
    .populate("category", "name");

  if (!subCategories) {
    return res.status(404).json({
      message:
        "No sub-categories was found! Create a new category to get started!",
    });
  }

  res.status(200).json({ subCategories });
});

const getSubCategoryById = catchAsyncError(async (req, res, next) => {
  let { subCategoryId } = req.params;

  let subCategory = await subCategoryModel.findById(subCategoryId);

  res.status(200).json({ subCategory });
});

const updateSubCategory = catchAsyncError(async (req, res, next) => {
  let { subCategoryId } = req.params;
  let { name, categoryId } = req.body;

  let updatedSubCategory = await subCategoryModel.findByIdAndUpdate(
    subCategoryId,
    {
      name,
      slug: slugify(name),
      category: categoryId,
    },
    { new: true }
  );

  if (!updatedSubCategory) {
    return res
      .status(404)
      .json({ message: "Couldn't update! Sub-Category not found!" });
  }

  res.status(200).json({ message: "Sub-Category updated successfully!" });
});

const deleteSubCategory = catchAsyncError(async (req, res, next) => {
  let { subCategoryId } = req.params;

  let deletedSubCategory = await subCategoryModel.findByIdAndDelete(
    subCategoryId
  );

  if (!deletedSubCategory) {
    return res
      .status(404)
      .json({ message: "Couldn't delete! Sub-Category not found!" });
  }

  res.status(200).json({ message: "Sub-Category deleted successfully!" });
});

export {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
