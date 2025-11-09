'use client';

// lazy load the canvas in the client side.
import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('./Canvas').then((mod) => mod.Canvas), {
    ssr: false,// ssr strictky set to false coz how tf browser apis work in server breehhh.
    loading: () => (

        <div className='w-full h-full flex items-center justify-center text-md'>
            Loading Canvas..
        </div>

    ),
});

export function CanvasWrapper() {
    return <Canvas />
}