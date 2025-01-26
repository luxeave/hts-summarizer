// src/App.tsx
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import CodeLookup from './components/CodeLookup';

function App() {
  const [data, setData] = useState<any[]>([]);

  const handleJsonParsed = (parsedJson: any[]) => {
    // Optionally process the data here if needed
    setData(parsedJson);
  };

  return (
    <div>
      <h1>HTS Code Summarizer (Frontend Only)</h1>
      <FileUpload onJsonParsed={handleJsonParsed} />

      {data && data.length > 0 ? (
        <CodeLookup data={data} />
      ) : (
        <p>No data uploaded yet</p>
      )}
    </div>
  );
}

export default App;