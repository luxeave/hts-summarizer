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
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async (codeValue: string, descriptionLines: string[]) => {
    try {
      // Create a short, descriptive prompt
      const promptText = `
Rewrite the following HTS code and descriptions into a single human-friendly summary:

Code: ${codeValue}
Descriptions:
${descriptionLines.join('\n')}

Output:
      `.trim();

      // Example fetch call to your Ollama server
      const response = await fetch(`${process.env.REACT_APP_OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.REACT_APP_OLLAMA_MODEL || 'phi4',
          prompt: promptText,
          stream: false,
        }),
      });

      const data = await response.json();
      // The response from Ollama is typically under `data.response`
      if (data && data.response) {
        setSummary(data.response);
      } else {
        setSummary('No summary returned from the model.');
      }
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      setSummary('Error generating summary.');
    }
  };

  const handleLookup = async () => {
    try {
      setSummary(''); // reset any previous summary
      setIsLoading(true); // Start loading
      if (!code) {
        setLookupResult('Please enter a code.');
        setIsLoading(false); // Stop loading
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
      let startIndex = 0;

      // 3) For each incremental code, find it in the data, then collect subsequent blanks
      for (const subCode of incrementalCodes) {
        let foundIndex = data.slice(startIndex).findIndex(item => item.htsno === subCode);

        if (foundIndex !== -1) {
          // Adjust 'foundIndex' to be relative to the overall data
          foundIndex += startIndex;
          matchedIndexes.push(foundIndex);

          let next = foundIndex + 1;
          while (next < data.length && data[next].htsno === '') {
            matchedIndexes.push(next);
            next++;
          }
          startIndex = next;
        }
        // If not found, move on
      }

      if (matchedIndexes.length === 0) {
        setLookupResult('No matching code(s) found in the data.');
        setIsLoading(false); // Stop loading
        return;
      }

      // e.g. Gather descriptions
      const descriptions = matchedIndexes.map(i => data[i].description);

      // Combine (just for display before summarization)
      const resultText = descriptions.join('\n');
      setLookupResult(resultText);

      // 4) Call Ollama to transform these lines into a single summary
      await generateSummary(code, descriptions);
    } catch (error) {
      console.error('Error during lookup:', error);
      setLookupResult('An error occurred during lookup.');
    } finally {
      setIsLoading(false); // Stop loading regardless of success/failure
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

      <div style={{ marginTop: 16 }}>
        <h3>Raw Lookup Result</h3>
        <pre>{lookupResult || '[No lookup result yet]'}</pre>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>Summary from Ollama</h3>
        <div className="summary-container">
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <img src={require('../assets/loading-spinner.gif')} alt="Loading..." className="loading-spinner" />
            </div>
          ) : (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {summary || '[No summary generated yet]'}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeLookup;