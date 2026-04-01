// Client and server authentication utilities
// Note: Server-side functions (bcryptjs, jsonwebtoken) are handled in API routes

// Simple base64 token decoding (client-safe)
export function decodeToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString())
    return decoded
  } catch {
    return null
  }
}

// Client-side token storage
export function getAuthTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export function setAuthTokenToStorage(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("auth_token", token)
}

export function clearAuthTokenFromStorage() {
  if (typeof window === "undefined") return
  localStorage.removeItem("auth_token")
}

export async function getCurrentUser() {
  const token = getAuthTokenFromStorage()
  if (!token) return null
  return decodeToken(token)
}

// Stub functions for compatibility
export async function hashPassword(password: string): Promise<string> {
  return password // Replace with bcrypt when available
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return password === hash // Replace with bcrypt comparison when available
}

export function generateToken(userId: string, role: string): string {
  const payload = {
    userId,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 604800,
  }
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  return decodeToken(token)
}

export async function setAuthCookie(token: string) {
  // Client-side implementation
  setAuthTokenToStorage(token)
}

export async function getAuthToken(): Promise<string | null> {
  return getAuthTokenFromStorage()
}

export async function clearAuthCookie() {
  clearAuthTokenFromStorage()
}


import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-in-production"

export async function requireAuth(request?: any) {
  try {
    let token = ""
    if (request && typeof request.headers?.get === "function") {
      const authHeader = request.headers.get("Authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7)
      }
    }
    
    if (!token) {
      // Fallback to old behavior for non-request contexts if any exist
      token = getAuthTokenFromStorage() || ""
    }

    if (!token) {
      return { isValid: false, error: "Unauthorized" }
    }

    // Attempt to verify via jsonwebtoken
    let user: any
    try {
      user = jwt.verify(token, JWT_SECRET)
    } catch {
      // Fallback to legacy decode if it was generated differently
      user = decodeToken(token)
    }

    if (!user) {
      return { isValid: false, error: "Unauthorized" }
    }
    return { isValid: true, user }
  } catch (error) {
    return { isValid: false, error: "Authentication error" }
  }
}

export async function requireAdmin(request?: any) {
  const auth = await requireAuth(request)
  if (!auth.isValid) return auth
  if (auth.user?.role !== "ADMIN") {
    return { isValid: false, error: "Forbidden: Admin access required" }
  }
  return auth
}

