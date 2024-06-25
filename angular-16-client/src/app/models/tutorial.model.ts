export class Tutorial {
  id?: any;
  title?: string;
  description?: string;
  month_year?: string;
  currency?: string;
  amount?: number;
  usd_amount?: number;
  spot_rate?: number;
  section?: string;
  department?: string;
  published?: boolean;
  isEditing?: boolean;
  date?: Date;
  months?: { [key: string]: number }; // Add this to store monthly USD amounts
  [key: string]: any; 
}
