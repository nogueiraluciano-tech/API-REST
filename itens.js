const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ARQUIVO = path.join(__dirname, '..', 'data', 'itens.json');

// Funções de apoio
function ler() {
return JSON.parse(fs.readFileSync(ARQUIVO, 'utf-8'));
}

function salvar(d) {
fs.writeFileSync(ARQUIVO, JSON.stringify(d, null, 2));
}

// [GET] Listar
router.get('/', (req, res) => res.json(ler()));

// [GET] Buscar por ID
router.get('/:id', (req, res) => {
const item = ler().find(i => i.id === Number(req.params.id));

item
? res.json(item)
: res.status(404).json({ erro: 'Não encontrado' });
});

// [POST] Criar
router.post('/', (req, res) => {
const { titulo, genero, ano } = req.body;

if (!titulo || !genero)
return res.status(400).json({ erro: 'Dados inválidos' });

const dados = ler();

const novo = {
id: dados.length > 0 ? dados[dados.length - 1].id + 1 : 1,
titulo,
genero,
ano
};

dados.push(novo);
salvar(dados);

res.status(201).json(novo);
});

// [PUT] Editar
router.put('/:id', (req, res) => {
const dados = ler();

const index = dados.findIndex(
i => i.id === Number(req.params.id)
);

if (index === -1)
return res.status(404).json({ erro: 'Não encontrado' });

dados[index] = {
...dados[index],
...req.body,
id: dados[index].id
};

salvar(dados);

res.json(dados[index]);
});

// [DELETE] Remover
router.delete('/:id', (req, res) => {
const id = Number(req.params.id);

const dados = ler();

if (!dados.find(i => i.id === id))
return res.status(404).json({ erro: 'Não existe' });

salvar(dados.filter(i => i.id !== id));

res.json({ mensagem: 'Removido com sucesso' });
});

module.exports = router;