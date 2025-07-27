import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiClock, FiFlag } from 'react-icons/fi';
import ResultsModal from '../components/ResultsModal';
import { supabase } from '../lib/supabase';

// Types
type Difficulty = 'easy' | 'medium' | 'hard';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex?: number;
  difficulty: Difficulty;
}

const MARKS = {
  easy: 1,
  medium: 2,
  hard: 4
} as const;

// utility to evaluate score
const calculateScore = (
  qs: Question[],
  ans: Record<number, number | null>
): { 
  score: number; 
  total: number;
  byDifficulty: {
    easy: { correct: number; total: number; marks: number };
    medium: { correct: number; total: number; marks: number };
    hard: { correct: number; total: number; marks: number };
  };
} => {
  const result = {
    score: 0,
    total: 0,
    byDifficulty: {
      easy: { correct: 0, total: 0, marks: 0 },
      medium: { correct: 0, total: 0, marks: 0 },
      hard: { correct: 0, total: 0, marks: 0 },
    }
  };

  qs.forEach((q) => {
    const isCorrect = q.correctIndex !== undefined && ans[q.id] === q.correctIndex;
    const marks = isCorrect ? MARKS[q.difficulty] : 0;
    
    result.total += MARKS[q.difficulty];
    result.byDifficulty[q.difficulty].total += 1;
    
    if (isCorrect) {
      result.score += marks;
      result.byDifficulty[q.difficulty].correct += 1;
      result.byDifficulty[q.difficulty].marks += marks;
    }
  });

  return result;
};

// Test duration in minutes
const TEST_DURATION_MIN = 30;

// Power BI questions with difficulty levels
const questions: Question[] = [
  // Easy questions (1 point each) - 20 questions
  {
    id: 1,
    text: 'What is the primary purpose of Power BI?',
    options: [
      'Train machine learning models', 
      'Visualize interactive business intelligence reports and dashboards', 
      'Edit videos', 
      'Process payroll'
    ],
    correctIndex: 1,
    difficulty: 'easy' as const,
  },
  {
    id: 2,
    text: 'Which company develops Power BI?',
    options: ['Oracle', 'IBM', 'Microsoft', 'SAP'],
    correctIndex: 2,
    difficulty: 'easy' as const,
  },
  {
    id: 3,
    text: 'What is the default file format for saving a Power BI report?',
    options: ['.csv', '.pbit', '.pbix', '.xlsx'],
    correctIndex: 2,
    difficulty: 'easy' as const,
  },
  {
    id: 4,
    text: 'Which component is used to build reports in Power BI?',
    options: ['Power Query', 'Power BI Desktop', 'Power Map', 'Power Apps'],
    correctIndex: 1,
    difficulty: 'easy' as const,
  },
  {
    id: 5,
    text: 'Which visual is best for displaying geographical data?',
    options: ['Bar Chart', 'Card', 'Map Visual', 'Line Chart'],
    correctIndex: 2,
    difficulty: 'easy' as const,
  },
  {
    id: 6,
    text: 'What is the main purpose of Power Query in Power BI?',
    options: [
      'Creating visualizations',
      'Data transformation and preparation',
      'Writing DAX measures',
      'Managing user roles'
    ],
    correctIndex: 1,
    difficulty: 'easy' as const,
  },
  {
    id: 7,
    text: 'Which of these is NOT a type of visualization in Power BI?',
    options: ['Pie Chart', 'Table', 'Matrix', 'Power Table'],
    correctIndex: 3,
    difficulty: 'easy' as const,
  },
  {
    id: 8,
    text: 'What does DAX stand for in Power BI?',
    options: [
      'Data Analysis Expressions',
      'Data Access XML',
      'Database Analysis Extensions',
      'Data Analytics Exchange'
    ],
    correctIndex: 0,
    difficulty: 'easy' as const,
  },
  {
    id: 9,
    text: 'Which view in Power BI Desktop is used to create relationships between tables?',
    options: ['Report View', 'Data View', 'Model View', 'Relationship View'],
    correctIndex: 2,
    difficulty: 'easy' as const,
  },
  {
    id: 10,
    text: 'What is the maximum number of data points that can be displayed in a single Power BI visual?',
    options: ['10,000', '30,000', '50,000', 'Unlimited'],
    correctIndex: 1,
    difficulty: 'easy' as const,
  },
  {
    id: 11,
    text: 'Which of these is NOT a Power BI cloud service?',
    options: ['Power BI Service', 'Power BI Mobile', 'Power BI Report Server', 'Power BI Gateway'],
    correctIndex: 3,
    difficulty: 'easy' as const,
  },
  {
    id: 12,
    text: 'What is the purpose of bookmarks in Power BI?',
    options: [
      'To save the current state of a report page',
      'To mark important data points',
      'To create table of contents',
      'To save report URLs'
    ],
    correctIndex: 0,
    difficulty: 'easy' as const,
  },
  {
    id: 13,
    text: 'Which of these is NOT a valid data source in Power BI?',
    options: ['Excel', 'SQL Server', 'PDF', 'Web'],
    correctIndex: 2,
    difficulty: 'easy' as const,
  },
  {
    id: 14,
    text: 'What is the purpose of the Q&A visual in Power BI?',
    options: [
      'To answer questions about the data in natural language',
      'To display frequently asked questions',
      'To create a knowledge base',
      'To provide help documentation'
    ],
    correctIndex: 0,
    difficulty: 'easy' as const,
  },
  {
    id: 15,
    text: 'Which of these is NOT a type of filter in Power BI?',
    options: ['Visual level', 'Page level', 'Report level', 'Database level'],
    correctIndex: 3,
    difficulty: 'easy' as const,
  },
  {
    id: 16,
    text: 'What is the purpose of the "Enter Data" feature in Power BI?',
    options: [
      'To manually input small datasets',
      'To import data from files',
      'To enter credentials',
      'To type DAX formulas'
    ],
    correctIndex: 0,
    difficulty: 'easy' as const,
  },
  {
    id: 17,
    text: 'Which of these is NOT a valid way to share a Power BI report?',
    options: ['Publish to web', 'Share to Teams', 'Export to PDF', 'Email as attachment'],
    correctIndex: 3,
    difficulty: 'easy' as const,
  },
  {
    id: 18,
    text: 'What is the purpose of the "Fields" pane in Power BI?',
    options: [
      'To display all available fields from the data model',
      'To show calculated fields only',
      'To list all tables in the database',
      'To display field properties'
    ],
    correctIndex: 0,
    difficulty: 'easy' as const,
  },
  {
    id: 19,
    text: 'Which of these is NOT a type of relationship in Power BI?',
    options: ['One-to-One', 'One-to-Many', 'Many-to-Many', 'Parent-Child'],
    correctIndex: 3,
    difficulty: 'easy' as const,
  },
  {
    id: 20,
    text: 'What is the purpose of the "Refresh" button in Power BI Desktop?',
    options: [
      'To update the visual display',
      'To reload the data from the source',
      'To clear all filters',
      'To restart the application'
    ],
    correctIndex: 1,
    difficulty: 'easy' as const,
  },

  // Medium difficulty questions (2 points each) - 20 questions
  {
    id: 21,
    text: 'What is the role of calculated columns in Power BI?',
    options: [
      'Visual formatting', 
      'Data transformation via formulas in data model', 
      'Data import from external sources', 
      'Restoring lost visuals'
    ],
    correctIndex: 1,
    difficulty: 'medium' as const,
  },
  {
    id: 22,
    text: 'Which DAX function can filter a table based on criteria?',
    options: ['CALCULATE()', 'FILTER()', 'IF()', 'MAX()'],
    correctIndex: 1,
    difficulty: 'medium' as const,
  },
  {
    id: 23,
    text: 'How can data model performance be improved?',
    options: [
      'Using wide tables with many columns',
      'Using star schema and avoiding unnecessary columns',
      'Using more visuals',
      'Duplication of tables'
    ],
    correctIndex: 1,
    difficulty: 'medium' as const,
  },
  {
    id: 24,
    text: 'What is the difference between a calculated column and a measure in Power BI?',
    options: [
      'Calculated columns are computed at refresh, measures at query time',
      'Measures are stored in the data model, calculated columns are not',
      'There is no difference',
      'Calculated columns can only be used in tables, measures in visuals'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 25,
    text: 'What is the purpose of the USERELATIONSHIP function in DAX?',
    options: [
      'To create a new relationship between tables',
      'To specify which relationship to use in a calculation',
      'To list all relationships in the model',
      'To validate existing relationships'
    ],
    correctIndex: 1,
    difficulty: 'medium' as const,
  },
  {
    id: 26,
    text: 'What is the difference between SUM and SUMX in DAX?',
    options: [
      'SUM is for columns, SUMX is for tables',
      'SUMX is faster than SUM',
      'SUM can only be used with numeric columns',
      'There is no difference'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 27,
    text: 'What is the purpose of the CALCULATE function in DAX?',
    options: [
      'To perform calculations on a table',
      'To modify filter context in a formula',
      'To create calculated tables',
      'To define relationships'
    ],
    correctIndex: 1,
    difficulty: 'medium' as const,
  },
  {
    id: 28,
    text: 'What is the difference between ALL and ALLEXCEPT in DAX?',
    options: [
      'ALL removes all filters, ALLEXCEPT removes all except specified columns',
      'ALLEXCEPT is deprecated, use ALL',
      'They are the same',
      'ALL works with tables, ALLEXCEPT with columns'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 29,
    text: 'What is the purpose of the SELECTEDVALUE function in DAX?',
    options: [
      'To return the value when there is only one value in the specified column',
      'To select a value from a dropdown',
      'To get the selected value from a slicer',
      'To validate user input'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 30,
    text: 'What is the difference between RELATED and LOOKUPVALUE in DAX?',
    options: [
      'RELATED works with existing relationships, LOOKUPVALUE does not require one',
      'LOOKUPVALUE is faster than RELATED',
      'They are the same',
      'RELATED is for calculated columns, LOOKUPVALUE for measures'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 31,
    text: 'What is the purpose of the VALUES function in DAX?',
    options: [
      'To return a one-column table of unique values',
      'To return all values including duplicates',
      'To validate data types',
      'To convert text to numbers'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 32,
    text: 'What is the difference between COUNT and COUNTROWS in DAX?',
    options: [
      'COUNT counts non-blank values in a column, COUNTROWS counts rows in a table',
      'They are the same',
      'COUNT is deprecated, use COUNTROWS',
      'COUNT works with text, COUNTROWS with numbers'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 33,
    text: 'What is the purpose of the SUMMARIZE function in DAX?',
    options: [
      'To create a summary table from the input table',
      'To calculate the sum of a column',
      'To filter a table',
      'To sort data'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 34,
    text: 'What is the difference between CALCULATE and CALCULATETABLE in DAX?',
    options: [
      'CALCULATE returns a scalar value, CALCULATETABLE returns a table',
      'They are the same',
      'CALCULATETABLE is deprecated, use CALCULATE',
      'CALCULATE works with measures, CALCULATETABLE with calculated columns'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 35,
    text: 'What is the purpose of the EARLIER function in DAX?',
    options: [
      'To reference an earlier row context',
      'To get data from a previous time period',
      'To sort data chronologically',
      'To reference a parent table'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 36,
    text: 'What is the difference between USERELATIONSHIP and CROSSFILTER in DAX?',
    options: [
      'USERELATIONSHIP activates an inactive relationship, CROSSFILTER changes filter direction',
      'They are the same',
      'CROSSFILTER is deprecated, use USERELATIONSHIP',
      'USERELATIONSHIP is for one-to-many, CROSSFILTER for many-to-many'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 37,
    text: 'What is the purpose of the GENERATE function in DAX?',
    options: [
      'To create a Cartesian product between two tables',
      'To generate a sequence of numbers',
      'To create a date table',
      'To generate random numbers'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 38,
    text: 'What is the difference between ADDCOLUMNS and SELECTCOLUMNS in DAX?',
    options: [
      'ADDCOLUMNS adds to existing columns, SELECTCOLUMNS creates a new table with specified columns',
      'They are the same',
      'SELECTCOLUMNS is deprecated, use ADDCOLUMNS',
      'ADDCOLUMNS is for calculated columns, SELECTCOLUMNS for measures'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 39,
    text: 'What is the purpose of the RANKX function in DAX?',
    options: [
      'To rank values in a column',
      'To create a running total',
      'To calculate percentages',
      'To filter top N values'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },
  {
    id: 40,
    text: 'What is the difference between TOPN and TOPNSKIP in DAX?',
    options: [
      'TOPN returns the top N rows, TOPNSKIP skips N rows first',
      'They are the same',
      'TOPNSKIP is deprecated, use TOPN',
      'TOPN works with numbers, TOPNSKIP with text'
    ],
    correctIndex: 0,
    difficulty: 'medium' as const,
  },

  // Hard difficulty questions (4 points each) - 10 questions
  {
    id: 41,
    text: 'A DAX measure needs to calculate a year-to-date sum, resetting at each year. Which DAX function is most suitable?',
    options: ['TOTALYTD()', 'SUMX()', 'FILTER()', 'EARLIER()'],
    correctIndex: 0,
    difficulty: 'hard' as const,
  },
  {
    id: 42,
    text: 'What is the difference between TREATAS() and LOOKUPVALUE() in DAX?',
    options: [
      'TREATAS creates a virtual relationship, LOOKUPVALUE returns a single value',
      'No difference, they are interchangeable',
      'TREATAS only works with dates, LOOKUPVALUE works with any data type',
      'LOOKUPVALUE is deprecated, use TREATAS instead'
    ],
    correctIndex: 0,
    difficulty: 'hard' as const,
  },
  {
    id: 43,
    text: 'How would you implement a dynamic measure that changes calculation based on user selection?',
    options: [
      'Use SWITCH() with a parameter table',
      'Create multiple measures and use SELECTEDVALUE() to choose between them',
      'Use calculation groups',
      'All of the above'
    ],
    correctIndex: 3,
    difficulty: 'hard' as const,
  },
  {
    id: 44,
    text: 'What is the most efficient way to implement a dynamic Top N filter in Power BI?',
    options: [
      'Use TOPN() in a measure with a parameter table',
      'Create a calculated table with the top N items',
      'Use a visual-level filter with Top N',
      'Use RANKX() in a calculated column'
    ],
    correctIndex: 0,
    difficulty: 'hard' as const,
  },
  {
    id: 45,
    text: 'How do you implement a many-to-many relationship in Power BI when the built-in relationship does not work?',
    options: [
      'Create a bridge table and use DAX measures with TREATAS()',
      'Use bidirectional cross-filtering',
      'Duplicate the fact table',
      'It\'s not possible to model many-to-many relationships in Power BI'
    ],
    correctIndex: 0,
    difficulty: 'hard' as const,
  },
  {
    id: 46,
    text: 'What is the correct way to implement dynamic security in Power BI?',
    options: [
      'Using USERNAME() and USERPRINCIPALNAME() with row-level security',
      'Creating separate reports for each user',
      'Using bookmarks to hide sensitive data',
      'Using conditional formatting based on user roles'
    ],
    correctIndex: 0,
    difficulty: 'hard' as const,
  },
  {
    id: 47,
    text: 'How do you optimize a slow-performing DAX measure that uses multiple nested iterators?',
    options: [
      'Use SUMMARIZE() to pre-aggregate data',
      'Replace nested iterators with CALCULATE() and FILTER()',
      'Use variables to store intermediate results',
      'All of the above'
    ],
    correctIndex: 3,
    difficulty: 'hard' as const,
  },
  {
    id: 48,
    text: 'What is the difference between EARLIER() and EARLIEST() in DAX?',
    options: [
      'EARLIER() references the previous row context, EARLIEST() is not a DAX function',
      'EARLIER() is for time intelligence, EARLIEST() is for text functions',
      'They are the same function with different names',
      'EARLIER() is deprecated, use EARLIEST() instead'
    ],
    correctIndex: 0,
    difficulty: 'hard' as const,
  },
  {
    id: 49,
    text: 'How do you implement a dynamic measure that shows different aggregations based on the visual context?',
    options: [
      'Use ISFILTERED() and HASONEVALUE() to detect the context',
      'Create multiple measures and use SWITCH() to select between them',
      'Use calculation groups',
      'All of the above'
    ],
    correctIndex: 3,
    difficulty: 'hard' as const,
  },
  {
    id: 50,
    text: 'What is the most efficient way to implement a dynamic date range selection in Power BI?',
    options: [
      'Use a date table with a disconnected slicer and DAX measures',
      'Create multiple measures for different date ranges',
      'Use relative date filtering',
      'Use a calculated column to flag dates in range'
    ],
    correctIndex: 0,
    difficulty: 'hard' as const,
  }
];

const CourseTestPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  // State management
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_MIN * 60);
  const [showResults, setShowResults] = useState(false);
  const [scoreData, setScoreData] = useState<ReturnType<typeof calculateScore> | null>(null);
  
  // Group questions by difficulty for the sidebar
  const questionsByDifficulty = questions.reduce((acc, q) => {
    if (!acc[q.difficulty]) {
      acc[q.difficulty] = [];
    }
    acc[q.difficulty].push(q);
    return acc;
  }, {} as Record<Difficulty, Question[]>);
  
  const currentQuestion = questions[current];

  // Initialize answers
  useEffect(() => {
    const initialAnswers = questions.reduce((acc, q) => {
      acc[q.id] = null;
      return acc;
    }, {} as Record<number, number | null>);
    setAnswers(initialAnswers);
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Helpers
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const selectOption = (optIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optIdx }));
  };

  const clearResponse = () => selectOption(-1);
  const next = () => setCurrent(prev => Math.min(prev + 1, questions.length - 1));
  const prev = () => setCurrent(prev => Math.max(prev - 1, 0));
  const jump = (index: number) => setCurrent(index);

  const handleSubmit = useCallback(async () => {
    const score = calculateScore(questions, answers);
    setScoreData(score);
    
    // Calculate if passed
    const percentage = score.score / score.total;
    const passed = percentage >= 0.8;
    
    // Save test attempt to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Award points if passed
        if (passed) {
          let pointsToAward = 1000; // Base points for passing
          
          // Bonus for high score (90% or above)
          if (percentage >= 0.9) {
            pointsToAward += 500;
          }
          
          // Call the database function to award points
          const { error: pointsError } = await supabase.rpc('award_points', {
            user_id_param: user.id,
            points_param: pointsToAward,
            achievement_type_param: 'test_completed',
            metadata_param: {
              course_id: courseId || '00000000-0000-0000-0000-000000000001',
              score: score.score,
              total: score.total,
              percentage: percentage * 100
            }
          });
          
          if (pointsError) {
            console.error('Error awarding points:', pointsError);
          }
        }
        
        const { error } = await supabase
          .from('test_attempts')
          .insert([
            { 
              user_id: user.id,
              course_id: courseId || '00000000-0000-0000-0000-000000000001',
              score: score.score,
              total_questions: questions.length,
              passed: passed
            }
          ]);
        
        if (error) {
          console.error('Error saving test attempt:', error);
        }
      }
    } catch (error) {
      console.error('Error saving test attempt:', error);
    }
    
    setShowResults(true);
  }, [answers, courseId]);

  const handleCloseResults = useCallback(() => {
    setShowResults(false);
    // Navigate to the courses page instead of the specific course
    navigate('/courses');
  }, [navigate]);

  if (!currentQuestion) return <div className="p-8 text-center">Loading questions…</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Results Modal */}
      {showResults && scoreData && (
        <ResultsModal 
          isOpen={showResults} 
          onClose={handleCloseResults} 
          scoreData={scoreData} 
        />
      )}
      
      {/* Question area */}
      <div className="flex-1 p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <FiChevronLeft className="mr-1" /> Back
          </button>
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FiClock /> <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question text */}
        <h2 className="font-semibold mb-4">
          Question {current + 1}. <span className="font-normal">{currentQuestion.text}</span>
        </h2>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((opt: string, idx: number) => (
            <label key={idx} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name={`q-${currentQuestion.id}`}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                checked={answers[currentQuestion.id] === idx}
                onChange={() => selectOption(idx)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4">
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={next}
            disabled={current === questions.length - 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={clearResponse}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Clear Response
          </button>
        </div>
      </div>

      {/* Fixed submit button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg md:right-64 transition-all">
        <div className="max-w-4xl mx-auto flex justify-end">
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to submit the test?')) {
                handleSubmit();
              }
            }}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Palette / sidebar */}
      <aside className="w-full md:w-64 border-t md:border-t-0 md:border-l bg-white p-4 md:p-6 overflow-y-auto">
        <h3 className="font-medium mb-4 flex items-center">
          <FiFlag className="mr-2" /> Questions Palette
        </h3>
        
        {Object.entries(questionsByDifficulty).map(([difficulty, qs]) => (
          <div key={difficulty} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium capitalize">{difficulty} ({qs.length} × {MARKS[difficulty as Difficulty]} marks)</h4>
              <span className="text-sm text-gray-500">
                {qs.filter(q => answers[q.id] !== undefined).length}/{qs.length}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-sm">
              {qs.map((q) => {
                const questionIndex = questions.findIndex(qq => qq.id === q.id);
                const isCurrent = current === questionIndex;
                const isAnswered = answers[q.id] !== undefined;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => jump(questionIndex)}
                    className={`h-8 w-8 rounded-full border text-center leading-8 transition-colors ${
                      isCurrent
                        ? 'bg-primary-600 text-white border-primary-600'
                        : isAnswered
                        ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                        : 'border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {questionIndex + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Total Marks:</span>
            <span className="text-sm font-semibold">100</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Time Left:</span>
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CourseTestPage;
