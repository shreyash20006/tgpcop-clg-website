export type CourseType = 'bpharm' | 'dpharm'

export interface NavItem {
  label: string
  path?: string
  children?: NavItem[]
}

export interface BreadcrumbItem {
  label: string
  path?: string
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

export interface FilterOption {
  label: string
  value: string
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}

export interface SiteConfig {
  collegeName: string
  collegeFullName: string
  phone: string
  email: string
  address: string
  dteCode: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroImageUrl: string | null
  heroCtaPrimary: { label: string; link: string }
  heroCtaSecondary: { label: string; link: string }
  socialLinks: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
    linkedin?: string
  }
}
