import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

/**
 * Utility: Processes the image source and pixel crop data via Canvas
 * to generate a clean JPEG file for the backend.
 */
const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas to the exact size of the crop for 1:1 precision
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the specific region from the source image
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            // Create a File object that the backend's Multer expects
            const file = new File([blob], `crop-${Date.now()}.jpg`, { type: 'image/jpeg' });
            resolve(file);
        }, 'image/jpeg', 0.95); // 0.95 quality for high-res covers
    });
};

const ImageCropperModal = ({ imageSrc, onCropComplete, onClose }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropCompleteHandler = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedFile);
        } catch (e) {
            console.error("Cropping failed:", e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop: Standardized blur */}
            <div 
                className="absolute inset-0 bg-background-primary/90 backdrop-blur-md" 
                onClick={onClose} 
            />
            
            <div className="relative bg-background-secondary border border-border rounded-[2rem] w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-background-active/10">
                    <h3 className="font-black text-sm uppercase tracking-widest text-text-primary">Adjust Cover Art</h3>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-text-secondary hover:text-error transition-colors rounded-xl hover:bg-background-hover"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* The Cropper Area: Enforced Square */}
                <div className="relative w-full h-80 bg-background-primary border-y border-border">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} 
                        onCropChange={setCrop}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={setZoom}
                        classes={{
                            containerClassName: "rounded-none",
                            mediaClassName: "transition-none", // Prevents lag during drag
                        }}
                    />
                </div>

                {/* Controls & Save */}
                <div className="p-6 flex flex-col gap-6 bg-background-secondary">
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                            <span>Zoom</span>
                            <span className="text-accent-primary">{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full accent-accent-primary h-1.5 bg-background-primary rounded-full appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-4 text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-background-hover rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isProcessing}
                            className="flex-1 bg-accent-primary text-background-primary py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-accent-primary/20 hover:bg-accent-hover hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isProcessing ? 'Processing...' : 'Apply Crop'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;