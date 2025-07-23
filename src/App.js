import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

function App() {
  const [email, setEmail] = useState('');
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
    <div style={{ padding: '2rem' }}>
      <h1>🎬 Movie Finder</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Log In</button>
      <p>{message}</p>

      <h2>Ask AI about movies</h2>
      <input
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        placeholder="Ask something like: recommend a comedy"
      />
      <button onClick={handleChat}>Ask</button>
      <p><strong>AI:</strong> {chatResponse}</p>
    </div>
  );
}

export default App;