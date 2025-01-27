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
            setSummary('');
            setIsLoading(true);

            if (!code) {
                setLookupResult('Please enter a code.');
                setIsLoading(false);
                return;
            }

            // --- 1) Sub-code lookup ---
            const parts = code.split('.').filter(Boolean);
            const incrementalCodes: string[] = [];
            let accum = parts[0];
            incrementalCodes.push(accum);
            for (let i = 1; i < parts.length; i++) {
                accum = accum + '.' + parts[i];
                incrementalCodes.push(accum);
            }

            // We'll gather the indexes of matched rows
            const matchedIndexes: number[] = [];
            let startIndex = 0;

            for (const subCode of incrementalCodes) {
                let foundIndex = data.slice(startIndex).findIndex(item => item.htsno === subCode);
                if (foundIndex !== -1) {
                    // Adjust foundIndex to be absolute index
                    foundIndex += startIndex;
                    matchedIndexes.push(foundIndex);

                    // Also grab subsequent blank lines
                    let next = foundIndex + 1;
                    while (next < data.length && data[next].htsno === '') {
                        matchedIndexes.push(next);
                        next++;
                    }
                    startIndex = next;
                }
            }

            // --- 2) Naive lookup ---
            // Always check if the code exists exactly, and if so, include it if it’s not already in matchedIndexes
            const naiveIndex = data.findIndex(item => item.htsno === code);
            if (naiveIndex !== -1 && !matchedIndexes.includes(naiveIndex)) {
                matchedIndexes.push(naiveIndex);

                // Optionally also grab subsequent blank lines, if consistent with your approach
                let next = naiveIndex + 1;
                while (next < data.length && data[next].htsno === '') {
                    matchedIndexes.push(next);
                    next++;
                }
            }

            // --- 3) Combine results ---
            if (matchedIndexes.length === 0) {
                setLookupResult('No matching code(s) found in the data.');
                return;
            }

            // Build the combined text from all matched rows
            const descriptions = matchedIndexes.map(i => data[i].description);
            const resultText = descriptions.join('\n');
            setLookupResult(resultText);

            // 4) Call Ollama to transform these lines into a single summary
            await generateSummary(code, descriptions);

        } catch (error) {
            console.error('Error during lookup:', error);
            setLookupResult('An error occurred during lookup.');
        } finally {
            setIsLoading(false);
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