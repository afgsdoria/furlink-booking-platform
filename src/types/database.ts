export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      booking_addons: {
        Row: {
          addon_id: string
          booking_id: string
          id: string
          quantity: number | null
        }
        Insert: {
          addon_id: string
          booking_id: string
          id?: string
          quantity?: number | null
        }
        Update: {
          addon_id?: string
          booking_id?: string
          id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "provider_addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_addons_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          convenience_fee: number | null
          created_at: string | null
          decline_reason: string | null
          id: string
          payment_proof_url: string | null
          payment_verified: boolean | null
          pet_id: string
          pet_owner_id: string
          service_id: string
          service_provider_id: string
          special_instructions: string | null
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          booking_time: string
          convenience_fee?: number | null
          created_at?: string | null
          decline_reason?: string | null
          id?: string
          payment_proof_url?: string | null
          payment_verified?: boolean | null
          pet_id: string
          pet_owner_id: string
          service_id: string
          service_provider_id: string
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          booking_time?: string
          convenience_fee?: number | null
          created_at?: string | null
          decline_reason?: string | null
          id?: string
          payment_proof_url?: string | null
          payment_verified?: boolean | null
          pet_id?: string
          pet_owner_id?: string
          service_id?: string
          service_provider_id?: string
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_pet_owner_id_fkey"
            columns: ["pet_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "provider_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback: {
        Row: {
          booking_id: string
          cleanliness_rating: number
          comments: string | null
          created_at: string | null
          id: string
          pet_care_rating: number
          pet_owner_id: string
          punctuality_rating: number
          service_provider_id: string
          service_quality_rating: number
          value_rating: number
        }
        Insert: {
          booking_id: string
          cleanliness_rating: number
          comments?: string | null
          created_at?: string | null
          id?: string
          pet_care_rating: number
          pet_owner_id: string
          punctuality_rating: number
          service_provider_id: string
          service_quality_rating: number
          value_rating: number
        }
        Update: {
          booking_id?: string
          cleanliness_rating?: number
          comments?: string | null
          created_at?: string | null
          id?: string
          pet_care_rating?: number
          pet_owner_id?: string
          punctuality_rating?: number
          service_provider_id?: string
          service_quality_rating?: number
          value_rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "feedback_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_pet_owner_id_fkey"
            columns: ["pet_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          related_booking_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          related_booking_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          related_booking_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_booking_id_fkey"
            columns: ["related_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      pets: {
        Row: {
          allergies: string | null
          behavior_notes: string
          breed: string
          created_at: string | null
          date_of_birth: string
          emergency_consent: boolean | null
          id: string
          medications: string | null
          name: string
          owner_id: string
          size: Database["public"]["Enums"]["pet_size"]
          updated_at: string | null
          weight: number
        }
        Insert: {
          allergies?: string | null
          behavior_notes: string
          breed: string
          created_at?: string | null
          date_of_birth: string
          emergency_consent?: boolean | null
          id?: string
          medications?: string | null
          name: string
          owner_id: string
          size: Database["public"]["Enums"]["pet_size"]
          updated_at?: string | null
          weight: number
        }
        Update: {
          allergies?: string | null
          behavior_notes?: string
          breed?: string
          created_at?: string | null
          date_of_birth?: string
          emergency_consent?: boolean | null
          id?: string
          medications?: string | null
          name?: string
          owner_id?: string
          size?: Database["public"]["Enums"]["pet_size"]
          updated_at?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          date_of_birth: string
          first_name: string
          id: string
          last_name: string
          mobile_number: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth: string
          first_name: string
          id: string
          last_name: string
          mobile_number: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string
          first_name?: string
          id?: string
          last_name?: string
          mobile_number?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      provider_addons: {
        Row: {
          addon_name: string
          created_at: string | null
          description: string | null
          id: string
          price: number
          provider_id: string
        }
        Insert: {
          addon_name: string
          created_at?: string | null
          description?: string | null
          id?: string
          price: number
          provider_id: string
        }
        Update: {
          addon_name?: string
          created_at?: string | null
          description?: string | null
          id?: string
          price?: number
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_addons_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      provider_hours: {
        Row: {
          close_time: string | null
          day_of_week: number
          id: string
          is_closed: boolean | null
          open_time: string | null
          provider_id: string
        }
        Insert: {
          close_time?: string | null
          day_of_week: number
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
          provider_id: string
        }
        Update: {
          close_time?: string | null
          day_of_week?: number
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_hours_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      provider_images: {
        Row: {
          created_at: string | null
          id: string
          image_type: Database["public"]["Enums"]["image_type"]
          image_url: string
          provider_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_type: Database["public"]["Enums"]["image_type"]
          image_url: string
          provider_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_type?: Database["public"]["Enums"]["image_type"]
          image_url?: string
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_images_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      provider_services: {
        Row: {
          base_price: number
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          provider_id: string
          service_name: string
          service_type: string
        }
        Insert: {
          base_price: number
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          provider_id: string
          service_name: string
          service_type: string
        }
        Update: {
          base_price?: number
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          provider_id?: string
          service_name?: string
          service_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      provider_staff: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          provider_id: string
          skills: string[] | null
          years_experience: number
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          provider_id: string
          skills?: string[] | null
          years_experience: number
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          provider_id?: string
          skills?: string[] | null
          years_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "provider_staff_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      service_providers: {
        Row: {
          address: string
          admin_notes: string | null
          business_name: string
          created_at: string | null
          description: string
          google_maps_link: string | null
          id: string
          qr_code_url: string | null
          status: Database["public"]["Enums"]["provider_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          admin_notes?: string | null
          business_name: string
          created_at?: string | null
          description: string
          google_maps_link?: string | null
          id?: string
          qr_code_url?: string | null
          status?: Database["public"]["Enums"]["provider_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          admin_notes?: string | null
          business_name?: string
          created_at?: string | null
          description?: string
          google_maps_link?: string | null
          id?: string
          qr_code_url?: string | null
          status?: Database["public"]["Enums"]["provider_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_sessions: {
        Row: {
          id: string
          ip_address: string
          login_time: string | null
          logout_time: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          id?: string
          ip_address: string
          login_time?: string | null
          logout_time?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          id?: string
          ip_address?: string
          login_time?: string | null
          logout_time?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: "pending" | "approved" | "declined" | "paid" | "completed" | "cancelled"
      image_type: "facility" | "permit" | "waiver"
      pet_size: "small" | "medium" | "large" | "extra_large"
      provider_status: "pending" | "approved" | "declined"
      user_role: "pet_owner" | "service_provider" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}