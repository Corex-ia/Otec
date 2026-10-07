export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'ejecutivo' | 'contable' | 'ejecutor' | 'vendedor' | 'student';
export type CourseModality = 'presencial' | 'online' | 'hibrido';
export type LessonType = 'video' | 'h5p' | 'quiz' | 'text';
export type DealStatus = 'negociacion' | 'contrato' | 'ejecucion' | 'facturado' | 'cerrado';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: UserRole;
          avatar_url: string | null;
          phone: string | null;
          company_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: UserRole;
          avatar_url?: string | null;
          phone?: string | null;
          company_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: UserRole;
          avatar_url?: string | null;
          phone?: string | null;
          company_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          rut: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          region: string | null;
          contact_name: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          rut: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          region?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          rut?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          region?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          image_url: string | null;
          price: number;
          duration_hours: number;
          modality: CourseModality;
          area: string | null;
          sence_code: string | null;
          is_sence: boolean;
          is_published: boolean;
          instructor_name: string | null;
          instructor_bio: string | null;
          instructor_avatar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          image_url?: string | null;
          price?: number;
          duration_hours?: number;
          modality?: CourseModality;
          area?: string | null;
          sence_code?: string | null;
          is_sence?: boolean;
          is_published?: boolean;
          instructor_name?: string | null;
          instructor_bio?: string | null;
          instructor_avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          image_url?: string | null;
          price?: number;
          duration_hours?: number;
          modality?: CourseModality;
          area?: string | null;
          sence_code?: string | null;
          is_sence?: boolean;
          is_published?: boolean;
          instructor_name?: string | null;
          instructor_bio?: string | null;
          instructor_avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string | null;
          order_index: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          description: string | null;
          type: LessonType;
          order_index: number;
          video_url: string | null;
          duration_seconds: number;
          h5p_content_url: string | null;
          text_content: string | null;
          is_free: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          description?: string | null;
          type: LessonType;
          order_index: number;
          video_url?: string | null;
          duration_seconds?: number;
          h5p_content_url?: string | null;
          text_content?: string | null;
          is_free?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          title?: string;
          description?: string | null;
          type?: LessonType;
          order_index?: number;
          video_url?: string | null;
          duration_seconds?: number;
          h5p_content_url?: string | null;
          text_content?: string | null;
          is_free?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          enrolled_at: string;
          completed_at: string | null;
          progress: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          enrolled_at?: string;
          completed_at?: string | null;
          progress?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          enrolled_at?: string;
          completed_at?: string | null;
          progress?: number;
        };
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          last_position_seconds: number;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          completed?: boolean;
          last_position_seconds?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          completed?: boolean;
          last_position_seconds?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      certificates: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          certificate_url: string;
          issued_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          certificate_url: string;
          issued_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          certificate_url?: string;
          issued_at?: string;
        };
      };
      deals: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          company_id: string | null;
          value: number;
          status: DealStatus;
          assigned_to: string | null;
          expected_close_date: string | null;
          closed_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          company_id?: string | null;
          value?: number;
          status?: DealStatus;
          assigned_to?: string | null;
          expected_close_date?: string | null;
          closed_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          company_id?: string | null;
          value?: number;
          status?: DealStatus;
          assigned_to?: string | null;
          expected_close_date?: string | null;
          closed_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          assigned_to: string | null;
          created_by: string | null;
          deal_id: string | null;
          company_id: string | null;
          due_date: string | null;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          assigned_to?: string | null;
          created_by?: string | null;
          deal_id?: string | null;
          company_id?: string | null;
          due_date?: string | null;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          assigned_to?: string | null;
          created_by?: string | null;
          deal_id?: string | null;
          company_id?: string | null;
          due_date?: string | null;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          content: string;
          created_by: string | null;
          company_id: string | null;
          deal_id: string | null;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          created_by?: string | null;
          company_id?: string | null;
          deal_id?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          created_by?: string | null;
          company_id?: string | null;
          deal_id?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_date: string;
          end_date: string | null;
          location: string | null;
          address: string | null;
          capacity: number;
          ticket_price: number;
          has_seating: boolean;
          image_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          event_date: string;
          end_date?: string | null;
          location?: string | null;
          address?: string | null;
          capacity?: number;
          ticket_price?: number;
          has_seating?: boolean;
          image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          event_date?: string;
          end_date?: string | null;
          location?: string | null;
          address?: string | null;
          capacity?: number;
          ticket_price?: number;
          has_seating?: boolean;
          image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ticket_sections: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          price: number;
          capacity: number;
          seats_available: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          price?: number;
          capacity?: number;
          seats_available?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          price?: number;
          capacity?: number;
          seats_available?: number;
          created_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          event_id: string;
          section_id: string | null;
          user_id: string;
          order_id: string | null;
          seat_number: string | null;
          qr_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          section_id?: string | null;
          user_id: string;
          order_id?: string | null;
          seat_number?: string | null;
          qr_code?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          section_id?: string | null;
          user_id?: string;
          order_id?: string | null;
          seat_number?: string | null;
          qr_code?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          total: number;
          status: OrderStatus;
          payment_method: string | null;
          webpay_token: string | null;
          webpay_transaction_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total?: number;
          status?: OrderStatus;
          payment_method?: string | null;
          webpay_token?: string | null;
          webpay_transaction_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total?: number;
          status?: OrderStatus;
          payment_method?: string | null;
          webpay_token?: string | null;
          webpay_transaction_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          item_type: string;
          course_id: string | null;
          event_id: string | null;
          section_id: string | null;
          seat_number: string | null;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          item_type: string;
          course_id?: string | null;
          event_id?: string | null;
          section_id?: string | null;
          seat_number?: string | null;
          quantity?: number;
          price?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          item_type?: string;
          course_id?: string | null;
          event_id?: string | null;
          section_id?: string | null;
          seat_number?: string | null;
          quantity?: number;
          price?: number;
          created_at?: string;
        };
      };
    };
  };
}
