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
      batch_numbers: {
        Row: {
          created_at: string
          id: string
          petri_dishes: string | null
          report_id: string
          vrbg_gel: string | null
          water_peptone: string | null
          ygc_gel: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          petri_dishes?: string | null
          report_id: string
          vrbg_gel?: string | null
          water_peptone?: string | null
          ygc_gel?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          petri_dishes?: string | null
          report_id?: string
          vrbg_gel?: string | null
          water_peptone?: string | null
          ygc_gel?: string | null
        }
        Relationships: []
      }
      change_history: {
        Row: {
          action: string
          field: string | null
          id: string
          new_value: string | null
          old_value: string | null
          role: string
          sample_id: string | null
          timestamp: string
          user_name: string
        }
        Insert: {
          action: string
          field?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          role: string
          sample_id?: string | null
          timestamp?: string
          user_name: string
        }
        Update: {
          action?: string
          field?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          role?: string
          sample_id?: string | null
          timestamp?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_history_sample_id_fkey"
            columns: ["sample_id"]
            isOneToOne: false
            referencedRelation: "samples"
            referencedColumns: ["id"]
          },
        ]
      }
      form_samples: {
        Row: {
          additional_details: string | null
          analysis_date: string | null
          break_date: string | null
          created_at: string
          id: string
          lab_comment: string | null
          label: string | null
          nature: string | null
          program: string | null
          report_id: string
          storage_temp: string | null
          temperature: string | null
        }
        Insert: {
          additional_details?: string | null
          analysis_date?: string | null
          break_date?: string | null
          created_at?: string
          id?: string
          lab_comment?: string | null
          label?: string | null
          nature?: string | null
          program?: string | null
          report_id: string
          storage_temp?: string | null
          temperature?: string | null
        }
        Update: {
          additional_details?: string | null
          analysis_date?: string | null
          break_date?: string | null
          created_at?: string
          id?: string
          lab_comment?: string | null
          label?: string | null
          nature?: string | null
          program?: string | null
          report_id?: string
          storage_temp?: string | null
          temperature?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          sample_id: string | null
          sample_number: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          sample_id?: string | null
          sample_number: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          sample_id?: string | null
          sample_number?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_sample_id_fkey"
            columns: ["sample_id"]
            isOneToOne: false
            referencedRelation: "samples"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_forms: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          reference: string | null
          report_id: string
          sample_date: string
          site: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          reference?: string | null
          report_id: string
          sample_date: string
          site: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          reference?: string | null
          report_id?: string
          sample_date?: string
          site?: string
        }
        Relationships: []
      }
      samples: {
        Row: {
          aspect: string
          assigned_to: string | null
          brand: string | null
          created_at: string
          dlc: string
          enterobacteria: string | null
          fabrication: string
          id: string
          modified_at: string
          modified_by: string | null
          number: string
          ph: string | null
          product: string
          ready_time: string
          report_title: string | null
          smell: string
          status: string
          taste: string
          texture: string
          yeast_mold: string | null
        }
        Insert: {
          aspect?: string
          assigned_to?: string | null
          brand?: string | null
          created_at?: string
          dlc: string
          enterobacteria?: string | null
          fabrication: string
          id?: string
          modified_at?: string
          modified_by?: string | null
          number: string
          ph?: string | null
          product: string
          ready_time: string
          report_title?: string | null
          smell?: string
          status?: string
          taste?: string
          texture?: string
          yeast_mold?: string | null
        }
        Update: {
          aspect?: string
          assigned_to?: string | null
          brand?: string | null
          created_at?: string
          dlc?: string
          enterobacteria?: string | null
          fabrication?: string
          id?: string
          modified_at?: string
          modified_by?: string | null
          number?: string
          ph?: string | null
          product?: string
          ready_time?: string
          report_title?: string | null
          smell?: string
          status?: string
          taste?: string
          texture?: string
          yeast_mold?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
