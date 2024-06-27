"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const ConversationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #121212;
  color: white;
  padding: 20px;
`;

const MessageBox = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  margin: 10px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const UserInput = styled.input`
  width: 100%;
  max-width: 600px;
  padding: 10px;
  margin-top: 20px;
  border-radius: 5px;
  border: 1px solid #333;
  background-color: #2a2a2a;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: #4a90e2;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #357abd;
  }
`;

const Conversation: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/start')
      .then(response => response.json())
      .then(data => {
        setMessages([data.prompt]);
      });
  }, []);

  const handleSubmit = async () => {
    if (!input) return;
    setLoading(true);
    const userResponse = input;
    setMessages([...messages, `You: ${userResponse}`]);
    setInput('');

    const response = await fetch('/api/respond', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ response: userResponse }),
    });

    const data = await response.json();

    if (data.suggestion) {
      const queryString = new URLSearchParams({ suggestion: data.suggestion }).toString();
      router.push(`/result?${queryString}`);
    } else {
      setMessages([...messages, `You: ${userResponse}`, data.prompt]);
      setLoading(false);
    }
  };

  return (
    <ConversationWrapper>
      {messages.map((message, index) => (
        <MessageBox key={index}>{message}</MessageBox>
      ))}
      <UserInput
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your response here..."
        disabled={loading}
      />
      <SubmitButton onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </SubmitButton>
    </ConversationWrapper>
  );
};

export default Conversation;
