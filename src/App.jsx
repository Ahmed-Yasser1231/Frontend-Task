import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Loading from './pages/Loading';

// Lazy load components for route-based code splitting
const Home = lazy(() => import('./pages/Home'));
const Stores = lazy(() => import('./pages/Stores'));
const Books = lazy(() => import('./pages/Books'));
const Authors = lazy(() => import('./pages/Authors'));
const NotFound = lazy(() => import('./pages/NotFound'));
const StoreInventory = lazy(() => import('./pages/StoreInventory'));
const BrowseBooks = lazy(() => import('./pages/BrowseBooks'));
const BrowseAuthors = lazy(() => import('./pages/BrowseAuthors'));
const BrowseStores = lazy(() => import('./pages/BrowseStores'));
const AuthorProfile = lazy(() => import('./pages/AuthorProfile'));
function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ top: 20 }}
        toastOptions={{
          duration: 3000,
          style: {
            padding: '14px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            background: '#fff',
            color: '#1f2937',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
          },
          success: {
            iconTheme: {
              primary: '#BF5523',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/books" element={<Books />} />
            <Route path="/author" element={<Authors />} />
            <Route path="/store/:storeId" element={<StoreInventory />} />
            <Route path="/author/:authorId" element={<AuthorProfile />} />
            <Route path="/browsebooks" element={<BrowseBooks />} />
            <Route path="/browseauthors" element={<BrowseAuthors />} />
            <Route path="/browsestores" element={<BrowseStores />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;