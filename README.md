# Aplicativo de Pesquisa Eleitoral

Este aplicativo permite coletar, organizar e visualizar pesquisas eleitorais em tempo real.

## Funcionalidades

- Tela inicial com lista de candidatos e percentuais
- Perfil detalhado de cada candidato
- Gráfico pizza para visualização
- Atualização em tempo real via Socket.io
- Backend com Express e armazenamento em memória

## Como executar

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Estrutura

- `frontend/`: Aplicativo React
- `backend/`: Servidor Node.js com Express e Socket.io