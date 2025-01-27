# HTS React Application

This React application helps you analyze and process Harmonized Tariff Schedule (HTS) data from the USITC database.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Ollama (for AI-powered analysis)

**Note**: This application has only been tested with Ollama as the AI backend. Other LLM servers or providers are not currently supported.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hts-react.git
cd hts-react
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```
REACT_APP_OLLAMA_BASE_URL=http://localhost:11434
REACT_APP_OLLAMA_MODEL=phi4
PORT=3000  # Optional: Change this to run the app on a different port
```

### 4. Prepare HTS Data

1. Visit [https://hts.usitc.gov/search?query=8501](https://hts.usitc.gov/search?query=8501)
2. Export the search results as a JSON file
   - **Important**: Currently, only JSON format is supported. CSV and Excel formats are not supported.
3. Keep the exported JSON file ready for upload in the application

### 5. Run the Application

For development:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

For production build:
```bash
npm run build
```

## Usage

1. Launch the application
2. Upload your exported HTS JSON file using the file upload interface
3. Use the application features to analyze and process the HTS data
4. The AI-powered analysis will help you understand and categorize the HTS codes

## Deployment

To deploy the application:

1. Create a production build:
```bash
npm run build
```

2. The `build` folder will contain optimized static files ready for deployment
3. Deploy the contents of the `build` folder to your preferred hosting service (e.g., Netlify, Vercel, AWS S3)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
