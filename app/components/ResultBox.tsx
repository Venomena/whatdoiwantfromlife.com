import React from 'react';
import styled from 'styled-components';

interface ResultBoxProps {
  evaluation: string | null;
}

const ResultBoxWrapper = styled.div`
  background-color: #1e1e1e;
  border: 1px solid #444;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 600px;
  width: 100%;
  margin: 20px auto;
`;

const ResultBoxHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #444;
`;

const ResultContent = styled.div`
  margin-top: 16px;
  width: 100%;
`;

const ResultTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
`;

const ResultText = styled.p`
  font-size: 1rem;
`;

const ResultBox: React.FC<ResultBoxProps> = ({ evaluation }) => {
  return (
    <ResultBoxWrapper>
      <ResultBoxHeader>
        <ResultTitle>Evaluation Result</ResultTitle>
      </ResultBoxHeader>
      <ResultContent>
        <ResultText>{evaluation}</ResultText>
      </ResultContent>
    </ResultBoxWrapper>
  );
};

export default ResultBox;
