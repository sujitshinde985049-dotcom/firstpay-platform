// Generated-style Supabase database definitions. Keep this file UTF-8 encoded.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type GenericRow = Record<string, Json | undefined>;
type GenericTable = {
  Row: GenericRow;
  Insert: GenericRow;
  Update: GenericRow;
  Relationships: Array<{
    foreignKeyName: string;
    columns: string[];
    isOneToOne: boolean;
    referencedRelation: string;
    referencedColumns: string[];
  }>;
};

export type Database = {
  public: {
    Tables: {
      analytics_events: GenericTable;
      announcements: GenericTable;
      api_credentials: GenericTable;
      api_usage_daily: GenericTable;
      audit_events: GenericTable;
      cms_categories: GenericTable;
      cms_entries: GenericTable;
      cms_entry_categories: GenericTable;
      cms_entry_tags: GenericTable;
      cms_related_entries: GenericTable;
      cms_tags: GenericTable;
      customers: GenericTable;
      departments: GenericTable;
      document_folders: GenericTable;
      email_templates: GenericTable;
      feature_flags: GenericTable;
      integration_configs: GenericTable;
      leads: GenericTable;
      mandates: GenericTable;
      media_assets: GenericTable;
      media_folders: GenericTable;
      notification_jobs: GenericTable;
      notifications: GenericTable;
      organisation_documents: GenericTable;
      organisation_invitations: GenericTable;
      organisation_member_roles: GenericTable;
      organisation_members: GenericTable;
      organisation_permissions: GenericTable;
      organisation_role_permissions: GenericTable;
      organisation_roles: GenericTable;
      organisations: GenericTable;
      payments: GenericTable;
      plan_features: GenericTable;
      platform_settings: GenericTable;
      profiles: GenericTable;
      seo_redirects: GenericTable;
      settlements: GenericTable;
      storage_usage_daily: GenericTable;
      subscription_plans: GenericTable;
      support_tickets: GenericTable;
      system_events: GenericTable;
      webhook_deliveries: GenericTable;
      webhook_endpoints: GenericTable;
    };
    Views: Record<never, never>;
    Functions: {
      has_permission: {
        Args: {
          requested_organisation_id: string;
          requested_permission: string;
        };
        Returns: boolean;
      };
      is_organisation_member: {
        Args: { requested_organisation_id: string };
        Returns: boolean;
      };
      is_super_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

type PublicSchema = Database["public"];

export type Tables<PublicTableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][PublicTableName] extends { Row: infer Row }
    ? Row
    : never;

export type TablesInsert<
  PublicTableName extends keyof PublicSchema["Tables"],
> = PublicSchema["Tables"][PublicTableName]["Insert"];

export type TablesUpdate<
  PublicTableName extends keyof PublicSchema["Tables"],
> = PublicSchema["Tables"][PublicTableName]["Update"];
