import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CandidateList from './components/CandidateList';
import CandidateProfile from './components/CandidateProfile';
import PieChart from './components/PieChart';

const socket = io('http://localhost:5000');

function App() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    // Receber dados iniciais
    socket.on('initialData', (data) => {
      setCandidates(data);
    });

    // Atualizações em tempo real
    socket.on('update', (data) => {
      setCandidates(data);
    });

    return () => {
      socket.off('initialData');
      socket.off('update');
    };
  }, []);

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleBack = () => {
    setSelectedCandidate(null);
  };

  return (
    <div className="App">
      {selectedCandidate ? (
        <CandidateProfile candidate={selectedCandidate} onBack={handleBack} />
      ) : (
        <>
          <CandidateList candidates={candidates} onSelectCandidate={handleSelectCandidate} />
          <PieChart candidates={candidates} />
        </>
      )}
    </div>
  );
}

export default App;