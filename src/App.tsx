import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/Home';
import CategoryPage from '@/pages/CategoryPage';
import ToolDetailPage from '@/pages/ToolDetailPage';
import NotFound from '@/pages/NotFound';

// Vite injects BASE_URL as e.g. '/tools/' in production builds and '/' in dev.
// React Router's basename wants no trailing slash, so strip it (and collapse
// the root case to undefined to avoid an empty-string basename).
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/tools/:slug" element={<ToolDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
