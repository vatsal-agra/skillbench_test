import React from 'react';
import { FiX, FiDownload } from 'react-icons/fi';

interface ScoreData {
  score: number;
  total: number;
  byDifficulty: {
    easy: { correct: number; total: number; marks: number };
    medium: { correct: number; total: number; marks: number };
    hard: { correct: number; total: number; marks: number };
  };
}

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scoreData: ScoreData | null;
  courseName?: string;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ isOpen, onClose, scoreData, courseName = 'Power BI' }) => {
  if (!isOpen || !scoreData) return null;

  const percentage = (scoreData.score / scoreData.total) * 100;
  const passed = percentage >= 80;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900">Test Results</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="text-center">
          <div className="text-5xl font-bold text-primary-600 my-6">
            {scoreData.score} / {scoreData.total}
          </div>
          <div className="text-2xl font-semibold text-gray-700 mb-6">
            {Math.round(percentage)}%
            {passed ? (
              <div className="text-green-600 text-sm mt-2">
                Congratulations! You passed the test!
              </div>
            ) : (
              <div className="text-red-600 text-sm mt-2">
                You need 80% to pass. Please try again!
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(scoreData.byDifficulty).map(([difficulty, data]) => (
            <div 
              key={difficulty}
              className={`p-4 rounded-lg ${
                difficulty === 'easy' ? 'bg-green-50' :
                difficulty === 'medium' ? 'bg-yellow-50' : 'bg-red-50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium capitalize">{difficulty} Questions</span>
                <span className="text-sm text-gray-600">
                  {data.correct}/{data.total} correct
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    difficulty === 'easy' ? 'bg-green-500' :
                    difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: data.total > 0 ? `${(data.correct / data.total) * 100}%` : '0%' }}
                />
              </div>
              <div className="text-right text-sm text-gray-600 mt-1">
                {data.marks} marks each
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-3">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            Back to Course
          </button>
          
          {passed ? (
            <button
              onClick={() => {
                // Generate a simple certificate
                const certificateContent = `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Certificate of Completion</title>
                    <style>
                      body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
                      .certificate { border: 15px solid #4F46E5; padding: 40px; max-width: 800px; margin: 0 auto; }
                      h1 { color: #4F46E5; margin-bottom: 30px; }
                      .student-name { font-size: 28px; font-weight: bold; margin: 20px 0; }
                      .course-name { font-size: 24px; margin: 20px 0; }
                      .score { font-size: 20px; margin: 15px 0; }
                      .date { margin-top: 30px; }
                      .signature { margin-top: 50px; }
                    </style>
                  </head>
                  <body>
                    <div class="certificate">
                      <h1>CERTIFICATE OF COMPLETION</h1>
                      <div>This is to certify that</div>
                      <div class="student-name">[Student Name]</div>
                      <div>has successfully completed the course</div>
                      <div class="course-name">${courseName}</div>
                      <div>with a score of</div>
                      <div class="score">${scoreData?.score} out of ${scoreData?.total} (${Math.round(percentage)}%)</div>
                      <div class="date">Date: ${new Date().toLocaleDateString()}</div>
                      <div class="signature">
                        <div>________________________</div>
                        <div>Instructor/Signature</div>
                      </div>
                    </div>
                  </body>
                  </html>
                `;
                
                // Create a blob and download link
                const blob = new Blob([certificateContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Certificate_${courseName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <FiDownload /> Generate Certificate
            </button>
          ) : (
            <div className="text-center text-red-600 text-sm py-2">
              You need to score 80% or higher to generate a certificate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;
