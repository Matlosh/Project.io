import { MemoryRouter, Outlet, Route, Routes } from "react-router";

import './App.css'
import { Menu } from './_components/Menu/Menu.jsx'
import { Homepage } from './_pages/Homepage/Homepage.jsx'
import { Projects } from "./_pages/Projects/Projects.jsx";

function Wrapper() {
  return (
    <>
      <Outlet />
      <Menu />
    </>
  );
}

export function App() {
  return (
    <view className='flex flex-col h-full'>
      <MemoryRouter>
        <Routes>
          <Route element={<Wrapper />}> 
            <Route path="/" element={<Homepage />} />
            <Route path="/projects" element={<Projects />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </view>
  )
}
