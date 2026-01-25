import { useState, useEffect} from 'react';
import MediaControllers from '../minicomps/MediaControllerIcons';
import VolumeIcon from '../minicomps/VolumeIcons';
import f2Image from '../assets/f2.png';

export default function BottomPlayer()
{

    return (
        <div className='group fixed w-full bottom-4 rounded-lg z-10'>
        <div className="flex gap-4 items-center justify-between m-2  p-1 backdrop-blur-sm">
            <div className='flex gap-4 items-center'>
                <img src={f2Image} alt="Test" className="w-14 h-14 object-cover rounded-md"/>
                <div>
                    <div className="text-text-primary font-bold">TestName</div>
                    <div className='text-text-secondary font-light'>TestArtist</div>
                </div>
            </div>

            <div>
                <MediaControllers/>
            </div>

            <div className='hidden md:flex items-center'>
                <VolumeIcon/>
                <div className='bg-background-active h-2 w-36 rounded-full'>
                    <div className="bg-accent-active h-2 w-1/2 rounded-full"></div>
                </div>
            </div>
        </div>
        <div className="flex items-center h-1 bg-background-secondary mx-3 rounded-full">
            <div className='h-1 bg-accent-secondary group-hover:bg-accent-hover transition-colors duration-200 ease-in-out w-1/3 rounded-full'></div>
            <div className='w-3 h-3 bg-text-secondary hover:bg-text-primary opacity-0 group-hover:opacity-100 rounded-full transition-all transform duration-200 ease-out'></div>
        </div>
        <div className='flex justify-between mx-3 pt-1 text-sm text-text-secondary'>
            <div>00:00</div>
            <div className='opacity-0 group-hover:opacity-80 text-text-muted'>▽</div>
            <div>01:30</div>
        </div>
        </div>
    );
}