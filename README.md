# Martial Arts Form Analyzer

An AI-powered web application that analyzes martial arts form videos and provides detailed feedback using Google Gemini.

## Features

- 🎥 Drag-and-drop video upload
- 🤖 AI-powered analysis using Google Gemini 1.5 Pro
- 📊 Comprehensive feedback on technique, stance, and form
- ✨ Beautiful, responsive UI with Tailwind CSS
- ⚡ Built with Next.js 15 and TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google API key with access to Gemini API

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

   Then add your Google API key:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

   Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Click "Browse Files" or drag and drop a video of your martial arts form
2. Preview your video to ensure it uploaded correctly
3. Click "Analyze Form" to get AI-powered feedback
4. Review the detailed analysis covering:
   - Technique assessment
   - Strengths
   - Areas for improvement
   - Overall rating and recommendations

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini 1.5 Pro
- **Deployment:** Vercel (recommended)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your `GOOGLE_API_KEY` environment variable in project settings
4. Deploy!

## File Size Limits

- Maximum video file size: 100MB
- Supported formats: MP4, MOV, AVI, WebM

## Tips for Best Results

- Use good lighting in your video
- Ensure the full body is visible in the frame
- Record from a stable position (tripod recommended)
- Perform the form at normal speed
- Keep videos under 2 minutes for faster analysis

## License

MIT
