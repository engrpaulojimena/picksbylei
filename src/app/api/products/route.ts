import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/schema";
import { eq, ilike, and, or, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");
  const hot = searchParams.get("hot");

  try {
    const conditions = [];

    if (category) {
      const cat = await db.query.categories.findFirst({
        where: eq(categories.slug, category),
      });
      if (cat) conditions.push(eq(products.categoryId, cat.id));
    }

    if (search) {
      conditions.push(
        or(ilike(products.name, `%${search}%`), ilike(products.description, `%${search}%`))!
      );
    }

    if (featured === "true") conditions.push(eq(products.isFeatured, true));
    if (hot === "true") conditions.push(eq(products.isHot, true));

    const data = await db.query.products.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      with: { category: true },
      orderBy: [desc(products.createdAt)],
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

function revalidateShopPages() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/trending");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const [product] = await db.insert(products).values(body).returning();
    revalidateShopPages();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const [updated] = await db.update(products).set(data).where(eq(products.id, Number(id))).returning();
    revalidateShopPages();
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(products).where(eq(products.id, Number(id)));
    revalidateShopPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
