import mongoose from "mongoose";

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, "too short brand name"],
    },
    slug: {
      type: String,
      unique: [true, "slug is required"],
      trim: true,
      required: true,
      lowercase: true,
      minLength: [2, "too short brand slug"],
    },
    logo: String,
  },
  { timestamps: true }
);

brandSchema.post("init", (doc) => {
  doc.logo = "http://localhost:3010/brands/" + doc.logo;
});

export const brandModel = mongoose.model("brand", brandSchema);
