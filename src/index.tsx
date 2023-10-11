import ReactDOM from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Decks from './Decks'
import Games from './Games'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
      <Link className='text-blue-600' to='games/'> 対戦 </Link>
      <Link className='text-blue-600' to='decks/'> デッキ構築 </Link>
    </div>
    <Routes>
      <Route path='games/*' element={<Games />} />
      <Route path='decks/*' element={<Decks />} />
    </Routes>
  </BrowserRouter>
)
