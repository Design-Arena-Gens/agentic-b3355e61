import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [sessionId, setSessionId] = useState('');
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/change-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, newName }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>TikTok Name Changer</title>
        <meta name="description" content="Change your TikTok display name instantly" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>🎵 TikTok Name Changer</h1>
            <p style={styles.subtitle}>Change your display name without waiting days</p>
          </div>

          <div style={styles.warningBox}>
            <strong>⚠️ Warning:</strong> Use at your own risk. Keep your session ID private and never share it.
          </div>

          <button
            onClick={() => setShowInstructions(!showInstructions)}
            style={styles.instructionsButton}
          >
            {showInstructions ? '▼' : '▶'} How to get your Session ID
          </button>

          {showInstructions && (
            <div style={styles.instructionsBox}>
              <ol style={styles.instructionsList}>
                <li>Open TikTok in your browser and log in</li>
                <li>Open Developer Tools (F12 or Right-click → Inspect)</li>
                <li>Go to the "Application" or "Storage" tab</li>
                <li>Click on "Cookies" → "https://www.tiktok.com"</li>
                <li>Find the cookie named "sessionid"</li>
                <li>Copy the Value and paste it below</li>
              </ol>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="sessionId" style={styles.label}>
                Session ID
              </label>
              <input
                type="password"
                id="sessionId"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="Your TikTok session ID"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="newName" style={styles.label}>
                New Display Name
              </label>
              <input
                type="text"
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter your new name"
                required
                minLength={2}
                maxLength={30}
                style={styles.input}
              />
              <small style={styles.helperText}>
                {newName.length}/30 characters
              </small>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonDisabled : {}),
              }}
            >
              {loading ? 'Changing Name...' : 'Change Name'}
            </button>
          </form>

          {result && (
            <div
              style={{
                ...styles.resultBox,
                ...(result.success ? styles.resultSuccess : styles.resultError),
              }}
            >
              <strong>{result.success ? '✓ Success!' : '✗ Error'}</strong>
              <p style={styles.resultMessage}>{result.message}</p>
            </div>
          )}

          <div style={styles.footer}>
            <p style={styles.footerText}>
              <strong>Note:</strong> This tool bypasses TikTok's cooldown period.
              Your session ID is processed server-side and never stored.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a202c',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#718096',
    margin: 0,
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#856404',
  },
  instructionsButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 0',
    marginBottom: '15px',
    display: 'block',
    width: '100%',
    textAlign: 'left',
  },
  instructionsBox: {
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#2d3748',
  },
  instructionsList: {
    margin: 0,
    paddingLeft: '20px',
    lineHeight: '1.8',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
  },
  input: {
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  helperText: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '6px',
  },
  submitButton: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '10px',
  },
  submitButtonDisabled: {
    backgroundColor: '#a0aec0',
    cursor: 'not-allowed',
  },
  resultBox: {
    borderRadius: '8px',
    padding: '16px',
    marginTop: '20px',
    fontSize: '14px',
  },
  resultSuccess: {
    backgroundColor: '#d4edda',
    border: '1px solid #28a745',
    color: '#155724',
  },
  resultError: {
    backgroundColor: '#f8d7da',
    border: '1px solid #dc3545',
    color: '#721c24',
  },
  resultMessage: {
    margin: '8px 0 0 0',
  },
  footer: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
  },
  footerText: {
    fontSize: '12px',
    color: '#718096',
    margin: 0,
    lineHeight: '1.6',
  },
};
