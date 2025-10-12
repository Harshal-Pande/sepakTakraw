import { z } from 'zod'

// News validation schema
export const validateNews = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  document_url: z.string().url('Invalid document URL').optional().or(z.literal('')),
  featured_image: z.string().url('Invalid image URL').optional().or(z.literal('')),
})

// Results validation schema
export const validateResults = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  document_url: z.string().url('Invalid document URL').optional(),
})

// Events validation schema
export const validateEvents = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  event_date: z.string().datetime('Invalid date format'),
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  photos: z.array(z.string().url('Invalid photo URL')).optional().or(z.literal([])),
})

// General Body validation schema
export const validateGeneralBody = z.object({
  district: z.string().min(1, 'District is required').max(50, 'District too long'),
  position: z.string().min(1, 'Position is required').max(50, 'Position too long'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  contact: z.string().min(10, 'Invalid contact number').max(15, 'Contact number too long'),
  email: z.string().email('Invalid email format').optional(),
})

// MYAS Compliance validation schema
export const validateMYASCompliance = z.object({
  sno: z.number().int().positive('Serial number must be positive'),
  sub_sno: z.number().int().positive('Sub serial number must be positive').optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  documents: z.array(z.string().url('Invalid document URL')).optional(),
})

// Anti-DOP Guidelines validation schema
export const validateAntiDOPGuidelines = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  year: z.number().int().min(2000, 'Year must be 2000 or later').max(new Date().getFullYear() + 1, 'Invalid year'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
})

// RTI Officers validation schema
export const validateRTIOfficers = z.object({
  designation: z.string().min(1, 'Designation is required').max(100, 'Designation too long'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  address: z.string().min(1, 'Address is required').max(500, 'Address too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Invalid phone number').max(15, 'Phone number too long').optional(),
})

// Elections validation schema
export const validateElections = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  document_url: z.string().url('Invalid document URL').optional(),
  election_date: z.string().datetime('Invalid date format'),
})

// History validation schema
export const validateHistory = z.object({
  content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
  timeline_year: z.number().int().min(1800, 'Invalid year').max(new Date().getFullYear()).optional(),
})

// Contact Info validation schema
export const validateContactInfo = z.object({
  address: z.string().min(1, 'Address is required').max(500, 'Address too long'),
  phone: z.string().min(10, 'Invalid phone number').max(15, 'Phone number too long'),
  email: z.string().email('Invalid email format'),
  office_hours: z.string().min(1, 'Office hours required').max(100, 'Office hours too long'),
})

// Hero Images validation schema
export const validateHeroImages = z.object({
  image_url: z.string().url('Invalid image URL'),
  alt_text: z.string().min(1, 'Alt text is required').max(100, 'Alt text too long'),
  is_active: z.boolean().default(true),
})

// Rules and Regulations validation schema
export const validateRulesRegulations = z.object({
  game_format: z.string().min(1, 'Game format is required').max(100, 'Game format too long'),
  document_url: z.string().url('Invalid document URL'),
})

// File upload validation
export const validateFileUpload = z.object({
  file: z.instanceof(File),
  type: z.enum(['image', 'document']),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
})

// Search validation
export const validateSearch = z.object({
  q: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
  type: z.enum(['news', 'results', 'events', 'general-body', 'all']).default('all'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
})
