// src/components/CodeLookup.tsx
import React, { useState } from 'react';

interface Props {
    data: any; // or a more precise type if you have a known schema
}

const CodeLookup: React.FC<Props> = ({ data }) => {
    const [code, setCode] = useState('');
    const [lookupResult, setLookupResult] = useState('');

    const handleLookup = () => {
        if (!code) return;

        // 1. Split code into parts, e.g. '8501.10.40.40' -> ['8501','10','40','40']
        const parts = code.split('.');

        // 2. Traverse your in-memory data structure
        //    For example, if `data` is a top-level array of chapters,
        //    you'd find the matching chapter, then heading, subheading, etc.
        //    This depends on how you structure the JSON.

        // For demonstration, let’s just do a simple approach:
        const descriptions: string[] = [];
        // (Pseudo-code) Traverse the nested data as you prefer:
        // - data.chapter -> data.heading -> data.subheading...
        // Collect descriptions. Example:
        // descriptions.push(...foundNodeDescriptions);

        // 3. Combine them into a single string
        const combinedText = descriptions.join('\n');

        // 4. Set it in state
        setLookupResult(combinedText || 'No matching code found.');
    };

    return (
        <div style={{ marginTop: 20 }}>
            <h2>Look Up a Code</h2>
            <input
                type="text"
                placeholder="Enter e.g. 8501.10.40.40"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={handleLookup}>Lookup</button>
            <div>
                <pre>{lookupResult}</pre>
            </div>
        </div>
    );
};

export default CodeLookup;