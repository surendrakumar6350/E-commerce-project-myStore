import { NextResponse } from "next/server";
import { connectDb } from "../../../dbConnection/connect";
import { ProductModel } from "../../../models/Product";

export async function GET() {
  try {
    await connectDb();
    const products = await ProductModel.find().sort({ id: 1 }).lean();
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const required = ["id", "name", "price", "category", "description", "image"];
    for (const key of required) {
      if (body[key] === undefined || body[key] === null || (typeof body[key] === "string" && body[key].trim() === "")) {
        return NextResponse.json({ error: `${key} is required` }, { status: 400 });
      }
    }

    await connectDb();

    const payload = {
      id: Number(body.id),
      name: String(body.name),
      price: Number(body.price),
      category: String(body.category),
      subCategory: body.subCategory !== undefined && body.subCategory !== null && String(body.subCategory).trim() !== ""
        ? String(body.subCategory)
        : undefined,
      description: String(body.description),
      image: String(body.image),
      images: Array.isArray(body.images) ? body.images.map(String) : [],
      sizes: Array.isArray(body.sizes) ? body.sizes.map(String) : [],
      rating: body.rating !== undefined ? Number(body.rating) : 0,
      reviews: body.reviews !== undefined ? Number(body.reviews) : 0,
    };

    console.log(payload)

    const created = await ProductModel.create(payload);
    return NextResponse.json({ product: created }, { status: 201 });
  } catch (error: any) {
    const message = error?.code === 11000 ? "Product with this id already exists" : (error?.message || "Failed to create product");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
