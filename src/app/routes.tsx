import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import ArticleForm from './pages/ArticleForm';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'articles',
        element: <ArticleList />
      },
      {
        path: 'articles/:id',
        element: <ArticleDetail />
      },
      {
        path: 'articles/new',
        element: (
          <ProtectedRoute>
            <ArticleForm />
          </ProtectedRoute>
        )
      },
      {
        path: 'articles/edit/:id',
        element: (
          <ProtectedRoute>
            <ArticleForm />
          </ProtectedRoute>
        )
      }
    ]
  }
]); 