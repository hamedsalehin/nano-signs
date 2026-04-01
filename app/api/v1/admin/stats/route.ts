import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-in-production"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    let decoded: any

    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    const [totalOrders, totalProducts, totalUsers] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
    ])

    const orders = await prisma.order.findMany({ select: { totalPrice: true } })
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 })
  }
}
