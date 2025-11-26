export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ad_tier_features: {
        Row: {
          ad_tier: string
          created_at: string
          feature_description: string | null
          feature_name: string
          id: string
          is_enabled: boolean
        }
        Insert: {
          ad_tier: string
          created_at?: string
          feature_description?: string | null
          feature_name: string
          id?: string
          is_enabled?: boolean
        }
        Update: {
          ad_tier?: string
          created_at?: string
          feature_description?: string | null
          feature_name?: string
          id?: string
          is_enabled?: boolean
        }
        Relationships: []
      }
      ads: {
        Row: {
          ad_tier: string
          ai_generated_image_url: string | null
          broker_form_data: Json | null
          created_at: string
          custom_image_url: string | null
          description: string | null
          expires_at: string | null
          id: string
          is_featured: boolean
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          moderation_status: string
          priority_score: number
          property_id: string
          seller_approved_at: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ad_tier?: string
          ai_generated_image_url?: string | null
          broker_form_data?: Json | null
          created_at?: string
          custom_image_url?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_featured?: boolean
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?: string
          priority_score?: number
          property_id: string
          seller_approved_at?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ad_tier?: string
          ai_generated_image_url?: string | null
          broker_form_data?: Json | null
          created_at?: string
          custom_image_url?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_featured?: boolean
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?: string
          priority_score?: number
          property_id?: string
          seller_approved_at?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_sales: {
        Row: {
          agent_id: string
          area: string
          created_at: string
          days_on_market: number | null
          final_bid_count: number | null
          id: string
          list_price: number | null
          living_area: number | null
          property_address: string
          property_type: string
          rooms: number | null
          sale_date: string
          sale_id: string | null
          sale_price: number
        }
        Insert: {
          agent_id: string
          area: string
          created_at?: string
          days_on_market?: number | null
          final_bid_count?: number | null
          id?: string
          list_price?: number | null
          living_area?: number | null
          property_address: string
          property_type: string
          rooms?: number | null
          sale_date: string
          sale_id?: string | null
          sale_price: number
        }
        Update: {
          agent_id?: string
          area?: string
          created_at?: string
          days_on_market?: number | null
          final_bid_count?: number | null
          id?: string
          list_price?: number | null
          living_area?: number | null
          property_address?: string
          property_type?: string
          rooms?: number | null
          sale_date?: string
          sale_id?: string | null
          sale_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_sales_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "real_estate_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_sales_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "property_sales_history"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_editor_analytics: {
        Row: {
          action_type: string
          ai_model_used: string | null
          created_at: string
          edit_type: string | null
          error_code: string | null
          error_message: string | null
          file_size_kb: number | null
          guidance_scale: number | null
          id: string
          image_dimensions: string | null
          ip_address: unknown
          model_endpoint: string | null
          processing_time_ms: number | null
          prompt_length: number | null
          quality_level: string | null
          session_id: string
          strength_value: number | null
          style_preset: string | null
          success: boolean
          user_agent: string | null
          user_id: string | null
          user_satisfaction: number | null
        }
        Insert: {
          action_type: string
          ai_model_used?: string | null
          created_at?: string
          edit_type?: string | null
          error_code?: string | null
          error_message?: string | null
          file_size_kb?: number | null
          guidance_scale?: number | null
          id?: string
          image_dimensions?: string | null
          ip_address?: unknown
          model_endpoint?: string | null
          processing_time_ms?: number | null
          prompt_length?: number | null
          quality_level?: string | null
          session_id: string
          strength_value?: number | null
          style_preset?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
          user_satisfaction?: number | null
        }
        Update: {
          action_type?: string
          ai_model_used?: string | null
          created_at?: string
          edit_type?: string | null
          error_code?: string | null
          error_message?: string | null
          file_size_kb?: number | null
          guidance_scale?: number | null
          id?: string
          image_dimensions?: string | null
          ip_address?: unknown
          model_endpoint?: string | null
          processing_time_ms?: number | null
          prompt_length?: number | null
          quality_level?: string | null
          session_id?: string
          strength_value?: number | null
          style_preset?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
          user_satisfaction?: number | null
        }
        Relationships: []
      }
      ai_generated_images: {
        Row: {
          created_at: string
          id: string
          image_type: string
          image_url: string
          prompt: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_type?: string
          image_url: string
          prompt: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_type?: string
          image_url?: string
          prompt?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ai_model_performance: {
        Row: {
          average_processing_time_ms: number | null
          cost_per_request: number | null
          created_at: string
          date_from: string
          date_to: string
          failed_requests: number
          id: string
          model_endpoint: string | null
          model_name: string
          success_rate: number | null
          successful_requests: number
          total_cost_sek: number | null
          total_requests: number
          updated_at: string
          user_satisfaction_avg: number | null
        }
        Insert: {
          average_processing_time_ms?: number | null
          cost_per_request?: number | null
          created_at?: string
          date_from: string
          date_to: string
          failed_requests?: number
          id?: string
          model_endpoint?: string | null
          model_name: string
          success_rate?: number | null
          successful_requests?: number
          total_cost_sek?: number | null
          total_requests?: number
          updated_at?: string
          user_satisfaction_avg?: number | null
        }
        Update: {
          average_processing_time_ms?: number | null
          cost_per_request?: number | null
          created_at?: string
          date_from?: string
          date_to?: string
          failed_requests?: number
          id?: string
          model_endpoint?: string | null
          model_name?: string
          success_rate?: number | null
          successful_requests?: number
          total_cost_sek?: number | null
          total_requests?: number
          updated_at?: string
          user_satisfaction_avg?: number | null
        }
        Relationships: []
      }
      area_information: {
        Row: {
          amenities_score: number | null
          area_name: string
          coordinates: unknown
          created_at: string
          crime_index: number | null
          description: string | null
          family_friendliness: number | null
          id: string
          investment_potential: string | null
          municipality: string
          population: number | null
          region: string
          schools_rating: number | null
          transport_score: number | null
          updated_at: string
          walkability_score: number | null
        }
        Insert: {
          amenities_score?: number | null
          area_name: string
          coordinates?: unknown
          created_at?: string
          crime_index?: number | null
          description?: string | null
          family_friendliness?: number | null
          id?: string
          investment_potential?: string | null
          municipality: string
          population?: number | null
          region: string
          schools_rating?: number | null
          transport_score?: number | null
          updated_at?: string
          walkability_score?: number | null
        }
        Update: {
          amenities_score?: number | null
          area_name?: string
          coordinates?: unknown
          created_at?: string
          crime_index?: number | null
          description?: string | null
          family_friendliness?: number | null
          id?: string
          investment_potential?: string | null
          municipality?: string
          population?: number | null
          region?: string
          schools_rating?: number | null
          transport_score?: number | null
          updated_at?: string
          walkability_score?: number | null
        }
        Relationships: []
      }
      broker_offices: {
        Row: {
          created_at: string
          id: string
          office_address: string | null
          office_city: string | null
          office_email: string | null
          office_name: string
          office_phone: string | null
          office_postal_code: string | null
          office_website: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          office_address?: string | null
          office_city?: string | null
          office_email?: string | null
          office_name: string
          office_phone?: string | null
          office_postal_code?: string | null
          office_website?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          office_address?: string | null
          office_city?: string | null
          office_email?: string | null
          office_name?: string
          office_phone?: string | null
          office_postal_code?: string | null
          office_website?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      brokers: {
        Row: {
          broker_email: string
          broker_name: string
          broker_phone: string | null
          created_at: string
          id: string
          is_assistant: boolean | null
          is_broker: boolean | null
          is_office_owner: boolean | null
          license_number: string | null
          office_id: string
          specialization: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          broker_email: string
          broker_name: string
          broker_phone?: string | null
          created_at?: string
          id?: string
          is_assistant?: boolean | null
          is_broker?: boolean | null
          is_office_owner?: boolean | null
          license_number?: string | null
          office_id: string
          specialization?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          broker_email?: string
          broker_name?: string
          broker_phone?: string | null
          created_at?: string
          id?: string
          is_assistant?: boolean | null
          is_broker?: boolean | null
          is_office_owner?: boolean | null
          license_number?: string | null
          office_id?: string
          specialization?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brokers_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "broker_offices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brokers_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "broker_property_stats"
            referencedColumns: ["office_id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_system_message: boolean
          message_type: string
          metadata: Json | null
          reply_to_id: string | null
          sender_id: string | null
          sender_name: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_system_message?: boolean
          message_type?: string
          metadata?: Json | null
          reply_to_id?: string | null
          sender_id?: string | null
          sender_name: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_system_message?: boolean
          message_type?: string
          metadata?: Json | null
          reply_to_id?: string | null
          sender_id?: string | null
          sender_name?: string
          session_id?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          session_data: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          session_data?: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          session_data?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      collaboration_sessions: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_public: boolean
          max_participants: number | null
          property_id: string
          session_data: Json | null
          session_name: string
          session_type: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_public?: boolean
          max_participants?: number | null
          property_id: string
          session_data?: Json | null
          session_name: string
          session_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_public?: boolean
          max_participants?: number | null
          property_id?: string
          session_data?: Json | null
          session_name?: string
          session_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          last_message_at: string | null
          property_id: string
          seller_id: string
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          last_message_at?: string | null
          property_id: string
          seller_id: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          last_message_at?: string | null
          property_id?: string
          seller_id?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      dac7_landlord_info: {
        Row: {
          business_name: string | null
          city: string
          consent_date: string | null
          consent_given: boolean
          country: string
          created_at: string
          email: string
          entity_type: string
          id: string
          legal_name: string
          organization_number: string | null
          personal_number: string | null
          phone: string | null
          postal_code: string
          street_address: string
          tin: string | null
          updated_at: string
          user_id: string
          vat_number: string | null
          verification_date: string | null
          verified: boolean
        }
        Insert: {
          business_name?: string | null
          city: string
          consent_date?: string | null
          consent_given?: boolean
          country?: string
          created_at?: string
          email: string
          entity_type: string
          id?: string
          legal_name: string
          organization_number?: string | null
          personal_number?: string | null
          phone?: string | null
          postal_code: string
          street_address: string
          tin?: string | null
          updated_at?: string
          user_id: string
          vat_number?: string | null
          verification_date?: string | null
          verified?: boolean
        }
        Update: {
          business_name?: string | null
          city?: string
          consent_date?: string | null
          consent_given?: boolean
          country?: string
          created_at?: string
          email?: string
          entity_type?: string
          id?: string
          legal_name?: string
          organization_number?: string | null
          personal_number?: string | null
          phone?: string | null
          postal_code?: string
          street_address?: string
          tin?: string | null
          updated_at?: string
          user_id?: string
          vat_number?: string | null
          verification_date?: string | null
          verified?: boolean
        }
        Relationships: []
      }
      dac7_rental_income: {
        Row: {
          created_at: string
          currency: string
          id: string
          landlord_info_id: string
          property_address: string
          property_type: string
          rental_days: number
          rental_income: number
          reported_date: string | null
          reported_to_skatteverket: boolean
          reporting_period_end: string
          reporting_period_start: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          landlord_info_id: string
          property_address: string
          property_type: string
          rental_days: number
          rental_income: number
          reported_date?: string | null
          reported_to_skatteverket?: boolean
          reporting_period_end: string
          reporting_period_start: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          landlord_info_id?: string
          property_address?: string
          property_type?: string
          rental_days?: number
          rental_income?: number
          reported_date?: string | null
          reported_to_skatteverket?: boolean
          reporting_period_end?: string
          reporting_period_start?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dac7_rental_income_landlord_info_id_fkey"
            columns: ["landlord_info_id"]
            isOneToOne: false
            referencedRelation: "dac7_landlord_info"
            referencedColumns: ["id"]
          },
        ]
      }
      error_logs: {
        Row: {
          action_attempted: string | null
          browser_name: string | null
          component_name: string | null
          created_at: string
          device_type: string | null
          error_code: string | null
          error_message: string
          error_stack: string | null
          error_type: string
          id: string
          resolution_notes: string | null
          resolved: boolean
          resolved_at: string | null
          severity: string
          url: string | null
          user_agent: string | null
          user_id: string | null
          user_input: Json | null
        }
        Insert: {
          action_attempted?: string | null
          browser_name?: string | null
          component_name?: string | null
          created_at?: string
          device_type?: string | null
          error_code?: string | null
          error_message: string
          error_stack?: string | null
          error_type: string
          id?: string
          resolution_notes?: string | null
          resolved?: boolean
          resolved_at?: string | null
          severity?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_input?: Json | null
        }
        Update: {
          action_attempted?: string | null
          browser_name?: string | null
          component_name?: string | null
          created_at?: string
          device_type?: string | null
          error_code?: string | null
          error_message?: string
          error_stack?: string | null
          error_type?: string
          id?: string
          resolution_notes?: string | null
          resolved?: boolean
          resolved_at?: string | null
          severity?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_input?: Json | null
        }
        Relationships: []
      }
      geographic_areas: {
        Row: {
          area_type: string
          center_lat: number | null
          center_lng: number | null
          coordinates: Json | null
          created_at: string
          id: string
          name: string
          parent_id: string | null
          population: number | null
          postal_codes: string[] | null
          updated_at: string
        }
        Insert: {
          area_type: string
          center_lat?: number | null
          center_lng?: number | null
          coordinates?: Json | null
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
          population?: number | null
          postal_codes?: string[] | null
          updated_at?: string
        }
        Update: {
          area_type?: string
          center_lat?: number | null
          center_lng?: number | null
          coordinates?: Json | null
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
          population?: number | null
          postal_codes?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "geographic_areas_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "geographic_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_properties: {
        Row: {
          added_by: string
          created_at: string
          group_id: string
          id: string
          property_id: string
          status: string
          updated_at: string
        }
        Insert: {
          added_by: string
          created_at?: string
          group_id: string
          id?: string
          property_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          added_by?: string
          created_at?: string
          group_id?: string
          id?: string
          property_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_properties_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_property_votes: {
        Row: {
          created_at: string
          group_id: string
          id: string
          property_id: string
          updated_at: string
          user_id: string
          vote: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          property_id: string
          updated_at?: string
          user_id: string
          vote: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          property_id?: string
          updated_at?: string
          user_id?: string
          vote?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_property_votes_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          created_by: string
          id: string
          invite_code: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          invite_code?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          invite_code?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      incident_reports: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          description: string
          evidence_urls: string[] | null
          id: string
          report_type: string
          reported_by: string
          resolution_notes: string | null
          resolved_at: string | null
          severity: string
          status: string
          subject_id: string | null
          subject_type: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string
          description: string
          evidence_urls?: string[] | null
          id?: string
          report_type: string
          reported_by: string
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          subject_id?: string | null
          subject_type?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          description?: string
          evidence_urls?: string[] | null
          id?: string
          report_type?: string
          reported_by?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          subject_id?: string | null
          subject_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      market_analysis_history: {
        Row: {
          analysis_result: Json
          created_at: string
          id: string
          market_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_result: Json
          created_at?: string
          id?: string
          market_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_result?: Json
          created_at?: string
          id?: string
          market_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      market_analytics: {
        Row: {
          average_price: number | null
          created_at: string
          date_period: string
          days_on_market: number | null
          id: string
          median_price: number | null
          number_of_sales: number | null
          period_end: string
          period_start: string
          price_per_sqm: number | null
          price_trend_percent: number | null
          property_type: string
          region: string
        }
        Insert: {
          average_price?: number | null
          created_at?: string
          date_period: string
          days_on_market?: number | null
          id?: string
          median_price?: number | null
          number_of_sales?: number | null
          period_end: string
          period_start: string
          price_per_sqm?: number | null
          price_trend_percent?: number | null
          property_type: string
          region: string
        }
        Update: {
          average_price?: number | null
          created_at?: string
          date_period?: string
          days_on_market?: number | null
          id?: string
          median_price?: number | null
          number_of_sales?: number | null
          period_end?: string
          period_start?: string
          price_per_sqm?: number | null
          price_trend_percent?: number | null
          property_type?: string
          region?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      office_team_members: {
        Row: {
          added_by: string
          broker_id: string
          created_at: string | null
          has_statistics_access: boolean | null
          id: string
          office_id: string
          updated_at: string | null
        }
        Insert: {
          added_by: string
          broker_id: string
          created_at?: string | null
          has_statistics_access?: boolean | null
          id?: string
          office_id: string
          updated_at?: string | null
        }
        Update: {
          added_by?: string
          broker_id?: string
          created_at?: string | null
          has_statistics_access?: boolean | null
          id?: string
          office_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "office_team_members_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "broker_property_stats"
            referencedColumns: ["broker_id"]
          },
          {
            foreignKeyName: "office_team_members_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "office_team_members_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "broker_property_stats"
            referencedColumns: ["broker_id"]
          },
          {
            foreignKeyName: "office_team_members_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "office_team_members_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "broker_offices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "office_team_members_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "broker_property_stats"
            referencedColumns: ["office_id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          action_name: string
          browser_name: string | null
          browser_version: string | null
          component_name: string
          connection_speed: string | null
          created_at: string
          device_type: string | null
          duration_ms: number | null
          end_time: string | null
          first_contentful_paint_ms: number | null
          id: string
          largest_contentful_paint_ms: number | null
          memory_used_mb: number | null
          network_type: string | null
          page_load_time_ms: number | null
          start_time: string
          user_id: string | null
        }
        Insert: {
          action_name: string
          browser_name?: string | null
          browser_version?: string | null
          component_name: string
          connection_speed?: string | null
          created_at?: string
          device_type?: string | null
          duration_ms?: number | null
          end_time?: string | null
          first_contentful_paint_ms?: number | null
          id?: string
          largest_contentful_paint_ms?: number | null
          memory_used_mb?: number | null
          network_type?: string | null
          page_load_time_ms?: number | null
          start_time: string
          user_id?: string | null
        }
        Update: {
          action_name?: string
          browser_name?: string | null
          browser_version?: string | null
          component_name?: string
          connection_speed?: string | null
          created_at?: string
          device_type?: string | null
          duration_ms?: number | null
          end_time?: string | null
          first_contentful_paint_ms?: number | null
          id?: string
          largest_contentful_paint_ms?: number | null
          memory_used_mb?: number | null
          network_type?: string | null
          page_load_time_ms?: number | null
          start_time?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bankid_personal_number: string | null
          bankid_verified: boolean
          bankid_verified_at: string | null
          bio: string | null
          company_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          org_number: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bankid_personal_number?: string | null
          bankid_verified?: boolean
          bankid_verified_at?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          org_number?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bankid_personal_number?: string | null
          bankid_verified?: boolean
          bankid_verified_at?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          org_number?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          ad_tier: string
          address_city: string
          address_country: string
          address_postal_code: string
          address_street: string
          ai_analyzed_at: string | null
          ai_description_summary: string | null
          ai_extracted_features: string[] | null
          ai_keywords: string[] | null
          bathroom_description: string | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          description: string | null
          energy_class: string | null
          energy_declaration_url: string | null
          features: string[] | null
          floor_plan_url: string | null
          id: string
          images: string[] | null
          is_nyproduktion: boolean | null
          kitchen_description: string | null
          last_renewed_at: string | null
          latitude: number | null
          living_area: number | null
          longitude: number | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          moderation_status: string
          monthly_fee: number | null
          nyproduktion_project_id: string | null
          nyproduktion_total_units: number | null
          operating_costs: number | null
          original_price: number | null
          plot_area: number | null
          price: number
          price_change_format: string | null
          property_documents: Json | null
          property_type: string
          rental_info: Json | null
          responsible_broker_id: string | null
          rooms: number | null
          show_bidding: boolean | null
          show_price_change: boolean | null
          status: string
          threed_tour_url: string | null
          title: string
          updated_at: string
          user_id: string
          video_url: string | null
          viewing_times: Json | null
          year_built: number | null
        }
        Insert: {
          ad_tier?: string
          address_city: string
          address_country?: string
          address_postal_code: string
          address_street: string
          ai_analyzed_at?: string | null
          ai_description_summary?: string | null
          ai_extracted_features?: string[] | null
          ai_keywords?: string[] | null
          bathroom_description?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          energy_class?: string | null
          energy_declaration_url?: string | null
          features?: string[] | null
          floor_plan_url?: string | null
          id?: string
          images?: string[] | null
          is_nyproduktion?: boolean | null
          kitchen_description?: string | null
          last_renewed_at?: string | null
          latitude?: number | null
          living_area?: number | null
          longitude?: number | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?: string
          monthly_fee?: number | null
          nyproduktion_project_id?: string | null
          nyproduktion_total_units?: number | null
          operating_costs?: number | null
          original_price?: number | null
          plot_area?: number | null
          price: number
          price_change_format?: string | null
          property_documents?: Json | null
          property_type: string
          rental_info?: Json | null
          responsible_broker_id?: string | null
          rooms?: number | null
          show_bidding?: boolean | null
          show_price_change?: boolean | null
          status?: string
          threed_tour_url?: string | null
          title: string
          updated_at?: string
          user_id: string
          video_url?: string | null
          viewing_times?: Json | null
          year_built?: number | null
        }
        Update: {
          ad_tier?: string
          address_city?: string
          address_country?: string
          address_postal_code?: string
          address_street?: string
          ai_analyzed_at?: string | null
          ai_description_summary?: string | null
          ai_extracted_features?: string[] | null
          ai_keywords?: string[] | null
          bathroom_description?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          energy_class?: string | null
          energy_declaration_url?: string | null
          features?: string[] | null
          floor_plan_url?: string | null
          id?: string
          images?: string[] | null
          is_nyproduktion?: boolean | null
          kitchen_description?: string | null
          last_renewed_at?: string | null
          latitude?: number | null
          living_area?: number | null
          longitude?: number | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?: string
          monthly_fee?: number | null
          nyproduktion_project_id?: string | null
          nyproduktion_total_units?: number | null
          operating_costs?: number | null
          original_price?: number | null
          plot_area?: number | null
          price?: number
          price_change_format?: string | null
          property_documents?: Json | null
          property_type?: string
          rental_info?: Json | null
          responsible_broker_id?: string | null
          rooms?: number | null
          show_bidding?: boolean | null
          show_price_change?: boolean | null
          status?: string
          threed_tour_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
          viewing_times?: Json | null
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_nyproduktion_project_id_fkey"
            columns: ["nyproduktion_project_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_responsible_broker_id_fkey"
            columns: ["responsible_broker_id"]
            isOneToOne: false
            referencedRelation: "broker_property_stats"
            referencedColumns: ["broker_id"]
          },
          {
            foreignKeyName: "properties_responsible_broker_id_fkey"
            columns: ["responsible_broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
        ]
      }
      property_alerts: {
        Row: {
          created_at: string
          email_notifications: boolean
          id: string
          is_active: boolean
          last_sent_at: string | null
          name: string
          search_criteria: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          is_active?: boolean
          last_sent_at?: string | null
          name: string
          search_criteria: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          is_active?: boolean
          last_sent_at?: string | null
          name?: string
          search_criteria?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      property_favorites: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_final_price_interest: {
        Row: {
          created_at: string
          email: string
          id: string
          property_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          property_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          property_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_final_price_interest_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_final_price_watchers: {
        Row: {
          budget_range: string | null
          created_at: string
          current_living_situation: string | null
          email: string
          estimated_sale_timeframe: string | null
          id: string
          message: string | null
          name: string
          notified: boolean
          notified_at: string | null
          notify_via_email: boolean
          notify_via_sms: boolean
          phone: string | null
          planning_to_sell: boolean | null
          property_id: string
          reason_for_interest: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          current_living_situation?: string | null
          email: string
          estimated_sale_timeframe?: string | null
          id?: string
          message?: string | null
          name: string
          notified?: boolean
          notified_at?: string | null
          notify_via_email?: boolean
          notify_via_sms?: boolean
          phone?: string | null
          planning_to_sell?: boolean | null
          property_id: string
          reason_for_interest?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          current_living_situation?: string | null
          email?: string
          estimated_sale_timeframe?: string | null
          id?: string
          message?: string | null
          name?: string
          notified?: boolean
          notified_at?: string | null
          notify_via_email?: boolean
          notify_via_sms?: boolean
          phone?: string | null
          planning_to_sell?: boolean | null
          property_id?: string
          reason_for_interest?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_final_price_watchers_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          inquirer_id: string | null
          inquiry_type: string
          message: string
          name: string
          phone: string | null
          property_id: string
          responded_at: string | null
          response: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          inquirer_id?: string | null
          inquiry_type?: string
          message: string
          name: string
          phone?: string | null
          property_id: string
          responded_at?: string | null
          response?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          inquirer_id?: string | null
          inquiry_type?: string
          message?: string
          name?: string
          phone?: string | null
          property_id?: string
          responded_at?: string | null
          response?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_listings: {
        Row: {
          address: string
          agent_id: string | null
          area_sqm: number | null
          city: string
          coordinates: unknown
          created_at: string
          description: string | null
          energy_rating: string | null
          id: string
          listing_date: string | null
          listing_status: string | null
          price: number | null
          property_type: string
          region: string
          rooms: number | null
          sold_date: string | null
          sold_price: number | null
          updated_at: string
          year_built: number | null
        }
        Insert: {
          address: string
          agent_id?: string | null
          area_sqm?: number | null
          city: string
          coordinates?: unknown
          created_at?: string
          description?: string | null
          energy_rating?: string | null
          id?: string
          listing_date?: string | null
          listing_status?: string | null
          price?: number | null
          property_type: string
          region: string
          rooms?: number | null
          sold_date?: string | null
          sold_price?: number | null
          updated_at?: string
          year_built?: number | null
        }
        Update: {
          address?: string
          agent_id?: string | null
          area_sqm?: number | null
          city?: string
          coordinates?: unknown
          created_at?: string
          description?: string | null
          energy_rating?: string | null
          id?: string
          listing_date?: string | null
          listing_status?: string | null
          price?: number | null
          property_type?: string
          region?: string
          rooms?: number | null
          sold_date?: string | null
          sold_price?: number | null
          updated_at?: string
          year_built?: number | null
        }
        Relationships: []
      }
      property_sales_history: {
        Row: {
          address_city: string
          address_postal_code: string
          address_street: string
          agent_id: string | null
          created_at: string
          days_on_market: number | null
          final_bid_count: number | null
          geographic_area_id: string | null
          id: string
          latitude: number | null
          listing_price: number | null
          living_area: number | null
          longitude: number | null
          price_per_sqm: number | null
          property_type: string
          rooms: number | null
          sale_date: string
          sale_price: number
          updated_at: string
        }
        Insert: {
          address_city: string
          address_postal_code: string
          address_street: string
          agent_id?: string | null
          created_at?: string
          days_on_market?: number | null
          final_bid_count?: number | null
          geographic_area_id?: string | null
          id?: string
          latitude?: number | null
          listing_price?: number | null
          living_area?: number | null
          longitude?: number | null
          price_per_sqm?: number | null
          property_type: string
          rooms?: number | null
          sale_date: string
          sale_price: number
          updated_at?: string
        }
        Update: {
          address_city?: string
          address_postal_code?: string
          address_street?: string
          agent_id?: string | null
          created_at?: string
          days_on_market?: number | null
          final_bid_count?: number | null
          geographic_area_id?: string | null
          id?: string
          latitude?: number | null
          listing_price?: number | null
          living_area?: number | null
          longitude?: number | null
          price_per_sqm?: number | null
          property_type?: string
          rooms?: number | null
          sale_date?: string
          sale_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_sales_history_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "real_estate_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_sales_history_geographic_area_id_fkey"
            columns: ["geographic_area_id"]
            isOneToOne: false
            referencedRelation: "geographic_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      property_views: {
        Row: {
          id: string
          ip_address: unknown
          property_id: string
          user_agent: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          ip_address?: unknown
          property_id: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          ip_address?: unknown
          property_id?: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      real_estate_agents: {
        Row: {
          active_areas: string[] | null
          average_rating: number | null
          bio: string | null
          company: string
          created_at: string
          email: string | null
          id: string
          license_number: string | null
          name: string
          phone: string | null
          profile_image_url: string | null
          specialization: string[] | null
          total_sales_last_year: number | null
          updated_at: string
          website_url: string | null
          years_experience: number | null
        }
        Insert: {
          active_areas?: string[] | null
          average_rating?: number | null
          bio?: string | null
          company: string
          created_at?: string
          email?: string | null
          id?: string
          license_number?: string | null
          name: string
          phone?: string | null
          profile_image_url?: string | null
          specialization?: string[] | null
          total_sales_last_year?: number | null
          updated_at?: string
          website_url?: string | null
          years_experience?: number | null
        }
        Update: {
          active_areas?: string[] | null
          average_rating?: number | null
          bio?: string | null
          company?: string
          created_at?: string
          email?: string | null
          id?: string
          license_number?: string | null
          name?: string
          phone?: string | null
          profile_image_url?: string | null
          specialization?: string[] | null
          total_sales_last_year?: number | null
          updated_at?: string
          website_url?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string
          id: string
          name: string
          search_params: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          search_params: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          search_params?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      screen_share_sessions: {
        Row: {
          collaboration_session_id: string
          created_at: string
          current_view: Json | null
          ended_at: string | null
          id: string
          is_active: boolean
          presenter_id: string
          screen_type: string
        }
        Insert: {
          collaboration_session_id: string
          created_at?: string
          current_view?: Json | null
          ended_at?: string | null
          id?: string
          is_active?: boolean
          presenter_id: string
          screen_type?: string
        }
        Update: {
          collaboration_session_id?: string
          created_at?: string
          current_view?: Json | null
          ended_at?: string | null
          id?: string
          is_active?: boolean
          presenter_id?: string
          screen_type?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action_performed: string
          created_at: string
          event_category: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_performed: string
          created_at?: string
          event_category: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_performed?: string
          created_at?: string
          event_category?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      session_participants: {
        Row: {
          id: string
          joined_at: string
          last_active_at: string | null
          participant_name: string | null
          permissions: Json | null
          role: string
          session_id: string
          status: string
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string
          last_active_at?: string | null
          participant_name?: string | null
          permissions?: Json | null
          role?: string
          session_id: string
          status?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string
          last_active_at?: string | null
          participant_name?: string | null
          permissions?: Json | null
          role?: string
          session_id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          starts_at: string
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          starts_at?: string
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          starts_at?: string
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_ai_edits: {
        Row: {
          created_at: string
          edit_prompt: string
          edit_type: string
          edited_image_url: string
          id: string
          is_favorite: boolean
          original_image_url: string
          property_id: string | null
          property_title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          edit_prompt: string
          edit_type?: string
          edited_image_url: string
          id?: string
          is_favorite?: boolean
          original_image_url: string
          property_id?: string | null
          property_title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          edit_prompt?: string
          edit_type?: string
          edited_image_url?: string
          id?: string
          is_favorite?: boolean
          original_image_url?: string
          property_id?: string | null
          property_title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean
          id: string
          marketing_emails: boolean
          preferred_currency: string
          preferred_language: string
          sms_notifications: boolean
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          marketing_emails?: boolean
          preferred_currency?: string
          preferred_language?: string
          sms_notifications?: boolean
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          marketing_emails?: boolean
          preferred_currency?: string
          preferred_language?: string
          sms_notifications?: boolean
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          last_request_at: string
          request_count: number
          user_id: string
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          last_request_at?: string
          request_count?: number
          user_id: string
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          last_request_at?: string
          request_count?: number
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_search_history: {
        Row: {
          created_at: string
          id: string
          location: string | null
          price_range: string | null
          property_type: string | null
          search_filters: Json | null
          search_query: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          price_range?: string | null
          property_type?: string | null
          search_filters?: Json | null
          search_query?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          price_range?: string | null
          property_type?: string | null
          search_filters?: Json | null
          search_query?: string | null
          user_id?: string
        }
        Relationships: []
      }
      valuation_history: {
        Row: {
          created_at: string
          id: string
          property_data: Json
          updated_at: string
          user_id: string
          valuation_result: Json
        }
        Insert: {
          created_at?: string
          id?: string
          property_data: Json
          updated_at?: string
          user_id: string
          valuation_result: Json
        }
        Update: {
          created_at?: string
          id?: string
          property_data?: Json
          updated_at?: string
          user_id?: string
          valuation_result?: Json
        }
        Relationships: []
      }
      viewing_requests: {
        Row: {
          alternative_date_1: string | null
          alternative_date_2: string | null
          confirmed_date: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          id: string
          message: string | null
          property_id: string
          requested_date: string
          requester_id: string
          response_message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          alternative_date_1?: string | null
          alternative_date_2?: string | null
          confirmed_date?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          message?: string | null
          property_id: string
          requested_date: string
          requester_id: string
          response_message?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          alternative_date_1?: string | null
          alternative_date_2?: string | null
          confirmed_date?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          message?: string | null
          property_id?: string
          requested_date?: string
          requester_id?: string
          response_message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewing_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_chat_sessions: {
        Row: {
          collaboration_session_id: string
          created_at: string
          ended_at: string | null
          id: string
          is_active: boolean
          openai_session_id: string | null
          system_prompt: string | null
          voice_model: string | null
          voice_type: string | null
        }
        Insert: {
          collaboration_session_id: string
          created_at?: string
          ended_at?: string | null
          id?: string
          is_active?: boolean
          openai_session_id?: string | null
          system_prompt?: string | null
          voice_model?: string | null
          voice_type?: string | null
        }
        Update: {
          collaboration_session_id?: string
          created_at?: string
          ended_at?: string | null
          id?: string
          is_active?: boolean
          openai_session_id?: string | null
          system_prompt?: string | null
          voice_model?: string | null
          voice_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      broker_property_stats: {
        Row: {
          address_city: string | null
          address_postal_code: string | null
          address_street: string | null
          avg_price: number | null
          broker_id: string | null
          broker_name: string | null
          office_id: string | null
          office_name: string | null
          property_count: number | null
          property_type: string | null
          status: string | null
          total_area: number | null
        }
        Relationships: []
      }
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      delete_user_account: { Args: { user_id: string }; Returns: undefined }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
      dropgeometrytable:
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_public_agents: {
        Args: never
        Returns: {
          active_areas: string[]
          average_rating: number
          bio: string
          company: string
          created_at: string
          id: string
          name: string
          profile_image_url: string
          specialization: string[]
          total_sales_last_year: number
          updated_at: string
          website_url: string
          years_experience: number
        }[]
      }
      get_top_agents_for_area: {
        Args: {
          limit_count?: number
          property_type_filter?: string
          search_area: string
        }
        Returns: {
          agent_name: string
          avg_days_on_market: number
          avg_final_bids: number
          avg_rating: number
          company: string
          email: string
          phone: string
          recent_sales_count: number
          success_rate_vs_list_price: number
          total_sales: number
          years_experience: number
        }[]
      }
      gettransactionid: { Args: never; Returns: unknown }
      has_pro_subscription: {
        Args: { user_id_input: string }
        Returns: boolean
      }
      has_role: {
        Args: { p_role: string; p_user_id: string }
        Returns: boolean
      }
      is_admin: { Args: { p_user_id: string }; Returns: boolean }
      is_broker_or_admin: { Args: { p_user_id: string }; Returns: boolean }
      is_group_member: {
        Args: { group_uuid: string; user_uuid: string }
        Returns: boolean
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { use_typmod?: boolean }; Returns: string }
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      search_properties_in_area: {
        Args: { property_status?: string[]; search_query: string }
        Returns: {
          address_city: string
          address_postal_code: string
          address_street: string
          bathrooms: number
          bedrooms: number
          created_at: string
          description: string
          distance_km: number
          energy_class: string
          features: string[]
          id: string
          images: string[]
          latitude: number
          living_area: number
          longitude: number
          monthly_fee: number
          plot_area: number
          price: number
          property_type: string
          rooms: number
          status: string
          title: string
          user_id: string
          year_built: number
        }[]
      }
      search_sales_in_area: {
        Args: { end_year?: number; search_query: string; start_year?: number }
        Returns: {
          address_city: string
          address_street: string
          distance_km: number
          id: string
          latitude: number
          living_area: number
          longitude: number
          price_per_sqm: number
          property_type: string
          rooms: number
          sale_date: string
          sale_price: number
        }[]
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_askml:
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geom: unknown }; Returns: number }
        | { Args: { geog: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "buyer"
        | "seller"
        | "broker"
        | "company"
      subscription_tier: "basic" | "pro" | "pro_plus"
      user_role: "buyer" | "seller" | "broker" | "admin" | "company"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "buyer", "seller", "broker", "company"],
      subscription_tier: ["basic", "pro", "pro_plus"],
      user_role: ["buyer", "seller", "broker", "admin", "company"],
    },
  },
} as const
