import { brandModel } from "../../../database/models/brand.model.js";

import slugify from "slugify";

// A function used to catch errors and send a response to the client INSTEAD of crashing the server and making it unresponsive!
const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const createBrand = catchAsyncError(async (req, res, next) => {
  let { name } = req.body;
  let { filename } = req.file;

  if (!name) {
    return res.status(400).json({ message: "Name Brand is required!" });
  }

  let newBrand = await brandModel.insertMany({
    name,
    slug: slugify(name),
    logo: filename,
  });

  res.status(201).json({
    message: "Brand created successfully!",
  });
});

const getAllBrands = catchAsyncError(async (req, res, next) => {
  let brands = await brandModel.find();

  if (!brands) {
    return res.status(404).json({
      message: "No brands was found! Create a new brand to get started!",
    });
  }

  res.status(200).json({ brands });
});

const getBrandById = catchAsyncError(async (req, res, next) => {
  let { brandId } = req.params;

  let brand = await brandModel.findById(brandId);

  res.status(200).json({ brand });
});

const updateBrand = catchAsyncError(async (req, res, next) => {
  let { brandId } = req.params;
  let { name } = req.body;
  let filename;
  if (req.file) {
    filename = req.file;
  }

  let updatedBrand = await brandModel.findByIdAndUpdate(
    brandId,
    { name, slug: slugify(name), logo: filename },
    { new: true }
  );

  if (!updatedBrand) {
    return res
      .status(404)
      .json({ message: "Couldn't update! Brand not found!" });
  }

  res.status(200).json({ message: "Brand updated successfully!" });
});

const deleteBrand = catchAsyncError(async (req, res, next) => {
  let { brandId } = req.params;

  let deletedBrand = await brandModel.findByIdAndDelete(brandId);

  if (!deletedBrand) {
    return res
      .status(404)
      .json({ message: "Couldn't delete! Brand not found!" });
  }

  res.status(200).json({ message: "Brand deleted successfully!" });
});

export { createBrand, getAllBrands, getBrandById, updateBrand, deleteBrand };
