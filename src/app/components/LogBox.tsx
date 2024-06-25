import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface Log {
  action: string;
  status: string;
  source?: string;
  detail?: string;
}

const LogBoxWrapper = styled.div`
  background-color: #000;
  border: 1px solid #444;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 80%;
  max-width: 800px;
  margin: 20px auto;
  height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const LogItem = styled.div`
  background: #1e1e1e;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogText = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogAction = styled.div`
  font-weight: bold;
`;

const LogStatus = styled.div`
  font-size: 0.875rem;
  color: #b0b0b0;
`;

const LogDetail = styled.div`
  font-size: 0.875rem;
  color: #808080;
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: ${spin} 1s linear infinite;
`;

const LogBox: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<Set<number>>(new Set());
  const logBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/logs');
    eventSource.onmessage = (event) => {
      const newLog: Log = JSON.parse(event.data);
      setLogs((prevLogs) => [...prevLogs, newLog]);
      if (newLog.status === 'Started') {
        setLoadingLogs((prev) => {
          const newSet = new Set(prev);
          newSet.add(prev.size);
          return newSet;
        });
      } else if (newLog.status === 'Completed') {
        setLoadingLogs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(prev.size - 1);
          return newSet;
        });
      }
    };
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, []);

  const renderLog = (log: Log, index: number) => (
    <LogItem key={index}>
      <LogText>
        <LogAction>{log.action}</LogAction>
        <LogStatus>{log.status}</LogStatus>
        {log.source && <LogDetail>{log.source}</LogDetail>}
        {log.detail && <LogDetail>{log.detail}</LogDetail>}
      </LogText>
      {loadingLogs.has(index) && <Spinner />}
    </LogItem>
  );

  return (
    <LogBoxWrapper ref={logBoxRef}>
      {logs.map((log, index) => renderLog(log, index))}
    </LogBoxWrapper>
  );
};

export default LogBox;
