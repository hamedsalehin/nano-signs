'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from 'sonner'
import { LogOut, ShoppingBag, Ticket, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface Order {
  id: string
  status: string
  totalPrice: number
  createdAt: string
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/login')
        return
      }
      
      const res = await fetch('/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        localStorage.removeItem('auth_token')
        router.push('/login')
      }
    } catch {
      toast.error('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' })
      toast.success('Logged out')
      router.push('/')
    } catch {
      toast.error('Logout failed')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Account</h1>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Account Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Profile Info */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <User className="w-12 h-12 p-2 bg-primary/10 rounded-full" />
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/account/orders">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <ShoppingBag className="w-8 h-8 mb-2 text-primary" />
              <h3 className="text-lg font-semibold">Orders</h3>
              <p className="text-sm text-muted-foreground">View your order history</p>
            </Card>
          </Link>

          <Link href="/account/tickets">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <Ticket className="w-8 h-8 mb-2 text-primary" />
              <h3 className="text-lg font-semibold">Support Tickets</h3>
              <p className="text-sm text-muted-foreground">Manage your support tickets</p>
            </Card>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
          <p className="text-muted-foreground">No orders yet.</p>
        </Card>
      </main>
    </div>
  )
}
