export default [
  {
    path: '/apps/users/list',
    name: 'apps-users-list',
    component: () => import('@/views/apps/user/users-list/UsersList.vue'),
    meta: {
      resource: 'User',
    },
  },
  {
    path: '/apps/users/view/:id',
    name: 'apps-users-view',
    component: () => import('@/views/apps/user/users-view/UsersView.vue'),
  },
  {
    path: '/apps/vouchers/list',
    name: 'apps-vouchers-list',
    component: () => import('@/views/apps/voucher/vouchers-list/VouchersList.vue'),
    meta: {
      resource: 'Voucher',
    },
  },
]
