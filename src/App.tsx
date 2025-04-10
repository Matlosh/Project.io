import { MemoryRouter, Route, Routes } from "react-router";

import './App.css'
import { Menu } from './_components/Menu/Menu.jsx'
import { Homepage } from './_pages/Homepage/Homepage.jsx'

export function App() {
  return (
    <view className='flex flex-col h-full'>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Homepage />}>Home</Route>
        </Routes>
      </MemoryRouter>

      <Menu />
    </view>
  )
}
