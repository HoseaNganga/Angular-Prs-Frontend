import { User } from '../../../../services/auth/model/auth.model';

export const displayedRequestColumns: string[] = [
  'user',
  'description',
  'justification',
  'requestNumber',
  'submittedDate',
  'total',
  'status',
  'actions',
];

export interface RequestInterface {
  id: number;
  description: string;
  justification: string;
  rejectionReason: string | null;
  status: string;
  total: number;
  deliveryMode: string;
  requestNumber: string;
  submittedDate: Date;
  user: User;
}
