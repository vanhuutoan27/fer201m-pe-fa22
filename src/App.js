import './App.css';
import '@fontsource/poppins';
import { Route, Routes } from 'react-router-dom';

// COMPONENTS
import Navigation from './components/Navigation';

// PAGES
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import News from './pages/News';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Detail from './pages/Detail';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/news" element={<News />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/detail/:id" element={<Detail />}></Route>
      </Routes>
    </div>
  );
}

export default App;
