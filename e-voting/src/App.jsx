import { BrowserRouter as Router, Routes,Route } from 'react-router-dom' 
import Navbar from './components/Navbar'
import Home from './components/Home'
import Vote from './components/Vote'
import Result from './components/Result'
import About from './components/About'
import Contact from './components/Contact'
import Admin from './components/Admin'
import Footer from './components/footer'
// import './App.css'

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          {
           <>
          <Route path="/" element={<Home />} />
          <Route path="/vote" element={<Vote  />} />
          <Route path="/result" element={<Result />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          
          
          </>
           }
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App

  
