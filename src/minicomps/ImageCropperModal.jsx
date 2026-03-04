import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

// --- Utility to convert crop area into an actual File object ---
const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

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

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) return;
            // Convert Blob to File
            const file = new File([blob], `cropped-${Date.now()}.jpg`, { type: 'image/jpeg' });
            resolve(file);
        }, 'image/jpeg');
    });
};

const ImageCropperModal = ({ imageSrc, onCropComplete, onClose }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        setIsProcessing(true);
        try {
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedFile); // Send the new file back to SongEditor
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-background-secondary border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">Crop Cover Art</h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white">✕</button>
                </div>
                
                {/* The Cropper Area */}
                <div className="relative w-full h-80 bg-black">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // Forces a perfect square!
                        onCropChange={setCrop}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={setZoom}
                    />
                </div>

                {/* Controls & Save */}
                <div className="p-4 flex flex-col gap-4">
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(e.target.value)}
                        className="w-full accent-accent-primary"
                    />
                    <button 
                        onClick={handleSave}
                        disabled={isProcessing}
                        className="w-full bg-accent-primary text-black py-3 rounded-xl font-bold hover:bg-accent-hover transition-colors"
                    >
                        {isProcessing ? 'Processing...' : 'Apply Crop'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;