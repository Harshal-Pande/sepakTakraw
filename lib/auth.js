import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { createClient } from './supabase'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-super-secret-jwt-key-min-32-characters-change-in-production'
const JWT_EXPIRES_IN = process.env.ADMIN_SESSION_TIMEOUT || '24h'

export const authConfig = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN,
  issuer: 'sepaktakraw-admin',
  audience: 'sepaktakraw-admin-users'
}

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12)
}

export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    authConfig.secret,
    { 
      expiresIn: authConfig.expiresIn,
      issuer: authConfig.issuer,
      audience: authConfig.audience
    }
  )
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, authConfig.secret, {
      issuer: authConfig.issuer,
      audience: authConfig.audience
    })
  } catch (error) {
    return null
  }
}

export const getCurrentUser = async (token) => {
  if (!token) return null
  
  const decoded = verifyToken(token)
  if (!decoded) return null
  
  const supabase = createClient()
  const { data: user, error } = await supabase
    .from('admin_users')
    .select('id, email, name, role, is_active')
    .eq('id', decoded.id)
    .eq('is_active', true)
    .single()
  
  if (error || !user) return null
  
  return user
}
