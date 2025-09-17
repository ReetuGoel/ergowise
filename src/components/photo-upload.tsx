import React, { useState } from 'react';

interface PhotoUploadProps {
  onUpload?: (files: File[]) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(e.target.files || []);
    if (files.length > 5) {
      files = files.slice(0, 5);
      alert('You can upload a maximum of 5 photos at once.');
    }
    setSelectedFiles(files);
  };

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    if (onUpload) onUpload(selectedFiles);
    setIsUploading(false);
  };

  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'var(--color-surface)', boxShadow: 'var(--shadow-md)' }}>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ marginBottom: 12 }}
      />
      <button
        onClick={handleAnalyze}
        disabled={selectedFiles.length === 0 || isUploading}
        style={{
          marginTop: 8,
          padding: '10px 24px',
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 16,
          cursor: selectedFiles.length === 0 || isUploading ? 'not-allowed' : 'pointer',
          opacity: selectedFiles.length === 0 || isUploading ? 0.6 : 1,
          transition: 'all 0.2s'
        }}
      >
        {isUploading ? 'Analyzing...' : 'Analyze'}
      </button>
      <div style={{ marginTop: 12, fontSize: 14, color: 'var(--color-text-soft)' }}>
        You can upload up to 5 photos at a time.
      </div>
    </div>
  );
};
