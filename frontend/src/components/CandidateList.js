import React from "react";

const CandidateList = ({ candidates, onSelectCandidate }) => {
  return (
    <div>
      <h1>Visão Geral dos Candidatos</h1>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id} onClick={() => onSelectCandidate(candidate)}>
            <img src={candidate.photo} alt={candidate.name} width="50" />
            <p>{candidate.name}</p>
            <p>{candidate.percentage}%</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidateList;
