"use client";

import { useState } from "react";
import VideoUpload from "@/components/VideoUpload";
import AnalysisResults from "@/components/AnalysisResults";

export default function Home() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractFrames = async (file: File, numFrames: number = 4): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const frames: string[] = [];

      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        // Limit resolution to reduce payload size
        const maxWidth = 800;
        const scale = Math.min(1, maxWidth / video.videoWidth);
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;

        const duration = video.duration;
        const interval = duration / numFrames;
        let currentFrame = 0;

        video.onseeked = () => {
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // Use lower quality to reduce payload size
            const base64 = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
            frames.push(base64);
          }

          currentFrame++;
          if (currentFrame < numFrames) {
            video.currentTime = Math.min(interval * currentFrame, duration - 0.1);
          } else {
            URL.revokeObjectURL(video.src);
            resolve(frames);
          }
        };

        video.onerror = () => {
          URL.revokeObjectURL(video.src);
          reject(new Error('Failed to load video'));
        };

        video.currentTime = 0;
      };
    });
  };

  const handleVideoUpload = async (file: File) => {
    setAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      // Extract frames from video
      const frames = await extractFrames(file);

      console.log(`Extracted ${frames.length} frames`);
      console.log(`Payload size: ~${JSON.stringify(frames).length / 1024 / 1024} MB`);

      // Send frames to API
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frames }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details || data.error || "Analysis failed";
        throw new Error(errorMsg);
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Martial Arts Form Analyzer
          </h1>
          <p className="text-xl text-gray-300">
            Upload a video of your form and get AI-powered feedback
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <VideoUpload
            onUpload={handleVideoUpload}
            analyzing={analyzing}
          />

          {error && (
            <div className="mt-8 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {analysis && (
            <AnalysisResults analysis={analysis} />
          )}
        </div>
      </div>
    </div>
  );
}
