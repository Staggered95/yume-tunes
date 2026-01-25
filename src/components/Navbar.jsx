import {useState} from 'react';
import HamburgerButton from "../minicomps/HamburgerButton";
import Logo from '../minicomps/Logo';

export default function Navbar({isSidebarOpen, toggleSidebar}) 
{
    
    
    return (
    <>
    <nav className="flex items-center justify-between gap-4 p-6">
        <div onClick={toggleSidebar} className='flex items-center gap-2'>
            <Logo />       
        <div  className="text-2xl lg:text-3xl font-extrabold text-text-primary">YumeTunes</div>
        </div>

        <div className="relative left-3">
            <input type="text" 
                   className="bg-background-secondary focus:bg-background-active text-text-primary placeholder:text-text-secondary pl-10 lg:h-9 w-[33.33vw] hidden lg:inline md:inline h-8 rounded-lg outline-none transition-colors duration-300 ease-in-out"
                   placeholder="Search"
                   >
            </input>
            <svg className="hidden md:inline lg:inline absolute left-1 w-6 h-6 mt-1.5 ml-1 text-text-secondary font-light"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
        </div>

        <div className="flex items-center gap-4">
        <div className="text-text-secondary h-6 lg:h-8 p-2 lg:p-3 text-sm lg:text-md flex justify-center items-center cursor-default hover:text-accent-primary transition-colors duration-300 ease-in-out">Log In</div>
        <div className="bg-accent-primary hover:bg-accent-hover cursor-default rounded-sm h-6 lg:h-7 lg:p-3 p-2 text-sm lg:text-md flex justify-center items-center transition-colors duration-300 ease-in-out">Sign Up</div>
        
        <div>
            <svg 
                className="w-10 md:w-11 lg:w-12 h-10 md:h-11 lg:h-12 text-accent-primary hover:text-accent-hover transition-colors duration-300 ease-in-out"
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                aria-hidden="true">
  
                <path 
                  fill-rule="evenodd" 
                  d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" 
                  clip-rule="evenodd" />
            </svg>
        </div>
        </div>
    </nav>
    </>
    );
}