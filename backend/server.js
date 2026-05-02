const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Simulação de banco de dados com dados em memória
let candidates = [
  { id: 1, name: "Candidato A", photo: "url_a", votes: 100, percentage: 40 },
  { id: 2, name: "Candidato B", photo: "url_b", votes: 150, percentage: 60 },
];

let votes = []; // Histórico de votos

// API para obter candidatos
app.get("/api/candidates", (req, res) => {
  res.json(candidates);
});

// API para registrar voto
app.post("/api/vote", (req, res) => {
  const { candidateId } = req.body;
  const candidate = candidates.find((c) => c.id === candidateId);
  if (candidate) {
    candidate.votes += 1;
    // Recalcular percentuais
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    candidates.forEach(
      (c) => (c.percentage = Math.round((c.votes / totalVotes) * 100)),
    );
    votes.push({ candidateId, timestamp: new Date() });
    // Emitir atualização para todos os clientes conectados
    io.emit("update", candidates);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Candidato não encontrado" });
  }
});

// Socket.io para tempo real
io.on("connection", (socket) => {
  console.log("Novo cliente conectado");
  socket.emit("initialData", candidates);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
