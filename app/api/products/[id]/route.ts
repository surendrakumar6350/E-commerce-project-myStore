import { NextResponse } from "next/server";
import { connectDb } from "../../../../dbConnection/connect";
import { ProductModel } from "../../../../models/Product";
import { Types } from "mongoose";

function buildFilter(idParam: string) {
  const numericId = Number(idParam);
  if (!Number.isNaN(numericId)) {
    return { id: numericId };
  }
  // Fallback: allow Mongo ObjectId
  if (Types.ObjectId.isValid(idParam)) {
    return { _id: new Types.ObjectId(idParam) };
  }
  return null;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;
    let filter = buildFilter(id);
    if (!filter) {
      // Fallback: accept id from payload
      if (body?.id !== undefined) {
        filter = buildFilter(String(body.id));
      } else if (body?._id && typeof body._id === "string") {
        filter = buildFilter(body._id);
      }
      if (!filter) {
        return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
      }
    }

    await connectDb();

    const update: Record<string, unknown> = {};
    const allowed = ["name", "price", "category", "subCategory", "description", "image", "images", "sizes", "rating", "reviews"];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        if (key === "images" && Array.isArray(body.images)) {
          update[key] = body.images.map(String);
        } else if (key === "sizes" && Array.isArray(body.sizes)) {
          update[key] = body.sizes.map(String);
        } else {
          update[key] = body[key];
        }
      }
    }

    const updated = await ProductModel.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let filter = buildFilter(id);
    if (!filter) {
      // Attempt to read id from payload
      try {
        const body = await req.json();
        if (body?.id !== undefined) {
          filter = buildFilter(String(body.id));
        } else if (body?._id && typeof body._id === "string") {
          filter = buildFilter(body._id);
        }
      } catch {
        // ignore body parse errors
      }
      if (!filter) {
        return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
      }
    }

    await connectDb();

    const deleted = await ProductModel.findOneAndDelete(filter).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete product" }, { status: 500 });
  }
}
