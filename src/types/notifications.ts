
export interface Notification {
  id: string;
  sampleId?: string;
  sampleNumber: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  createdAt: string;
  read: boolean;
}

export interface SupabaseNotification {
  id: string;
  sample_id: string | null;
  sample_number: string;
  message: string;
  type: string;
  created_at: string;
  read: boolean;
}
