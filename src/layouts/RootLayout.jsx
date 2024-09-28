import React, { useContext, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Moon, Sun, BookOpen, BookType, User, Settings, LogIn, LogOut, Github, Twitter, Linkedin, Menu, X } from 'lucide-react';
import { ThemeContext } from '@/contexts/ThemeContext';

const RootLayout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-background transition-all duration-300">
      <ToastContainer position='bottom-right' autoClose={2000} theme='colored' />
      <header className="navbar h-28 bg-base-100/80 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex-1">
            <NavLink to="/" className="btn btn-ghost text-xl group">
              <BookOpen className="mr-2 text-primary group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-secondary-500 group-hover:bg-gradient-to-l transition-all duration-300">
                Notes App
              </span>
            </NavLink>
          </div>
          <div className="flex-none hidden md:block">
            <ul className="menu menu-horizontal px-2 gap-4">
              <NavItem to="/" icon={<BookType />} text="Diary" />
              <NavItem to="/school-notes" icon={<BookOpen />} text="School Notes" />
            </ul>
          </div>
          <div className="flex-none flex items-center gap-2">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar transition-all duration-300 hover:bg-primary/10">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src="https://api.dicebear.com/6.x/micah/svg?seed=JD" alt="User Avatar" />
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                {isLoggedIn ? (
                  <>
                    <li><a className="flex items-center"><User size={18} className="mr-2" /> Profile</a></li>
                    <li><a className="flex items-center"><Settings size={18} className="mr-2" /> Settings</a></li>
                    <li><a onClick={() => setIsLoggedIn(false)} className="flex items-center"><LogOut size={18} className="mr-2" /> Logout</a></li>
                  </>
                ) : (
                  <>
                    <li><a onClick={() => setIsLoggedIn(true)} className="flex items-center"><LogIn size={18} className="mr-2" /> Login</a></li>
                    <li><a className="flex items-center"><User size={18} className="mr-2" /> Register</a></li>
                  </>
                )}
              </ul>
            </div>
            <button onClick={toggleTheme} className="btn btn-circle btn-ghost hover:bg-primary/10 transition-colors duration-300">
              {theme === 'light' ? <Moon className="text-primary hover:rotate-12 transition-transform duration-300" /> : <Sun className="text-primary hover:rotate-90 transition-transform duration-300" />}
            </button>
            <button className="btn btn-ghost md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="md:hidden bg-base-200 shadow-lg animate-slideIn">
          <ul className="menu menu-vertical px-4 py-2">
            <NavItem to="/" icon={<BookType />} text="Diary" onClick={toggleMenu} />
            <NavItem to="/school-notes" icon={<BookOpen />} text="School Notes" onClick={toggleMenu} />
          </ul>
        </div>
      )}
      <main className="container mx-auto p-8 flex-grow">
        <Outlet />
      </main>
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div className="container mx-auto px-4">
          <div className="grid grid-flow-col gap-4">
            <a className="link link-hover hover:text-primary transition-colors duration-200">About us</a>
            <a className="link link-hover hover:text-primary transition-colors duration-200">Contact</a>
            <a className="link link-hover hover:text-primary transition-colors duration-200">Jobs</a>
            <a className="link link-hover hover:text-primary transition-colors duration-200">Press kit</a>
          </div>
          <div className="mt-4">
            <div className="grid grid-flow-col gap-4">
              <SocialIcon icon={<Github />} />
              <SocialIcon icon={<Twitter />} />
              <SocialIcon icon={<Linkedin />} />
            </div>
          </div>
          <div className="mt-4 text-sm opacity-70">
            <p>Copyright © {new Date().getFullYear()} - All rights reserved by Notes App Ltd</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const NavItem = ({ to, icon, text, onClick }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 rounded-lg transition-all duration-200
        ${isActive
          ? 'font-bold text-white bg-gradient-to-r from-accent-300 to-secondary-600'
          : 'text-base-content hover:scale-105'
        }`
      }
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{text}</span>
    </NavLink>
  </li>
);

const SocialIcon = ({ icon }) => (
  <a className="btn btn-ghost btn-circle text-primary hover:text-secondary hover:bg-primary/10 transition-all duration-300 transform hover:scale-110">
    {icon}
  </a>
);

export default RootLayout;
