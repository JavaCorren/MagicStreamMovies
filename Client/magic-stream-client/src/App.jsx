import './App.css'
import Home from './components/home/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'
import Recommended from './components/recommended/Recommended'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RequiredAuth from './components/RequiredAuth'
import Review from './components/review/Review'
import StreamMovie from './components/stream/StreamMovie'

function App() {

  return (
    <>
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="logout" element={<Home/>}/>
          <Route element={<RequiredAuth/>}>
          <Route path="recommended" element={<Recommended/>}/>
          <Route path="review/:imdb_id" element={<Review/>}/>
          <Route path="stream/:yt_id" element={<StreamMovie/>}/>
        </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
