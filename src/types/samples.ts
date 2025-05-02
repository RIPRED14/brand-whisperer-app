export interface Sample {
  id: string;
  number: string;
  product: string;
  readyTime?: string;
  fabrication?: string;
  dlc?: string;
  smell?: 'N' | 'A' | 'B' | 'C' | 'D' | string;
  texture?: 'N' | 'A' | 'B' | 'C' | 'D' | string;
  taste?: 'N' | 'A' | 'B' | 'C' | 'D' | string;
  aspect?: 'N' | 'A' | 'B' | 'C' | 'D' | string;
  ph?: string;
  enterobacteria?: string;
  yeastMold?: string;
  createdAt?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'rejected';
  // Propriétés pour le formulaire
  program?: string;
  label?: string;
  nature?: string;
  labComment?: string;
  additionalDetails?: string;
  temperature?: string;
  analysisDate?: string;
  storageTemp?: string;
  breakDate?: string;
  assignedTo?: string;
  reportTitle?: string;
  brand?: string;
  // Ajout de champs pour les lectures microbiologiques
  entero_reading_due?: string;
  yeast_reading_due?: string;
}

export interface SupabaseSample {
  id: string;
  number: string;
  product: string;
  ready_time: string;
  fabrication: string;
  dlc: string;
  smell: string;
  texture: string;
  taste: string;
  aspect: string;
  ph: string | null;
  enterobacteria: string | null;
  yeast_mold: string | null;
  created_at: string;
  modified_at: string;
  modified_by: string | null;
  status: string;
  entero_reading_due: string | null;
  yeast_reading_due: string | null;
  assigned_to: string | null;
  report_title: string | null;
  brand: string | null;
}

export interface BatchNumbers {
  id: string;
  reportId: string;
  waterPeptone?: string;
  petriDishes?: string;
  VRBGGel?: string;
  YGCGel?: string;
  createdAt: string;
}
