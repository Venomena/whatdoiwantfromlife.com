"use client";

import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #121212;
  color: white;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

const StartButton = styled.button`
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

const Home: React.FC = () => {
  const router = useRouter();

  const startConversation = () => {
    router.push('/conversation');
  };

  return (
    <HomeWrapper>
      <Title>Welcome to Career Finder</Title>
      <Description>Discover your passions and find out what and where to study with the help of AI.</Description>
      <StartButton onClick={startConversation}>Get Started</StartButton>
    </HomeWrapper>
  );
};

export default Home;
