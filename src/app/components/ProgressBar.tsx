"use client";

import React from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
  progress: number;
}

const ProgressWrapper = styled.div`
  width: 100%;
  background-color: #3a3a3a;
  border-radius: 12px;
  height: 16px;
  margin-top: 16px;
`;

const ProgressBarInner = styled.div<{ progress: number }>`
  background-color: #4caf50;
  height: 16px;
  border-radius: 12px;
  transition: width 0.5s;
  width: ${(props) => props.progress}%;
`;

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <ProgressWrapper>
      <ProgressBarInner progress={progress}></ProgressBarInner>
    </ProgressWrapper>
  );
};

export default ProgressBar;
