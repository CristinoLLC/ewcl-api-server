import React, { useState } from 'react';

const UploadBox = ({ onFileUpload }) => {
    const [dragging, setDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const validFiles = files.filter(file => 
            file.type === 'application/json' || file.name.endsWith('.pdb')
        );
        if (validFiles.length > 0) {
            onFileUpload(validFiles);
        } else {
            alert('Please upload a valid .pdb or .json file.');
        }
    };

    return (
        <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center ${dragging ? 'border-blue-500' : 'border-gray-300'}`} 
            onDragOver={handleDragOver} 
            onDragLeave={handleDragLeave} 
            onDrop={handleDrop}
        >
            <p className="text-gray-600">Drag and drop your .pdb or .json files here</p>
            <p className="text-gray-400">or</p>
            <input 
                type="file" 
                accept=".pdb, application/json" 
                onChange={(e) => handleFiles(Array.from(e.target.files))} 
                className="mt-2"
            />
        </div>
    );
};

export default UploadBox;