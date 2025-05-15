
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check for saved theme preference or system preference before rendering
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const theme = savedTheme || (prefersDark ? 'dark' : 'light');
document.documentElement.classList.add(theme);

createRoot(document.getElementById("root")!).render(<App />);
