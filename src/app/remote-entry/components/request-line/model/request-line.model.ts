import { ProductInterface } from '../../products/models/product.model';
import { RequestInterface } from '../../requests/models/request.model';

export const displayedRequestLineColumns: string[] = [
  'name',
  'description',
  'status',
  'total',
];

export const displayedRequestLineItemsColumns: string[] = [
  'vendor',
  'product',
  'quantity',
  'price',
  'total',
  'actions',
];

export interface LineItem {
  id: number;
  quantity: number;
  product: ProductInterface;
  request: RequestInterface;
}
