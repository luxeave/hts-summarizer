// src/components/CodeLookup.tsx
import React, { useState } from 'react';

interface HtsEntry {
  htsno: string;
  indent: string;
  description: string;
  // add the other fields if you like
  [key: string]: any;
}

interface Props {
  data: HtsEntry[]; // Use a typed array if you can
}

const CodeLookup: React.FC<Props> = ({ data }) => {
  const [code, setCode] = useState('');
  const [lookupResult, setLookupResult] = useState('');

  const handleLookup = () => {
    if (!code) return;
  
    const found = data.find((item) => item.htsno === code);
    if (!found) {
      setLookupResult('No matching code found.');
    } else {
      // Show info about 'found'
      setLookupResult(
        `HTS NO: ${found.htsno}\nDescription: ${found.description}\nDuties: General=${found.general}, Special=${found.special}, Other=${found.other}`
      );
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Look Up a Code</h2>
      <input
        type="text"
        placeholder="Enter e.g. 0101.21.00.10"
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