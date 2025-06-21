import { VendorInterface } from '../../vendor/model/vendor.model';

export const displayedProductColumns: string[] = [
  'id',
  'partNbr',
  'name',
  'price',
  'unit',
  'photoPath',
  'vendor',
  'actions'
];

export interface ProductInterface {
  id: number;
  partNbr: string;
  name: string;
  price: number;
  unit: string;
  photoPath: string;
  vendor: VendorInterface;
}
