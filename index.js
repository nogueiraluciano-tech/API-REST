
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir arquivos estaticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota da API - busca dados do Pokemon na PokeAPI
app.get('/api/pokemon/:name', async (req, res) => {
const { name } = req.params;

try {
const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
const response = await axios.get(url);
const pokemon = response.data;

const dados = {
nome: pokemon.name,
id: pokemon.id,
tipos: pokemon.types.map((t) => t.type.name),
altura: pokemon.height / 10 + ' m',
peso: pokemon.weight / 10 + ' kg',
imagem: pokemon.sprites.other['official-artwork'].front_default,
habilidades: pokemon.abilities.map((a) => a.ability.name),
};

res.json(dados);

} catch (error) {
if (error.response && error.response.status === 404) {
res.status(404).json({ erro: 'Pokemon nao encontrado!' });
} else {
res.status(500).json({ erro: 'Erro ao conectar com a PokeAPI.' });
}
}
});

app.listen(PORT, () => {
console.log(`Servidor rodando em http://localhost:${PORT}`);
});