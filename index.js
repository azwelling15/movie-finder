import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [email, setEmail] = useState('');
  const [session, setSession] = useState(null);
  const [message, setMessage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(error.message);
    else setMessage('Check your email for the login link!');
  };

  const handleChat = async () => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: chatInput }]
      })
    });
    const data = await res.json();
    setChatResponse(data.choices[0].message.content);
  };

  return (
    <div>
      <h1>🎬 Movie Finder</h1>
      {!session ? (
        <>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
          <button onClick={handleLogin}>Log in</button>
          <p>{message}</p>
        </>
      ) : (
        <>
          <p>Welcome!</p>
        </>
      )}
      <h2>Ask AI for Recommendations:</h2>
      <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="e.g. Recommend a fun movie" />
      <button onClick={handleChat}>Ask</button>
      <p><strong>AI says:</strong> {chatResponse}</p>
    </div>
  );
}

export default App;