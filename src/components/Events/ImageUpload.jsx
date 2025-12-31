import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const ImageUpload = ({ image, setImage }) => {
    
    const generateUploadUrl = useMutation(api.events.generateUploadUrl);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;
        console.log(file);
        

        setUploading(true);

        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        try {
            // 1. Get upload URL
            const postUrl = await generateUploadUrl();

            // 2. Upload file
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error("Upload failed");

            const { storageId } = await result.json();

            // 3. Pass storageId to parent
            setImage(storageId);

        } catch (error) {
            console.error("Upload error:", error);
            setPreview(null);
            alert("Erreur lors de l'upload de l'image");
        } finally {
            setUploading(false);
        }
    }, [generateUploadUrl, setImage]);

    const handleRemove = (e) => {
        e.stopPropagation();
        setImage(null);
        setPreview(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        multiple: false,
        disabled: uploading
    });

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de l'événement
            </label>

            {image || preview ? (
                <div className="relative w-full h-64 rounded-xl overflow-hidden group border border-gray-200 shadow-sm">
                    {/* Note: If it's a storageId (string), we can't display it directly unless we have the URL. 
              Ideally, parent should pass the URL for display if editing, or we use the local preview. 
              For now, we rely on 'preview' for new uploads and assume 'image' is a URL when editing (handled in parent) */}
                    <img
                        src={preview || image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={handleRemove}
                            className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
            ${isDragActive ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4">
                        <div className={`p-4 rounded-full transition-colors ${isDragActive ? 'bg-emerald-200 text-emerald-700' : 'bg-emerald-100 text-emerald-600'}`}>
                            {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700 text-lg">
                                {uploading ? "Upload en cours..." : "Cliquez ou glissez une image ici"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                PNG, JPG, GIF jusqu'à 10MB
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
