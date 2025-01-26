// src/App.tsx
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import CodeLookup from './components/CodeLookup';

function App() {
  // You can store the entire parsed JSON in 'data', or store
  // a more processed structure if you prefer
  const [data, setData] = useState<any>(null);

  const handleJsonParsed = (parsedJson: any) => {
    // Optionally, process the data here to build a
    // hierarchical structure or dictionary
    setData(parsedJson);
  };

  return (
    <div>
      <h1>HTS Code Summarizer (Frontend Only)</h1>
      <FileUpload onJsonParsed={handleJsonParsed} />

      {data ? (
        <CodeLookup data={data} />
      ) : (
        <p>No data uploaded yet</p>
      )}
    </div>
  );
}

export default App;