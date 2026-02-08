import mongoose, { Schema, Model, Document } from "mongoose";

export interface ProductDoc extends Document {
  id: number;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  description: string;
  image: string;
  images: string[];
  sizes?: string[];
  rating: number;
  reviews: number;
}

const ProductSchema = new Schema<ProductDoc>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    description: { type: String, required: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProductModel: Model<ProductDoc> =
  mongoose.models.Product || mongoose.model<ProductDoc>("Product", ProductSchema);
