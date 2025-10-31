'use client';

import { useCallback, useState } from 'react';

interface VideoUploadProps {
  onUpload: (file: File) => void;
  analyzing: boolean;
}

export default function VideoUpload({ onUpload, analyzing }: VideoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a video file');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
  };

  const loadSampleVideo = async () => {
    try {
      const response = await fetch('/samples/sample-form.mov');
      const blob = await response.blob();
      const file = new File([blob], 'sample-form.mov', {
        type: 'video/quicktime',
      });
      handleFile(file);
    } catch (error) {
      alert('Failed to load sample video');
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-2xl border-2 border-gray-200">
      {!selectedFile ? (
        <>
          <div
            className={`border-3 border-dashed rounded-lg p-12 text-center transition-all ${
              dragActive
                ? 'border-yellow-600 bg-yellow-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              onChange={handleChange}
              className="hidden"
              disabled={analyzing}
            />
            <label htmlFor="video-upload" className="cursor-pointer">
              <div className="text-6xl mb-4">🥋</div>
              <p className="text-xl text-black mb-2 font-semibold">
                Drag and drop your video here
              </p>
              <p className="text-gray-500 mb-4">or</p>
              <button
                type="button"
                className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors shadow-md"
                onClick={() => document.getElementById('video-upload')?.click()}
              >
                Browse Files
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: MP4, MOV, AVI, WebM
              </p>
            </label>
          </div>

          {/* Sample Video Button */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={loadSampleVideo}
              className="px-6 py-2 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 text-black rounded-lg font-semibold transition-all duration-300 border-2 border-yellow-600 shadow-md hover:shadow-lg hover:scale-105"
            >
              🎬 Try Sample Video
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Don&apos;t have a video? Try a sample form video.
            </p>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg overflow-hidden bg-black">
            <video
              src={preview || undefined}
              controls
              className="w-full max-h-96 object-contain"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-black font-semibold mb-1">{selectedFile.name}</p>
            <p className="text-gray-600 text-sm">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex-1 px-6 py-4 bg-black hover:bg-gray-800 text-white rounded-lg font-bold text-lg transition-all disabled:cursor-not-allowed shadow-lg border-2 border-yellow-600"
            >
              {analyzing ? (
                <div className="sparring-container">
                  <span className="fighter fighter-left">🥋</span>
                  <span className="impact" style={{ fontSize: '16px' }}>
                    💥
                  </span>
                  <span className="fighter fighter-right">🥋</span>
                </div>
              ) : (
                'Analyze Form'
              )}
            </button>
            <button
              onClick={handleReset}
              disabled={analyzing}
              className="px-6 py-4 bg-white hover:bg-gray-100 text-black rounded-lg font-semibold transition-colors disabled:cursor-not-allowed border-2 border-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
