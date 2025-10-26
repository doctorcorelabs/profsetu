import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as HotToaster } from "react-hot-toast";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PostDetail from "./pages/PostDetail";
import PostsArchive from "./pages/PostsArchive";
import { AuthProvider, useAuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./components/Admin/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Dashboard from "./pages/Admin/Dashboard";
import PostsList from "./pages/Admin/Posts/List";
import CreatePost from "./pages/Admin/Posts/Create";
import EditPost from "./pages/Admin/Posts/Edit";
import Categories from "./pages/Admin/Categories";
import Tags from "./pages/Admin/Tags";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const AppContent = () => {
  const auth = useAuthProvider();

  return (
    <ErrorBoundary>
      <AuthProvider value={auth}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HotToaster position="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/posts" element={<PostsArchive />} />
              <Route path="/posts/:slug" element={<PostDetail />} />
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="posts" element={<PostsList />} />
                <Route path="posts/create" element={<CreatePost />} />
                <Route path="posts/:id/edit" element={<EditPost />} />
                <Route path="categories" element={<Categories />} />
                <Route path="tags" element={<Tags />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
