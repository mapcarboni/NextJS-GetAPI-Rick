"use client"; // use client para usar hooks do react e manipular o DOM no lado do cliente

import { useEffect, useState } from "react";
import axios from "axios"; // biblioteca para fazer requisições HTTP
// axios é uma biblioteca popular para fazer requisições HTTP em JavaScript.
// Ela é baseada em Promises e oferece uma API simples e intuitiva para lidar com requisições assíncronas.
// Além disso, o axios possui suporte a interceptadores, cancelamento de requisições, transformação de dados e muito mais.

import CharacterCard from "../../components/CharacterCard";
import styles from "./Home.module.css";

export default function Home() {
    const [search, setSearch] = useState(""); // estado para armazenar o valor da busca
    const [characters, setCharacters] = useState([]); // estado para armazenar os personagens
    const [notFound, setNotFound] = useState(false); // estado para controlar se nenhum personagem foi encontrado

    const fetchCharacters = async (name = "") => {
        // função para buscar os personagens na API
        // name é o nome do personagem a ser buscado, se não for passado, busca todos os personagens
        setNotFound(false); // reseta o estado de notFound para false antes de fazer a requisição
        try {
            const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?name=${name}`); // faz a requisição para a API
            // a API retorna os personagens filtrados pelo nome, se o nome for passado
            setCharacters(data.results); // armazena os personagens no estado characters
        } catch {
            setCharacters([]); // se ocorrer um erro, armazena um array vazio no estado characters
            setNotFound(true); // e seta o estado de notFound para true
        }
    };

    useEffect(() => {
        // useEffect para buscar os personagens quando o componente for montado
        fetchCharacters(); // chama a função fetchCharacters sem passar o nome, para buscar todos os personagens
    }, []); // o array vazio [] significa que o efeito só será executado uma vez, quando o componente for montado

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Personagens de Rick and Morty</h1>
            <div className={styles.controls}>
                <input type="text" placeholder="Buscar por nome" value={search} onChange={(e) => setSearch(e.target.value)} className={styles.input} />
                <button onClick={() => fetchCharacters(search.trim())} className={styles.buttonSearch}>
                    {/* O método trim() remove os espaços em branco do início e do fim de uma string. Isso é útil para evitar que espaços desnecessários sejam enviados na requisição. */}
                    Buscar
                </button>
                <button
                    onClick={() => {
                        setSearch("");
                        fetchCharacters();
                    }}
                    className={styles.buttonReset}
                >
                    Resetar
                </button>
            </div>
            {notFound && <h1 className={styles.notFound}>Nenhum personagem encontrado 😢</h1>}
            {/* Se o estado notFound for true, exibe a mensagem "Nenhum personagem encontrado" */}
            <div className={styles.grid}>
                {characters.map((char) => (
                    <CharacterCard key={char.id} character={char} />
                    // o componente CharacterCard é responsável por exibir as informações do personagem
                    // O key é uma propriedade especial do React que ajuda a identificar quais itens mudaram, foram adicionados ou removidos.
                    // Isso é importante para otimizar o desempenho da renderização de listas.
                    // O valor de key deve ser único entre os irmãos (siblings) na lista. Aqui, estamos usando o id do personagem como chave.
                ))}
            </div>
        </div>
    );
}
