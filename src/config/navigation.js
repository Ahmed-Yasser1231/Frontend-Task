import { matchPath } from 'react-router-dom';

export const navItems = [
  { path: '/', title: 'Shop' },
  { path: '/stores', title: 'Stores' },
  { path: '/author', title: 'Author' },
  { path: '/books', title: 'Books' },
];

export const pageMeta = [
  { path: '/', title: 'Shop', subtitle: 'Shop > Books' },
  { path: '/stores', title: 'Stores', subtitle: 'Admin > Stores' },
  { path: '/author', title: 'Authors', subtitle: 'Admin > Authors' },
  { path: '/books', title: 'Books', subtitle: 'Admin > Books' },
  { path: '/store/:storeId', title: 'Store Inventory', subtitle: 'Admin > Store Inventory' },
  { path: '/author/:authorId', title: 'Author Profile', subtitle: 'Shop > Authors' },
  { path: '/browsebooks', title: 'Browse Books', subtitle: 'Shop > Books' },
  { path: '/browseauthors', title: 'Browse Authors', subtitle: 'Shop > Authors' },
  { path: '/browsestores', title: 'Browse Stores', subtitle: 'Shop > Stores' },
];

export const getPageMeta = (pathname) =>
  pageMeta.find((item) => matchPath({ path: item.path, end: true }, pathname)) || null;
