"use client";

import React from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #121212;
  color: white;
  padding: 20px;
`;

const ResultBox = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const SuggestionText = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

const HomeButton = styled.button`
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

const Result: React.FC = () => {
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const suggestion = searchParams.get('suggestion');

  const router = useRouter();

  const goToHome = () => {
    router.push('/');
  };

  return (
    <ResultWrapper>
      <ResultBox>
        <Title>Your Suggested Path</Title>
        <SuggestionText>{suggestion}</SuggestionText>
        <HomeButton onClick={goToHome}>Go to Home</HomeButton>
      </ResultBox>
    </ResultWrapper>
  );
};

export default Result;
