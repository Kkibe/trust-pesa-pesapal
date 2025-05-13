// App.js
import './App.css';
import { useContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import Footer from './components/Footer/Footer';
import Header from './components/header/Header';
import Error404 from './pages/404error/404error';
import Home from './pages/home';
import About from './pages/about';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Contact from './pages/contact/Contact';
import ScrollToHash from './components/ScrollToHash';
import Testimonial from './components/Testimonial/Testimonial';
import MultiStepForm from './components/Application/Application';
import { AuthContext } from './AuthContext'
import { getUser } from "./firebase";
import { ProtectedAuthRoute, ProtectedRoute } from './ProtectedRoutes';
import Success from './components/Application/Success';

function App() {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Simulating an async operation like fetching data
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulating 2 seconds load time
  }, []);

  useEffect(() => {
    currentUser && getUser(currentUser.email, setUserData)
  }, [currentUser])

  return (
    <div>
      {loading ? <Loader /> : (
        <div className='App'>
          <Header />
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<ProtectedAuthRoute><SignIn /></ProtectedAuthRoute>} />
            <Route path="/register" element={<ProtectedAuthRoute><SignUp /></ProtectedAuthRoute>} />
            <Route path="/apply" element={<ProtectedRoute><MultiStepForm userData={userData} /></ProtectedRoute>} />
            <Route path="/success" element={<Success />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
          <Testimonial />
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;