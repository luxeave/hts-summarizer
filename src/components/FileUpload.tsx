// src/components/FileUpload.tsx
import React, { useState } from 'react';

const FileUpload: React.FC<{ onJsonParsed: (data: any) => void }> = ({ onJsonParsed }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const json = JSON.parse(text);
                onJsonParsed(json);
                alert('File parsed and stored in memory!');
            } catch (error) {
                console.error(error);
                alert('Invalid JSON file.');
            }
        };

        reader.readAsText(selectedFile);
    };

    return (
        <div>
            <input type="file" accept=".json" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!selectedFile}>
                Upload JSON
            </button>
        </div>
    );
};

export default FileUpload;