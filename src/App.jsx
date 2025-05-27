import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import LobbyPage from './pages/LobbyPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/reset.css';
import './assets/styles/base.scss';
import GamePage from './pages/GamePage/GamePage.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import FindGamePage from './pages/FindGamePage.jsx';
import { MultiSocketProvider } from './components/MultiSocketContext.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function App() {
    return (
        <MultiSocketProvider>
            <Router>
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />

                    <Route element={<RequireAuth />}>
                        <Route path="/" element={<LobbyPage />} />
                        <Route path="/game" element={<GamePage />} />
                        <Route path="/find-game" element={<FindGamePage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>

                    <Route path="/profile/:username" element={<ProfilePage />} />

                    {/* other routes */}

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </Router>
        </MultiSocketProvider>
    );
}

export default App;
