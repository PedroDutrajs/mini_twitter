import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useLocation 
} from 'react-router-dom';

import Login          from './components/pages/Login';
import Register       from './components/pages/Register';
import Feed           from './components/pages/Feed';
import CreatePost     from './components/pages/CreatePost';
import EditPost       from './components/pages/EditPost';
import SearchPage     from './components/pages/SearchPage';
import ProfilePage    from './components/pages/ProfilePage';
import FollowersPage  from './components/pages/FollowersPage';
import FollowingPage  from './components/pages/FollowingPage';
import NavBar         from './components/NavBar';

function AppRoutes() {
  const token = localStorage.getItem('access_token');
  const location = useLocation();
  const noNavPaths = ['/', '/register'];

  return (
    <>
      { !noNavPaths.includes(location.pathname) && <NavBar /> }

      <Routes>
        {/* Públicas */}
        <Route path="/"        element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protegidas */}
        <Route
          path="/feed"
          element={ token 
            ? <Feed /> 
            : <Navigate to="/" replace /> }
        />
        <Route
          path="/create"
          element={ token 
            ? <CreatePost /> 
            : <Navigate to="/" replace /> }
        />
        <Route
          path="/edit/:id"
          element={ token 
            ? <EditPost /> 
            : <Navigate to="/" replace /> }
        />
        <Route
          path="/search"
          element={ token 
            ? <SearchPage /> 
            : <Navigate to="/" replace /> }
        />
        <Route
          path="/profile/:username"
          element={ token 
            ? <ProfilePage /> 
            : <Navigate to="/" replace /> }
        />
        <Route
          path="/followers"
          element={ token 
            ? <FollowersPage /> 
            : <Navigate to="/" replace /> }
        />
        <Route
          path="/following"
          element={ token 
            ? <FollowingPage /> 
            : <Navigate to="/" replace /> }
        />

        {/* Qualquer outra rota: se tiver token vai para feed, senão vai para login */}
        <Route
          path="*"
          element={
            <Navigate to={token ? '/feed' : '/'} replace />
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
