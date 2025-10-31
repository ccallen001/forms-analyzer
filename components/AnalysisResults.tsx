"use client";

interface AnalysisResultsProps {
  analysis: string;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const sections = parseAnalysis(analysis);

  return (
    <div className="mt-8 bg-white rounded-xl p-8 shadow-2xl border-2 border-gray-200">
      <div className="border-b-2 border-yellow-600 pb-4 mb-6">
        <h2 className="text-3xl font-bold text-black flex items-center gap-3">
          <span>📊</span>
          Analysis Results
        </h2>
      </div>

      <div className="prose prose-zinc max-w-none">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            {section.title && (
              <h3 className="text-xl font-semibold text-black mb-3 border-l-4 border-yellow-600 pl-3">
                {section.title}
              </h3>
            )}
            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-600 rounded-lg">
        <p className="text-gray-900 text-sm">
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
