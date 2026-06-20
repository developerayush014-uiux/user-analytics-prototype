import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:5000/api';

export default function App() {
  // --- STATE FOR CLIENT SIMULATION ---
  const [sessionId, setSessionId] = useState('');
  const [currentFakePage, setCurrentFakePage] = useState('/home');

  // --- STATE FOR DASHBOARD ---
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [heatmapPage, setHeatmapPage] = useState('/home');
  const [heatmapClicks, setHeatmapClicks] = useState([]);

  // 1. Initialize Session ID and Trigger Initial Page View
  useEffect(() => {
    let storedId = localStorage.getItem('analytics_session_id');
    if (!storedId) {
      storedId = 'sess_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('analytics_session_id', storedId);
    }
    setSessionId(storedId);
    trackEvent('page_view', currentFakePage, storedId);
    fetchDashboardData();
  }, []);

  // 2. Track Events to Backend
  const trackEvent = async (type, page, targetSessionId, coords = null) => {
    const activeSession = targetSessionId || sessionId;
    if (!activeSession) return;

    const payload = {
      sessionId: activeSession,
      eventType: type,
      pageUrl: page,
      timestamp: new Date().toISOString(),
      ...(coords && { clickCoordinates: coords })
    };

    try {
      await fetch(`${BACKEND_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      // Refresh analytics data on new interactions
      fetchDashboardData();
      if (page === heatmapPage) fetchHeatmapData(heatmapPage);
    } catch (err) {
      console.error('Failed to send tracking data', err);
    }
  };

  // Capture simulated website interaction clicks
  const handleSimulatedPageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate relative coordinates inside the sandbox frame
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    trackEvent('click', currentFakePage, sessionId, { x, y });
  };

  const changeFakePage = (newPage) => {
    setCurrentFakePage(newPage);
    trackEvent('page_view', newPage, sessionId);
  };

  // --- FETCH DASHBOARD ANALYTICS ---
  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/sessions`);
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const viewSessionJourney = async (id) => {
    setSelectedSessionId(id);
    try {
      const res = await fetch(`${BACKEND_URL}/sessions/${id}`);
      const data = await res.json();
      setSessionEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHeatmapData = async (page) => {
    try {
      const res = await fetch(`${BACKEND_URL}/heatmap?pageUrl=${encodeURIComponent(page)}`);
      const data = await res.json();
      setHeatmapClicks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHeatmapData(heatmapPage);
  }, [heatmapPage]);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f5f7fb', minHeight: '100vh' }}>
      <header style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#1a73e8' }}>CausalFunnel Assignment: User Analytics Dashboard</h1>
        <p style={{ margin: '5px 0 0 0', color: '#666' }}>Prototype Full Stack Tracking Script & Dashboard Infrastructure</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* CLIENT SIDE SIMULATION CONTAINER */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>1. Simulated Live Website</h2>
          <p style={{ fontSize: '13px', color: '#666' }}>
            <strong>Active Session ID:</strong> <code style={{ background: '#eee', padding: '2px 4px' }}>{sessionId}</code>
          </p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button onClick={() => changeFakePage('/home')} style={{ flex: 1, padding: '8px', cursor: 'pointer', backgroundColor: currentFakePage === '/home' ? '#1a73e8' : '#eee', color: currentFakePage === '/home' ? '#fff' : '#000', border: 'none', borderRadius: '4px' }}>Home Page</button>
            <button onClick={() => changeFakePage('/pricing')} style={{ flex: 1, padding: '8px', cursor: 'pointer', backgroundColor: currentFakePage === '/pricing' ? '#1a73e8' : '#eee', color: currentFakePage === '/pricing' ? '#fff' : '#000', border: 'none', borderRadius: '4px' }}>Pricing Page</button>
          </div>

          <div 
            onClick={handleSimulatedPageClick}
            style={{ height: '300px', backgroundColor: '#fafafa', border: '2px dashed #ccc', borderRadius: '6px', position: 'relative', cursor: 'crosshair', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', userSelect: 'none' }}
          >
            <span style={{ fontWeight: 'bold', color: '#888' }}>Target Interaction Window ({currentFakePage})</span>
            <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', padding: '0 2px' }}>
              Click anywhere inside this sandbox frame to fire click event targets (X/Y coordinates) dynamically.
            </p>
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#333', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>
              Simulated Click Box
            </div>
          </div>
        </div>

        {/* BACKEND & ANALYTICS DASHBOARD VIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* SESSIONS VIEW */}
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, color: '#333' }}>2. Live Session Streams</h2>
            <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f3f4' }}>
                    <th style={{ padding: '10px' }}>Session ID</th>
                    <th style={{ padding: '10px' }}>Total Events</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s._id} style={{ borderBottom: '1px solid #eee', backgroundColor: selectedSessionId === s._id ? '#e8f0fe' : 'transparent' }}>
                      <td style={{ padding: '10px', fontFamily: 'monospace' }}>{s._id}</td>
                      <td style={{ padding: '10px' }}>{s.totalEvents}</td>
                      <td style={{ padding: '10px' }}>
                        <button onClick={() => viewSessionJourney(s._id)} style={{ padding: '4px 8px', cursor: 'pointer', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px' }}>
                          View Journey
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CHRONOLOGICAL USER JOURNEY DETAIL */}
            {selectedSessionId && (
              <div style={{ marginTop: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #1a73e8' }}>
                <h3 style={{ marginTop: 0 }}>Timeline Journey for: <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>{selectedSessionId}</span></h3>
                <ol style={{ paddingLeft: '20px', margin: 0 }}>
                  {sessionEvents.map((ev, index) => (
                    <li key={index} style={{ marginBottom: '8px', fontSize: '13px' }}>
                      <strong>[{ev.eventType.toUpperCase()}]</strong> passed at <span style={{ color: '#555' }}>{ev.pageUrl}</span> 
                      {ev.eventType === 'click' && ` (Coords: X=${ev.clickX}, Y=${ev.clickY})`} 
                      <span style={{ color: '#999', fontSize: '11px', marginLeft: '10px' }}>
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* VISUAL HEATMAP DISPLAY VIEW */}
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, color: '#333' }}>3. Visual Click Heatmap View Overlay</h2>
              <div>
                <label style={{ marginRight: '8px', fontSize: '14px', fontWeight: 'bold' }}>Select View Page: </label>
                <select value={heatmapPage} onChange={(e) => setHeatmapPage(e.target.value)} style={{ padding: '6px', borderRadius: '4px' }}>
                  <option value="/home">/home</option>
                  <option value="/pricing">/pricing</option>
                </select>
              </div>
            </div>

            {/* Visual Grid Container mimicking page resolution bounds */}
            <div style={{ height: '300px', backgroundColor: '#eef2f7', border: '1px solid #ddd', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ textAlign: 'center', color: '#aaa', paddingTop: '130px', pointerEvents: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                Visual Layer Matrix for {heatmapPage} ({heatmapClicks.length} Clicks Documented)
              </div>

              {/* Red Dots rendering exact coordinate maps recorded from tracking inputs */}
              {heatmapClicks.map((click, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${click.clickX - 6}px`,
                    top: `${click.clickY - 6}px`,
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                    boxShadow: '0 0 8px 3px rgba(255, 65, 54, 0.5)',
                    pointerEvents: 'none'
                  }}
                  title={`Click Event at X:${click.clickX}, Y:${click.clickY}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}