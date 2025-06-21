export interface VendorInterface {
  id: number;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: number;
  email: string;
  preferred?: boolean;
}

export const displayedVendorColumns: string[] = [
  'id',
  'code',
  'name',
  'address',
  'city',
  'state',
  'zip',
  'phone',
  'email',
  'actions',
];
