import './index.css';
import React, { useState, useEffect, useRef } from 'react';
import PostureCapture from './PostureCapture';

import { CheckCircle, Monitor, Armchair, Keyboard, Lightbulb, ChevronRight, ChevronLeft } from 'lucide-react';

const BREAK_DURATION = 5 * 60;

export function BreakTimer({ startTrigger }: { startTrigger?: number }) {
  const [secondsLeft, setSecondsLeft] = useState(BREAK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startBreak = () => {
    setIsRunning(true);
    timerRef.current = window.setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          setIsRunning(false);
          return BREAK_DURATION;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start break when parent signals via startTrigger (incrementing number)
  // Only start when startTrigger actually changes after mount.
  // We skip the first render to avoid auto-starting when the Break Timer tab is selected
  const startTriggerMounted = useRef(false);
  useEffect(() => {
    if (!startTriggerMounted.current) {
      startTriggerMounted.current = true;
      return;
    }
    if (startTrigger !== undefined) {
      if (!isRunning) startBreak();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTrigger]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const stopBreak = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setIsRunning(false);
    setSecondsLeft(BREAK_DURATION);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '2px solid var(--color-surface-alt2)',
      borderRadius: 16,
      padding: '2rem',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(234,88,12,0.12)',
      maxWidth: 320,
      margin: '2rem auto'
    }}>
      <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem', fontWeight: 700 }}>Take a Break!</h2>
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      {!isRunning ? (
        <button style={{
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '0.7rem 2rem',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: 600,
          boxShadow: '0 1px 4px rgba(234,88,12,0.3)'
        }} onClick={startBreak}>Start Break</button>
      ) : (
        <button style={{
          background: 'var(--color-secondary)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '0.7rem 2rem',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: 600,
          boxShadow: '0 1px 4px rgba(194,65,12,0.3)'
        }} onClick={stopBreak}>Stop Break</button>
      )}
      <p style={{ marginTop: '1.5rem', color: 'var(--color-text)' }}>Regular breaks help you stay healthy and focused!</p>
    </div>
  );
}



const assessmentQuestions = [
  { category: 'Desk Setup', icon: <Monitor size={32} color="var(--color-primary)" />, description: "Let's start with your desk and workspace positioning.", questions: [{ key: 'deskHeight', question: 'Is your desk height comfortable?', options: ['Yes', 'No'] }] },
  { category: 'Chair & Posture', icon: <Armchair size={32} color="var(--color-primary)" />, description: "Let's check your chair and posture.", questions: [{ key: 'chairSupport', question: 'Does your chair provide good back support?', options: ['Yes', 'No'] }] },
  { category: 'Keyboard & Mouse', icon: <Keyboard size={32} color="var(--color-primary)" />, description: "Let's review your keyboard and mouse setup.", questions: [{ key: 'keyboardPosition', question: 'Is your keyboard at a comfortable position?', options: ['Yes', 'No'] }] },
  { category: 'Lighting', icon: <Lightbulb size={32} color="var(--color-primary)" />, description: "Let's check your workspace lighting.", questions: [{ key: 'lighting', question: 'Is your workspace lighting adequate?', options: ['Yes', 'No'] }] }
];

export default function Assessment() {
  const [showResultsPage, setShowResultsPage] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'posture'>('questions');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const currentCategoryData = assessmentQuestions[currentCategory];
  const totalQuestions = assessmentQuestions.reduce((sum, cat) => sum + cat.questions.length, 0);
  const answeredQuestions = Object.keys(formData).length;
  const progress = Math.round((answeredQuestions / totalQuestions) * 100);

  const handleInputChange = (key: string, value: string) => setFormData({ ...formData, [key]: value });

  const canProceed = currentCategoryData.questions.every(q => formData[q.key]);
  const isLastCategory = currentCategory === assessmentQuestions.length - 1;


  return (
    <React.Fragment>
  <div style={{ maxWidth: 800, margin: '0 auto', background: 'var(--color-surface-alt)', borderRadius: 24, boxShadow: '0 8px 32px rgba(234,88,12,0.12)', padding: '32px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>Ergonomic Assessment</h2>
          {/* Wellness message removed for cleaner UI */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => setActiveTab('questions')}
              style={{
                background: activeTab === 'questions' ? 'var(--color-primary)' : 'var(--color-surface)',
                color: activeTab === 'questions' ? '#fff' : 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
                borderRadius: 8,
                padding: '10px 24px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >Questions</button>
            <button
              onClick={() => setActiveTab('posture')}
              style={{
                background: activeTab === 'posture' ? 'var(--color-primary)' : 'var(--color-surface)',
                color: activeTab === 'posture' ? '#fff' : 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
                borderRadius: 8,
                padding: '10px 24px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >Posture Capture</button>
          </div>
        </div>
        {activeTab === 'questions' && (
          <React.Fragment>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 16, textAlign: 'center' }}>Part 1: Ergonomic Questions</h3>
            {!showAnalysis ? (
              <React.Fragment>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, justifyContent: 'center' }}>
                  <div style={{ background: 'var(--color-surface-alt2)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center' }}>
                    {currentCategoryData.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 20, color: 'var(--color-primary)' }}>{currentCategoryData.category}</div>
                    <div style={{ fontSize: 15, color: 'var(--color-text-soft)', marginTop: 4 }}>{currentCategoryData.description}</div>
                  </div>
                </div>
                {currentCategoryData.questions.map((question, questionIndex) => (
                  <div key={question.key} style={{ marginBottom: 24, padding: 20, background: 'var(--color-surface)', borderRadius: 16, boxShadow: '0 2px 8px rgba(234,88,12,0.18)' }}>
                    <div style={{ fontWeight: 500, fontSize: 17, marginBottom: 12, color: 'var(--color-text)' }}>{questionIndex + 1}. {question.question}</div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      {question.options.map(option => (
                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 8, background: formData[question.key] === option ? 'var(--color-surface-alt2)' : 'var(--color-surface)', border: '2px solid var(--color-primary)', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 500, color: 'var(--color-text)', fontSize: 16, boxShadow: formData[question.key] === option ? '0 2px 8px rgba(234,88,12,0.18)' : undefined, transition: 'all 0.2s' }}>
                          <input type="radio" name={question.key} value={option} checked={formData[question.key] === option} onChange={() => handleInputChange(question.key, option)} style={{ accentColor: 'var(--color-primary)' }} />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
                  <button onClick={() => setCurrentCategory(prev => Math.max(0, prev - 1))} disabled={currentCategory === 0} style={{ padding: '12px 28px', background: 'var(--color-surface)', color: 'var(--color-text)', border: '2px solid var(--color-surface-alt2)', borderRadius: 8, fontWeight: 600, fontSize: 17, cursor: currentCategory === 0 ? 'not-allowed' : 'pointer', opacity: currentCategory === 0 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ChevronLeft size={20} /> Previous
                  </button>
                  <button onClick={() => setCurrentCategory(prev => prev + 1)} disabled={!canProceed || isLastCategory} style={{ padding: '12px 28px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 17, cursor: !canProceed || isLastCategory ? 'not-allowed' : 'pointer', opacity: !canProceed || isLastCategory ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    Next Category <ChevronRight size={20} />
                  </button>
                  {isLastCategory && (
                    <button onClick={() => setShowAnalysis(true)} disabled={!canProceed} style={{ padding: '12px 28px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 17, cursor: !canProceed ? 'not-allowed' : 'pointer', opacity: !canProceed ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                      Show Analysis Result <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              </React.Fragment>
            ) : (
              <div style={{ background: 'var(--color-surface)', borderRadius: 16, padding: 32, boxShadow: '0 2px 8px rgba(234,88,12,0.10)', textAlign: 'center', marginBottom: 24 }}>
                <h4 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 12 }}>Analysis Result</h4>
                <p style={{ fontSize: 16, color: 'var(--color-text-soft)' }}>Your ergonomic assessment is complete. Here are your results and recommendations:</p>
                {/* You can add more detailed results or recommendations here */}
                <div style={{ marginTop: 16 }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-accent)', fontSize: 18 }}>Score: {progress}%</span>
                  <ul style={{ marginTop: 12, textAlign: 'left', display: 'inline-block' }}>
                    <li>Maintain good posture and back support.</li>
                    <li>Adjust your desk and chair for comfort.</li>
                    <li>Ensure proper lighting in your workspace.</li>
                    <li>Take regular breaks to avoid strain.</li>
                  </ul>
                </div>
                <button onClick={() => setActiveTab('posture')} style={{ marginTop: 24, padding: '12px 28px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Proceed to Part 2: Posture Capture <ChevronRight size={20} />
                </button>
              </div>
            )}
          </React.Fragment>
        )}
        {activeTab === 'posture' && (
          <React.Fragment>
            {showResultsPage ? (
              <div style={{ background: 'var(--color-surface)', borderRadius: 16, padding: 48, boxShadow: '0 2px 8px rgba(234,88,12,0.10)', textAlign: 'center', margin: '48px auto', maxWidth: 700 }}>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 18 }}>Assessment Results</h2>
                <p style={{ fontSize: 18, color: 'var(--color-text-soft)', marginBottom: 24 }}>Your posture assessment is complete. Here are your results and recommendations:</p>
                <div style={{ marginTop: 16 }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-accent)', fontSize: 22 }}>Score: {progress}%</span>
                  <ul style={{ marginTop: 18, textAlign: 'left', display: 'inline-block', fontSize: 17 }}>
                    <li>Maintain good posture and back support.</li>
                    <li>Adjust your desk and chair for comfort.</li>
                    <li>Ensure proper lighting in your workspace.</li>
                    <li>Take regular breaks to avoid strain.</li>
                  </ul>
                </div>
                <button onClick={() => setShowResultsPage(false)} style={{ marginTop: 32, padding: '12px 28px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Back to Assessment
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: 24, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}>
                {/* Tips for capturing posture (now at the top) */}
                <div style={{ marginBottom: 24, background: 'var(--color-surface)', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(234,88,12,0.10)' }}>
                  <h4 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 8 }}>Tips for Capturing Posture</h4>
                  <ul style={{ fontSize: 15, color: 'var(--color-text-soft)', marginLeft: 16 }}>
                    <li>Stand straight and face the camera.</li>
                    <li>Ensure good lighting and a clear background.</li>
                    <li>Capture side and front views for best results.</li>
                    <li>Wear comfortable clothing that shows your posture.</li>
                  </ul>
                </div>
                <PostureCapture />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                  <button onClick={() => setActiveTab('questions')} style={{ padding: '12px 28px', background: 'var(--color-surface)', color: 'var(--color-text)', border: '2px solid var(--color-surface-alt2)', borderRadius: 8, fontWeight: 600, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ChevronLeft size={20} /> Back to Questions
                  </button>
                  <button onClick={() => setShowResultsPage(true)} style={{ padding: '12px 28px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    Complete Assessment <CheckCircle size={20} />
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

