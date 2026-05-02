const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/pesquisa-eleitoral', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao MongoDB');
}).catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

// Schemas
const candidateSchema = new mongoose.Schema({
  name: String,
  photo: String,
  votes: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

const voteSchema = new mongoose.Schema({
  candidateId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now }
});

const Vote = mongoose.model('Vote', voteSchema);

// Função para popular banco se vazio
const populateDB = async () => {
  const count = await Candidate.countDocuments();
  if (count === 0) {
    const candidates = [
      { name: 'Candidato A', photo: 'url_a', votes: 100, percentage: 40 },
      { name: 'Candidato B', photo: 'url_b', votes: 150, percentage: 60 }
    ];
    await Candidate.insertMany(candidates);
    console.log('Banco populado com dados iniciais');
  }
};

populateDB();

// Função para recalcular percentuais
const recalculatePercentages = async () => {
  const totalVotes = await Candidate.aggregate([{ $group: { _id: null, total: { $sum: '$votes' } } }]);
  const total = totalVotes[0]?.total || 0;
  if (total > 0) {
    await Candidate.updateMany({}, [
      { $set: { percentage: { $round: [{ $multiply: [{ $divide: ['$votes', total] }, 100] }] } } }
    ]);
  }
};

// API para obter candidatos
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar candidatos' });
  }
});

// API para registrar voto
app.post('/api/vote', async (req, res) => {
  const { candidateId } = req.body;
  try {
    const candidate = await Candidate.findById(candidateId);
    if (candidate) {
      candidate.votes += 1;
      await candidate.save();
      await recalculatePercentages();
      const updatedCandidates = await Candidate.find();
      // Salvar voto
      await Vote.create({ candidateId });
      // Emitir atualização
      io.emit('update', updatedCandidates);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Candidato não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar voto' });
  }
});

// Socket.io para tempo real
io.on('connection', async (socket) => {
  console.log('Novo cliente conectado');
  try {
    const candidates = await Candidate.find();
    socket.emit('initialData', candidates);
  } catch (err) {
    console.error('Erro ao enviar dados iniciais:', err);
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
