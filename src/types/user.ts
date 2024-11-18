export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'medical doctor';
  createdAt: string;
  updatedAt: string;
}