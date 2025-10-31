"use client";

interface AnalysisResultsProps {
  analysis: string;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const sections = parseAnalysis(analysis);

  return (
    <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <span>📊</span>
        Analysis Results
      </h2>

      <div className="prose prose-invert max-w-none">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            {section.title && (
              <h3 className="text-xl font-semibold text-purple-300 mb-3">
                {section.title}
              </h3>
            )}
            <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-purple-500/20 border border-purple-400 rounded-lg">
        <p className="text-purple-200 text-sm">
          💡 <strong>Tip:</strong> Practice the suggested improvements and upload
          another video to track your progress!
        </p>
      </div>
    </div>
  );
}

function parseAnalysis(analysis: string): Array<{ title?: string; content: string }> {
  const lines = analysis.split('\n');
  const sections: Array<{ title?: string; content: string }> = [];
  let currentSection: { title?: string; content: string } = { content: '' };

  for (const line of lines) {
    // Check if line is a header (starts with ## or ###)
    if (line.match(/^#{2,3}\s+/)) {
      if (currentSection.content.trim()) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/^#{2,3}\s+/, ''),
        content: '',
      };
    } else {
      currentSection.content += line + '\n';
    }
  }

  if (currentSection.content.trim() || currentSection.title) {
    sections.push(currentSection);
  }

  return sections.length > 0 ? sections : [{ content: analysis }];
}
