export type BarrelFileLayout = {
  layout: "split" | "standard";
};

export type ExportAnalysis = {
  has_arrays: boolean;
  has_enums: boolean;
  has_objects: boolean;
  has_refs: boolean;
  has_unions: boolean;
  max_depth: number;
  optional_fields: string[];
  required_fields: string[];
};

export type FaviconizerOptions = {
  app_description: string;
  app_name: string;
  app_short_name: string;
  background_color: string;
  theme_color: string;
};

export type ProcessingStats = {
  files_processed: number;
  processing_time_ms: number;
  projects_processed: number;
};
