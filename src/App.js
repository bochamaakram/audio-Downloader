import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp3');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  const handleDownload = async () => {
    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDownloadLink(null);

    try {
      // Validate YouTube URL
      if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        throw new Error('Please enter a valid YouTube URL');
      }

      // Using a free API service (note: these services may have limits)
      const apiUrl = `https://youtube-mp36.p.rapidapi.com/dl?id=${extractVideoId(url)}`;
      
      const response = await axios.get(apiUrl, {
        headers: {
          'X-RapidAPI-Key': '6361936dd3msh89284aadb7f2091p171595jsnf0b9a24185a0',
          'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        }
      });

      if (response.data.status === 'ok') {
        setDownloadLink(response.data.link);
      } else {
        throw new Error(response.data.msg || 'Failed to process video');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const extractVideoId = (url) => {
    // Extract YouTube video ID from URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="app">
      <h1>YouTube audio Downloader</h1>
      <div className="container">
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube URL"
          />
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="mp3">MP3 (Audio)</option>
          </select>
          <button onClick={handleDownload} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Download'}
          </button>
        </div>
        
        {error && <div className="message error">{error}</div>}
        
        {downloadLink && (
          <div className="message success">
            <p>Download ready!</p>
            <a 
              href={downloadLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-button"
            >
              Download {format.toUpperCase()}
            </a>
          </div>
        )}
        
        <div className="info">
          <h3>How to use:</h3>
          <ol>
            <li>Paste a YouTube video URL above</li>
            <li>Select MP3 (audio only)</li>
            <li>Click Download</li>
          </ol>
          <p className="disclaimer">
            Note: This uses a free API service with limitations. For personal use only.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;