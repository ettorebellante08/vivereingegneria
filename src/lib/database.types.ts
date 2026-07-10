/**
 * Hand-written database types mirroring supabase/migrations.
 *
 * After you link the project you can regenerate these from the live schema:
 *   supabase gen types typescript --linked > src/lib/database.types.ts
 */

// `member` = authenticated user with no elevated powers (base level).
export type AppRole = "member" | "blogger" | "web_admin" | "super_admin";
export type PostStatus = "draft" | "published";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: AppRole;
          must_change_password: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: AppRole;
          must_change_password?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content_json: Json | null;
          content_html: string | null;
          cover_url: string | null;
          status: PostStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content_json?: Json | null;
          content_html?: string | null;
          cover_url?: string | null;
          status?: PostStatus;
          published_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: { id: string; name: string; slug: string; created_at: string };
        Insert: { id?: string; name: string; slug: string };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      post_categories: {
        Row: { post_id: string; category_id: string };
        Insert: { post_id: string; category_id: string };
        Update: Partial<
          Database["public"]["Tables"]["post_categories"]["Insert"]
        >;
        Relationships: [];
      };
      static_pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content_json: Json | null;
          content_html: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content_json?: Json | null;
          content_html?: string | null;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["static_pages"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: { key: string; value: Json; updated_by?: string | null };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
        Relationships: [];
      };
      media: {
        Row: {
          id: string;
          path: string;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: { id?: string; path: string; uploaded_by?: string | null };
        Update: Partial<Database["public"]["Tables"]["media"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      authors: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      current_app_role: {
        Args: Record<string, never>;
        Returns: AppRole;
      };
      complete_password_change: {
        Args: Record<string, never>;
        Returns: undefined;
      };
    };
    Enums: {
      app_role: AppRole;
      post_status: PostStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
