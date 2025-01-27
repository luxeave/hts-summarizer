// src/components/CodeLookup.tsx
import React, { useState } from 'react';

interface HtsEntry {
  htsno: string;
  indent: string;
  description: string;
  // other fields...
  [key: string]: any;
}

interface Props {
  data: HtsEntry[];
}

const CodeLookup: React.FC<Props> = ({ data }) => {
  const [code, setCode] = useState('');
  const [lookupResult, setLookupResult] = useState('');

  const handleLookup = () => {
    if (!code) {
      setLookupResult('Please enter a code.');
      return;
    }

    // 1) Split the code by '.' => ["0101", "21", "00", "10"]
    const parts = code.split('.').filter(Boolean);

    // 2) Build incremental sub-codes => ["0101", "0101.21", "0101.21.00", "0101.21.00.10"]
    const incrementalCodes: string[] = [];
    let accum = parts[0];
    incrementalCodes.push(accum);
    for (let i = 1; i < parts.length; i++) {
      accum = accum + '.' + parts[i];
      incrementalCodes.push(accum);
    }

    // This array will hold the indexes in 'data' that match (or follow) each sub-code
    const matchedIndexes: number[] = [];

    // Keep track of where to start searching in the data
    let startIndex = 0;

    // 3) For each incremental code, find it in the data, then collect subsequent blanks
    for (const subCode of incrementalCodes) {
      // Find the item in the data with htsno = subCode, starting at 'startIndex'
      let foundIndex = data.slice(startIndex).findIndex(item => item.htsno === subCode);

      if (foundIndex !== -1) {
        // Adjust 'foundIndex' to be relative to the overall data
        foundIndex += startIndex;

        // Push the found index
        matchedIndexes.push(foundIndex);

        // Now walk forward from foundIndex + 1 to grab items with blank htsno:
        let next = foundIndex + 1;
        while (next < data.length && data[next].htsno === '') {
          matchedIndexes.push(next);
          next++;
        }

        // Update startIndex so that the next sub-code search begins after this block
        startIndex = next;
      }
      // If not found, we skip to the next sub-code
    }

    // 4) Now gather descriptions (or other fields) from these matched indexes
    if (matchedIndexes.length === 0) {
      setLookupResult('No matching code(s) found in the data.');
      return;
    }

    // e.g. Just gather descriptions
    const descriptions = matchedIndexes.map(i => data[i].description);

    // Combine descriptions, or do something more elaborate as needed
    const resultText = descriptions.join('\n');

    // Show it to the user (you could also show duties from the last matched code, etc.)
    setLookupResult(resultText);
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