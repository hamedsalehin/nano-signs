"use client"

import { useState, useMemo, memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShoppingCart, MessageSquare } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { products, Product } from "@/lib/products-data"

const categories = [
  "All",
  "Outdoor",
  "Indoor",
  "Creative",
  "Rental",
  "Neon LED",
  "Transparent",
  "Mobile",
]

const ProductCard = memo(({ product }: { product: Product }) => {
  const { addItem } = useCart()

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden card-glow transition-all hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-primary/90 text-primary-foreground rounded">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-foreground font-mono">
            {product.name}
          </h3>
          {product.series && (
            <span className="text-[10px] font-bold text-primary px-2 py-0.5 border border-primary/30 rounded bg-primary/5">
              {product.series}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <span className="text-primary/50">Pixel:</span> {product.specs.find(s => s.label === "Pixel Pitch")?.value || "N/A"}
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1">
            <span className="text-primary/50">Brightness:</span> {product.specs.find(s => s.label === "Brightness")?.value || "N/A"}
          </span>
          {product.specs.length > 2 && (
            <>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1 text-primary/70">
                + More Specs
              </span>
            </>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 text-pretty line-clamp-3 group-hover:line-clamp-none transition-all">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          {product.buyable && product.price ? (
            <>
              <div>
                <span className="text-2xl font-bold text-foreground font-mono">
                  ${product.price}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  {product.unit}
                </span>
              </div>
              <button
                onClick={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price!,
                    quantity: 1,
                  })
                }
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground italic">
                Custom Pricing
              </span>
              <Link
                href={`/products/${products.find(p => p.id === product.id)?.slug || product.id}`}
                className="flex items-center gap-2 px-4 py-2 border border-primary text-primary text-sm font-semibold rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                View Details
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
})
ProductCard.displayName = "ProductCard"

export function ProductsSection() {
  const [active, setActive] = useState("All")
  const [showAll, setShowAll] = useState(false)

  const displayedProducts = useMemo(() => {
    const filtered = active === "All" ? products : products.filter((p) => p.category === active)
    return showAll ? filtered : filtered.slice(0, 6)
  }, [active, showAll])

  return (
    <section id="products" className="relative py-24 bg-grid">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-primary border border-primary/30 rounded-full mb-4">
            Our Products
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold font-mono text-foreground mb-4 text-balance">
            LED Display <span className="text-primary">Solutions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            From massive outdoor billboards to custom neon signs, we deliver cutting-edge LED
            technology for every application.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActive(cat)
                setShowAll(false)
              }}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${active === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All */}
        {!showAll && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all cursor-pointer"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
