import { Routes } from '@angular/router';

export const remoteRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./components/users/users').then((m) => m.Users),
      },
      {
        path: 'user/create',
        loadComponent: () =>
          import('./components/user-create/user-create').then(
            (m) => m.UserCreate
          ),
      },
      {
        path: 'user/details/:id',
        loadComponent: () =>
          import('./components/user-detail/user-detail').then(
            (m) => m.UserDetail
          ),
      },
      {
        path: 'vendors',
        loadComponent: () =>
          import('./components/vendor/vendor').then((m) => m.Vendor),
      },
      {
        path: 'vendor/create',
        loadComponent: () =>
          import('./components/vendor-create/vendor-create').then(
            (m) => m.VendorCreate
          ),
      },
      {
        path: 'vendor/details/:id',
        loadComponent: () =>
          import('./components/vendor-detail/vendor-detail').then(
            (m) => m.VendorDetail
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./components/products/products').then((m) => m.Products),
      },
      {
        path: 'product/create',
        loadComponent: () =>
          import('./components/product-create/product-create').then(
            (m) => m.ProductCreate
          ),
      },
      {
        path: 'product/details/:id',
        loadComponent: () =>
          import('./components/product-detail/product-detail').then(
            (m) => m.ProductDetail
          ),
      },
      {
        path: 'requests',
        loadComponent: () =>
          import('./components/requests/requests').then((m) => m.Requests),
      },
      {
        path: 'request/create',
        loadComponent: () =>
          import('./components/request-create/request-create').then(
            (m) => m.RequestCreate
          ),
      },
      {
        path: 'request/details/:id',
        loadComponent: () =>
          import('./components/request-detail/request-detail').then(
            (m) => m.RequestDetail
          ),
      },
      {
        path: 'request-line/create/:id',
        loadComponent: () =>
          import('./components/requestline-create/requestline-create').then(
            (m) => m.RequestlineCreate
          ),
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./components/review/review').then((m) => m.Review),
      },
    ],
  },
];
