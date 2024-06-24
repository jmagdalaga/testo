export interface Tutorial {
  id?: any;
  title: string;
  description?: string;
  published?: boolean;
  date?: Date;
  isEditing?: boolean;
  APR?: string;
  MAY?: string;
  JUN?: string;
  JUL?: string;
  AUG?: string;
  SEP?: string;
  OCT?: string;
  NOV?: string;
  DEC?: string;
  JAN?: string;
  FEB?: string;
  MAR?: string;
  [key: string]: any; // This allows access to month properties dynamically
}
