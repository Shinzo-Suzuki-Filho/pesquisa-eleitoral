import React from "react";

const CandidateProfile = ({ candidate, onBack }) => {
  return (
    <div>
      <button onClick={onBack}>Voltar</button>
      <img src={candidate.photo} alt={candidate.name} width="200" />
      <h1>{candidate.name}</h1>
      <p>Votos: {candidate.votes}</p>
      <p>Percentual: {candidate.percentage}%</p>
      <p>Histórico: [Simulação - Crescendo]</p>
    </div>
  );
};

export default CandidateProfile;
