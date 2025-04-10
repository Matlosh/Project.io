import type React from "react";
import { Homepage } from "../_pages/Homepage/Homepage.jsx";
import { Projects } from "../_pages/Projects/Projects.jsx";

export type MenuLink = {
  name: string,
  url: string,
  element: React.ReactNode
}

export const menuLinks: MenuLink[] = [
  { name: 'Home', url: '/', element: <Homepage /> },
  { name: 'Projects', url: '/projects', element: <Projects /> }
];