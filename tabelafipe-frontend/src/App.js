import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [anos, setAnos] = useState([]);
  const [precos, setPrecos] = useState([]);
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedModelo, setSelectedModelo] = useState('');

  useEffect(() => {
    const fetchMarcas = async () => {
      const response = await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas');
      const data = await response.json();
      setMarcas(data);
    };

    fetchMarcas();
  }, []);

  const handleMarcaChange = async (event) => {
    const marcaCodigo = event.target.value;
    setSelectedMarca(marcaCodigo);
    setSelectedModelo(''); // Reseta o modelo ao mudar a marca
    const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaCodigo}/modelos`);
    const data = await response.json();
    setModelos(data.modelos);
    setPrecos([]); // Limpa os preços quando muda a marca
  };

  const handleModeloChange = async (event) => {
    const modeloCodigo = event.target.value;
    setSelectedModelo(modeloCodigo);

    // Busca os anos automaticamente após selecionar o modelo
    const responseAnos = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${selectedMarca}/modelos/${modeloCodigo}/anos`);
    const dataAnos = await responseAnos.json();
    setAnos(dataAnos);

    // Busca os preços para todos os anos
    const precosData = await Promise.all(dataAnos.map(async (ano) => {
      const responsePreco = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${selectedMarca}/modelos/${modeloCodigo}/anos/${ano.codigo}`);
      return responsePreco.json();
    }));

    // Espera todas as promessas serem resolvidas e atualiza o estado
    const precosResults = await Promise.all(precosData);
    setPrecos(precosResults);
  };

  return (
    <div className="App">
      <h1>Tabela FIPE</h1>
      <div>
        <label htmlFor="marcas">Marcas:</label>
        <select id="marcas" value={selectedMarca} onChange={handleMarcaChange}>
          <option value="">Selecione uma marca</option>
          {marcas.map((marca) => (
            <option key={marca.codigo} value={marca.codigo}>{marca.nome}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="modelos">Modelos:</label>
        <select id="modelos" value={selectedModelo} onChange={handleModeloChange}>
          <option value="">Selecione um modelo</option>
          {modelos.map((modelo) => (
            <option key={modelo.codigo} value={modelo.codigo}>{modelo.nome}</option>
          ))}
        </select>
      </div>

      <div>
        <h2>Detalhes do Carro:</h2>
        {precos.length > 0 && (
          <ul>
            {precos.map((preco, index) => (
              <li key={index}>
                Ano: {preco.AnoModelo},  Valor: {preco.Valor}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;








