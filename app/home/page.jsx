"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CharacterCard from "../../components/CharacterCard";
import styles from "./Home.module.css";

export default function RickAndMortyPage() {
  const [search, setSearch] = useState("");
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchCharacters = async (name = "") => {
    setLoading(true);
    setNotFound(false);
    try {
      const response = await axios.get(
        `https://rickandmortyapi.com/api/character/?name=${name}`
      );
      setCharacters(response.data.results);
    } catch (error) {
      setCharacters([]);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleSearch = () => {
    fetchCharacters(search.trim());
  };

  const handleReset = () => {
    setSearch("");
    fetchCharacters();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Personagens de Rick and Morty</h1>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Buscar por nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.buttonSearch}>
          Buscar
        </button>
        <button onClick={handleReset} className={styles.buttonReset}>
          Resetar
        </button>
      </div>

      {loading && <p className={styles.loading}>Carregando personagens...</p>}
      {notFound && (
        <p className={styles.notFound}>Nenhum personagem encontrado 😢</p>
      )}

      <div className={styles.grid}>
        {characters.map((char) => (
          <CharacterCard key={char.id} character={char} />
        ))}
      </div>
    </div>
  );
}
