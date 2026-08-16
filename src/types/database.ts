export type UserRole =
  | 'admin'
  | 'teacher'
  | 'lab_assistant'
  | 'librarian'
  | 'media_team'
  | 'student'
  | 'club_manager'

export type StaffRole = Extract<UserRole, 'admin' | 'teacher' | 'lab_assistant' | 'librarian' | 'media_team'>

export const STAFF_ROLES: StaffRole[] = ['admin', 'teacher', 'lab_assistant', 'librarian', 'media_team']

interface TableDefinitions {
  profiles: {
    Row: {
      id: string
      user_id: string
      full_name: string | null
      email: string | null
      avatar_url: string | null
      role: UserRole
      department: string | null
      designation: string | null
      phone: string | null
      status: 'active' | 'invited' | 'suspended'
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      user_id: string
      full_name?: string | null
      email?: string | null
      avatar_url?: string | null
      role?: UserRole
      department?: string | null
      designation?: string | null
      phone?: string | null
      status?: 'active' | 'invited' | 'suspended'
    }
    Update: {
      full_name?: string | null
      email?: string | null
      avatar_url?: string | null
      role?: UserRole
      department?: string | null
      designation?: string | null
      phone?: string | null
      status?: 'active' | 'invited' | 'suspended'
      updated_at?: string
    }
  }
  staff_invitations: {
    Row: {
      id: string
      full_name: string
      email: string
      role: StaffRole
      department: string | null
      designation: string | null
      phone: string | null
      photo_url: string | null
      status: 'pending' | 'activated' | 'revoked'
      invited_by: string | null
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      full_name: string
      email: string
      role: StaffRole
      department?: string | null
      designation?: string | null
      phone?: string | null
      photo_url?: string | null
      status?: 'pending' | 'activated' | 'revoked'
      invited_by?: string | null
    }
    Update: {
      full_name?: string
      department?: string | null
      designation?: string | null
      phone?: string | null
      role?: StaffRole
      status?: 'pending' | 'activated' | 'revoked'
      updated_at?: string
    }
  }
  gallery_albums: {
    Row: {
      id: string
      title: string
      slug: string
      description: string | null
      event_date: string | null
      category: string
      cover_image_url: string | null
      photo_count: number
      status: 'draft' | 'pending_approval' | 'published' | 'archived'
      visibility: 'public' | 'private'
      created_by: string | null
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      title: string
      slug: string
      description?: string | null
      event_date?: string | null
      category?: string
      cover_image_url?: string | null
      photo_count?: number
      status?: 'draft' | 'pending_approval' | 'published' | 'archived'
      visibility?: 'public' | 'private'
      created_by?: string | null
    }
    Update: {
      title?: string
      slug?: string
      description?: string | null
      event_date?: string | null
      category?: string
      cover_image_url?: string | null
      photo_count?: number
      status?: 'draft' | 'pending_approval' | 'published' | 'archived'
      visibility?: 'public' | 'private'
      updated_at?: string
    }
  }
  gallery_photos: {
    Row: {
      id: string
      album_id: string
      image_url: string
      storage_path: string
      caption: string | null
      alt_text: string | null
      sort_order: number
      uploaded_by: string | null
      created_at: string
    }
    Insert: {
      id?: string
      album_id: string
      image_url: string
      storage_path: string
      caption?: string | null
      alt_text?: string | null
      sort_order?: number
      uploaded_by?: string | null
    }
    Update: {
      caption?: string | null
      alt_text?: string | null
      sort_order?: number
    }
  }
  students: {
        Row: {
          id: string
          user_id: string
          prn: string
          full_name: string
          email: string
          phone: string | null
          course: 'bpharm' | 'dpharm'
          year: number
          semester: number
          department: string | null
          profile_image: string | null
          verification_status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prn: string
          full_name: string
          email: string
          phone?: string | null
          course: 'bpharm' | 'dpharm'
          year: number
          semester: number
          department?: string | null
          profile_image?: string | null
          verification_status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          user_id?: string
          full_name?: string
          phone?: string | null
          course?: 'bpharm' | 'dpharm'
          year?: number
          semester?: number
          department?: string | null
          profile_image?: string | null
          verification_status?: 'pending' | 'approved' | 'rejected'
          updated_at?: string
        }
      }
      faculty: {
        Row: {
          id: string
          name: string
          designation: string
          department: string | null
          qualification: string | null
          experience: string | null
          email: string | null
          phone: string | null
          photo_url: string | null
          specialization: string | null
          bio: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          designation: string
          department?: string | null
          qualification?: string | null
          experience?: string | null
          email?: string | null
          phone?: string | null
          photo_url?: string | null
          specialization?: string | null
          bio?: string | null
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          name?: string
          designation?: string
          department?: string | null
          qualification?: string | null
          experience?: string | null
          email?: string | null
          phone?: string | null
          photo_url?: string | null
          specialization?: string | null
          bio?: string | null
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          code: string
          description: string | null
          head_id: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string | null
          head_id?: string | null
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          name?: string
          code?: string
          description?: string | null
          head_id?: string | null
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
      }
      programs: {
        Row: {
          id: string
          name: string
          short_name: string | null
          code: string
          type: 'bpharm' | 'dpharm'
          duration: string | null
          seats: number | null
          eligibility: string | null
          description: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          short_name?: string | null
          code: string
          type: 'bpharm' | 'dpharm'
          duration?: string | null
          seats?: number | null
          eligibility?: string | null
          description?: string | null
          image_url?: string | null
          is_active?: boolean
        }
        Update: {
          name?: string
          short_name?: string | null
          code?: string
          type?: 'bpharm' | 'dpharm'
          duration?: string | null
          seats?: number | null
          eligibility?: string | null
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          banner_url: string | null
          date: string
          time: string | null
          venue: string | null
          organizer: string | null
          registration_deadline: string | null
          registration_link: string | null
          status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          category: string | null
          is_online: boolean
          max_participants: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          banner_url?: string | null
          date: string
          time?: string | null
          venue?: string | null
          organizer?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          category?: string | null
          is_online?: boolean
          max_participants?: number | null
        }
        Update: {
          title?: string
          slug?: string
          description?: string
          banner_url?: string | null
          date?: string
          time?: string | null
          venue?: string | null
          organizer?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          category?: string | null
          is_online?: boolean
          max_participants?: number | null
          updated_at?: string
        }
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          student_id: string | null
          name: string
          email: string
          phone: string | null
          status: 'registered' | 'confirmed' | 'cancelled'
          registered_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          student_id?: string | null
          name: string
          email: string
          phone?: string | null
          status?: 'registered' | 'confirmed' | 'cancelled'
        }
        Update: {
          status?: 'registered' | 'confirmed' | 'cancelled'
        }
      }
      news: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          content: string | null
          image_url: string | null
          author_id: string | null
          category: string | null
          status: 'draft' | 'published' | 'archived'
          is_featured: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          content?: string | null
          image_url?: string | null
          author_id?: string | null
          category?: string | null
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          published_at?: string | null
        }
        Update: {
          title?: string
          slug?: string
          description?: string
          content?: string | null
          image_url?: string | null
          author_id?: string | null
          category?: string | null
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          published_at?: string | null
          updated_at?: string
        }
      }
      notices: {
        Row: {
          id: string
          title: string
          description: string
          content: string | null
          pdf_url: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'draft' | 'published' | 'archived'
          is_pinned: boolean
          publish_date: string | null
          expiry_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          content?: string | null
          pdf_url?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'draft' | 'published' | 'archived'
          is_pinned?: boolean
          publish_date?: string | null
          expiry_date?: string | null
        }
        Update: {
          title?: string
          description?: string
          content?: string | null
          pdf_url?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'draft' | 'published' | 'archived'
          is_pinned?: boolean
          publish_date?: string | null
          expiry_date?: string | null
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string | null
          file_url: string
          file_type: string
          file_size: number
          course: 'bpharm' | 'dpharm' | 'both'
          year: number | null
          semester: number | null
          subject: string | null
          category: 'notes' | 'study_material' | 'question_papers' | 'syllabus' | 'previous_year' | 'useful_links' | 'other'
          status: 'pending' | 'approved' | 'rejected'
          uploaded_by: string | null
          download_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          file_url: string
          file_type: string
          file_size: number
          course: 'bpharm' | 'dpharm' | 'both'
          year?: number | null
          semester?: number | null
          subject?: string | null
          category: 'notes' | 'study_material' | 'question_papers' | 'syllabus' | 'previous_year' | 'useful_links' | 'other'
          status?: 'pending' | 'approved' | 'rejected'
          uploaded_by?: string | null
          download_count?: number
        }
        Update: {
          title?: string
          description?: string | null
          file_url?: string
          file_type?: string
          file_size?: number
          course?: 'bpharm' | 'dpharm' | 'both'
          year?: number | null
          semester?: number | null
          subject?: string | null
          category?: 'notes' | 'study_material' | 'question_papers' | 'syllabus' | 'previous_year' | 'useful_links' | 'other'
          status?: 'pending' | 'approved' | 'rejected'
          download_count?: number
          updated_at?: string
        }
      }
      clubs: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          logo_url: string | null
          cover_url: string | null
          category: string | null
          is_active: boolean
          member_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          logo_url?: string | null
          cover_url?: string | null
          category?: string | null
          is_active?: boolean
          member_count?: number
        }
        Update: {
          name?: string
          slug?: string
          description?: string
          logo_url?: string | null
          cover_url?: string | null
          category?: string | null
          is_active?: boolean
          member_count?: number
          updated_at?: string
        }
      }
      club_members: {
        Row: {
          id: string
          club_id: string
          user_id: string | null
          student_id: string | null
          role: 'member' | 'lead' | 'co_lead' | 'faculty_advisor'
          joined_at: string
        }
        Insert: {
          id?: string
          club_id: string
          user_id?: string | null
          student_id?: string | null
          role?: 'member' | 'lead' | 'co_lead' | 'faculty_advisor'
        }
        Update: {
          role?: 'member' | 'lead' | 'co_lead' | 'faculty_advisor'
        }
      }
      gallery: {
        Row: {
          id: string
          title: string | null
          description: string | null
          image_url: string
          thumbnail_url: string | null
          category: 'campus' | 'events' | 'academic' | 'sports' | 'activities' | 'other'
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title?: string | null
          description?: string | null
          image_url: string
          thumbnail_url?: string | null
          category?: 'campus' | 'events' | 'academic' | 'sports' | 'activities' | 'other'
          is_active?: boolean
        }
        Update: {
          title?: string | null
          description?: string | null
          image_url?: string
          thumbnail_url?: string | null
          category?: 'campus' | 'events' | 'academic' | 'sports' | 'activities' | 'other'
          is_active?: boolean
        }
      }
      research_projects: {
        Row: {
          id: string
          title: string
          description: string | null
          faculty_id: string | null
          status: 'ongoing' | 'completed' | 'proposed'
          area: string | null
          start_date: string | null
          end_date: string | null
          funding: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          faculty_id?: string | null
          status?: 'ongoing' | 'completed' | 'proposed'
          area?: string | null
          start_date?: string | null
          end_date?: string | null
          funding?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          faculty_id?: string | null
          status?: 'ongoing' | 'completed' | 'proposed'
          area?: string | null
          start_date?: string | null
          end_date?: string | null
          funding?: string | null
          updated_at?: string
        }
      }
      publications: {
        Row: {
          id: string
          title: string
          authors: string | null
          journal: string | null
          year: number | null
          doi: string | null
          url: string | null
          faculty_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          authors?: string | null
          journal?: string | null
          year?: number | null
          doi?: string | null
          url?: string | null
          faculty_id?: string | null
        }
        Update: {
          title?: string
          authors?: string | null
          journal?: string | null
          year?: number | null
          doi?: string | null
          url?: string | null
          faculty_id?: string | null
        }
      }
      placements: {
        Row: {
          id: string
          company_name: string
          role: string | null
          package_lpa: number | null
          year: number | null
          student_count: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          role?: string | null
          package_lpa?: number | null
          year?: number | null
          student_count?: number | null
          is_active?: boolean
        }
        Update: {
          company_name?: string
          role?: string | null
          package_lpa?: number | null
          year?: number | null
          student_count?: number | null
          is_active?: boolean
          updated_at?: string
        }
      }
      admission_enquiries: {
        Row: {
          id: string
          name: string
          phone: string
          email: string
          course: string | null
          message: string | null
          status: 'new' | 'contacted' | 'converted' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email: string
          course?: string | null
          message?: string | null
          status?: 'new' | 'contacted' | 'converted' | 'closed'
        }
        Update: {
          status?: 'new' | 'contacted' | 'converted' | 'closed'
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string | null
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          is_read?: boolean
        }
        Update: {
          is_read?: boolean
        }
      }
      certificates: {
        Row: {
          id: string
          student_id: string
          title: string
          description: string | null
          certificate_url: string
          issued_date: string | null
          type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          title: string
          description?: string | null
          certificate_url: string
          issued_date?: string | null
          type?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          certificate_url?: string
          issued_date?: string | null
          type?: string | null
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: string | null
          type: 'string' | 'number' | 'boolean' | 'json'
          category: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: string | null
          type: 'string' | 'number' | 'boolean' | 'json'
          category?: string | null
        }
        Update: {
          value?: string | null
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity: string | null
          entity_id: string | null
          details: Record<string, unknown> | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity?: string | null
          entity_id?: string | null
          details?: Record<string, unknown> | null
          ip_address?: string | null
        }
        Update: {
          [key: string]: unknown
        }
      }
      announcements: {
        Row: {
          id: string
          content: string
          link: string | null
          priority: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          link?: string | null
          priority?: number
          is_active?: boolean
        }
        Update: {
          content?: string
          link?: string | null
          priority?: number
          is_active?: boolean
          updated_at?: string
        }
      }
}

interface ViewDefinitions {
  student_verifications: {
    Row: {
      prn: string
      display_name: string
      course: 'bpharm' | 'dpharm'
      year: number
      semester: number
      verification_status: 'pending' | 'approved' | 'rejected'
    }
  }
}

// Attach the Relationships key each table needs to satisfy GenericTable
type WithRelationships<T> = {
  [K in keyof T]: T[K] & { Relationships: [] }
}

export interface Database {
  public: {
    Tables: WithRelationships<TableDefinitions>
    Views: WithRelationships<ViewDefinitions>
    Functions: Record<string, never>
  }
}

// Convenience helpers for typed CRUD in the service layer
export type EntityRow<T extends keyof TableDefinitions> = TableDefinitions[T]['Row']
export type EntityInsert<T extends keyof TableDefinitions> = TableDefinitions[T]['Insert']
export type EntityUpdate<T extends keyof TableDefinitions> = TableDefinitions[T]['Update']
