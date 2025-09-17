import './App.css';
import React, { useState } from 'react';
import { useAuth } from './auth-context';
import { useToast } from './toast-context';
import { useTheme } from './theme-context';
import { Card } from './ui/card';
import { Sidebar } from './sidebar';
import { WellnessScoreRadial, ErgonomicCategoriesChart, ProgressTrendChart, DailyActivityChart, WeeklyBreaksChart } from './charts';
import { AuthGateway } from './auth-gateway';
import Assessment, { BreakTimer } from './Assessment';
import { ErgoWiseLogo } from './logo';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const tabs = ['Dashboard', 'Assessment', 'Analytics', 'Recommendations', 'Break Timer'];
  const [breakStartTrigger, setBreakStartTrigger] = useState(0);
  let user: any = undefined;
  let logout: () => void = () => {};
      try {
        const auth = useAuth();
        user = auth?.user;
        logout = auth?.logout ?? (() => {});
      } catch (err) {
        user = undefined;
        logout = () => {};
      }
      let addToast = (_m: string, _t?: 'success' | 'error' | 'info' | 'warning', _d?: number) => {};
      try {
        const toast = useToast();
        const real = toast?.addToast as typeof addToast | undefined;
        if (real) addToast = real;
      } catch (err) {}
      let toggleTheme = () => {};
      let isDark = false;
      try {
        const theme = useTheme();
        toggleTheme = theme?.toggleTheme ?? toggleTheme;
        isDark = theme?.isDark ?? isDark;
      } catch (err) {}
      const handleLogout = () => {
        logout();
        addToast('You have been signed out successfully.', 'info');
      };
      const handleQuickAction = (action: string) => {
        if (action === 'assessment') {
          setActiveTab('Assessment');
          addToast('Starting your ergonomic assessment...', 'info');
        } else if (action === 'break') {
          setActiveTab('Break Timer');
          setBreakStartTrigger(prev => prev + 1);
          addToast('Time for a healthy break! Break timer started.', 'success');
        }
      };
      const handleThemeToggle = () => {
        toggleTheme();
        addToast(`Switched to ${isDark ? 'light' : 'dark'} mode`, 'info');
      };

      return (
        <div style={{
          minHeight: '100vh',
          background: 'var(--gradient-bg)',
          fontFamily: 'Segoe UI, Arial, sans-serif',
          padding: '24px'
        }}>
          {!user && <AuthGateway />}
          {user && (
            <div style={{ display: 'flex', gap: 24, maxWidth: 1400, margin: '0 auto' }}>
              <Sidebar 
                onQuickAction={handleQuickAction}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
              />
              <div style={{ flex: 1 }}>
                {/* Header */}
                <div style={{
                  background: 'var(--color-surface)',
                  borderRadius: 20,
                  padding: 24,
                  marginBottom: 24,
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-surface-alt2)',
                  position: 'relative'
                }}>
                  {/* Header Layout: Logo, User, Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ErgoWiseLogo size={32} />
                      <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.5px' }}>ErgoWise</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>{user.name}</span>
                      <button 
                        onClick={handleThemeToggle}
                        style={{
                          background: 'var(--color-surface-alt2)', 
                          border: '1px solid var(--color-primary)', 
                          padding: '8px 12px', 
                          borderRadius: 12, 
                          cursor: 'pointer', 
                          color: 'var(--color-primary)', 
                          fontWeight: 600,
                          fontSize: 14,
                          transition: 'all 0.2s',
                        }}
                      >
                        {isDark ? 'Light' : 'Dark'}
                      </button>
                      <button 
                        onClick={handleLogout}
                        style={{
                          background: 'var(--color-surface-alt2)', 
                          border: '1px solid var(--color-primary)', 
                          padding: '8px 16px', 
                          borderRadius: 12, 
                          cursor: 'pointer', 
                          color: 'var(--color-primary)', 
                          fontWeight: 600,
                          fontSize: 14,
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                  {/* Centered Welcome Message Row */}
                  <div style={{ textAlign: 'center', marginBottom: 8, marginTop: 8 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary)', margin: 0, lineHeight: 1.1, textAlign: 'center' }}>Welcome to ErgoWise!</h1>
                    <p style={{ fontSize: 15, color: 'var(--color-text-soft)', margin: 0, marginTop: 4, textAlign: 'center' }}>Your personalized workspace wellness assistant</p>
                  </div>
                </div>
                {/* Content Area */}
                <div style={{
                  background: 'var(--color-surface)',
                  borderRadius: 20,
                  padding: 32,
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-surface-alt2)'
                }}>
                  {activeTab === 'Dashboard' && (
                    <section>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <div>
                          <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0, color: 'var(--color-primary)' }}>Ergonomic Wellness Dashboard</h2>
                          <p style={{ color: 'var(--color-text-soft)', margin: 0, fontSize: 14 }}>Track your workspace health and productivity habits</p>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                        <Card>
                          <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--color-primary)' }}>Current Score</div>
                          <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0' }}>82%</div>
                          <div style={{ color: 'var(--color-text-soft)', fontSize: 14 }}>Excellent progress!</div>
                        </Card>
                        <Card>
                          <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--color-primary)' }}>Weekly Breaks</div>
                          <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0' }}>23/35</div>
                          <div style={{ color: 'var(--color-text-soft', fontSize: 14 }}>Target: 35</div>
                        </Card>
                        <Card>
                          <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--color-primary)' }}>Current Streak</div>
                          <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0' }}>7</div>
                          <div style={{ color: 'var(--color-text-soft)', fontSize: 14 }}>Days of good habits</div>
                        </Card>
                        <Card>
                          <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--color-primary)' }}>Monthly Improvement</div>
                          <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0', color: 'var(--color-primary)' }}>+15%</div>
                          <div style={{ color: 'var(--color-text-soft)', fontSize: 14 }}>vs last month</div>
                        </Card>
                      </div>
                    </section>
                  )}
                  {activeTab === 'Assessment' && (
                    <Assessment />
                  )}
                  {activeTab === 'Analytics' && (
                    <section>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <div>
                          <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0, color: 'var(--color-primary)' }}>Analytics Dashboard</h2>
                          <p style={{ color: 'var(--color-text-soft)', margin: 0, fontSize: 14 }}>Track your workspace wellness patterns and improvements</p>
                        </div>
                      </div>
                      {/* Top Row - Main Metrics */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                        <WellnessScoreRadial score={82} />
                        <ErgonomicCategoriesChart />
                      </div>
                      {/* Second Row - Trends */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 24 }}>
                        <ProgressTrendChart />
                      </div>
                      {/* Third Row - Daily & Weekly Patterns */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <DailyActivityChart />
                        <WeeklyBreaksChart />
                      </div>
                    </section>
                  )}
                  {activeTab === 'Recommendations' && (
                    <section>
                      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, color: 'var(--color-primary)' }}>Recommendations</h2>
                      <p style={{ color: 'var(--color-text-soft)', marginBottom: 16 }}>
                        Here you will see personalized ergonomic recommendations after your assessment.
                      </p>
                    </section>
                  )}
                  {activeTab === 'Break Timer' && (
                    <section>
                      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, color: 'var(--color-primary)' }}>Break Management</h2>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                        <BreakTimer startTrigger={breakStartTrigger} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 16 }}>
                        <Card>
                          <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--color-primary)' }}>This week's breaks:</div>
                          <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0' }}>23/35</div>
                        </Card>
                        <Card>
                          <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--color-primary)' }}>Average break length:</div>
                          <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0' }}>3.2 min</div>
                        </Card>
                      </div>
                      <Card>
                        <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--color-primary)' }}>Breaks today:</div>
                        <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0' }}>5</div>
                      </Card>
                    </section>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
}

export default App;