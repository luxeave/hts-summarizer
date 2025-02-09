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
    <div style={{ padding: '2rem' }} className="App">
      <h1>HTS Code Summarizer</h1>
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