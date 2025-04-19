"use client";

import styles from "./Home.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CharacterCard from "../../components/CharacterCard";
import Loader from "../../components/Loader";

export default function Home() {
    // ---------------------------------------------
    // 1️⃣ MOSTRAR TODOS OS PERSONAGENS
    // ---------------------------------------------

    // Criar hooks para armazenar os personagens
    // Criar hook para armazenar o estado encontrado personagens
    const [characters, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);

    // Criar hook para armazenar o estado de loading
    const [loading, setLoading] = useState(true);

    // Criar função para buscar os personagens da API com nome e página
    // E se achar, armazenar no hook de personagens, armazenar total de páginas e setar o estado de não encontrado como false
    //
    // Se não achar, armazenar no hook de personagens como vazio e setar o estado de não encontrado como true
    //
    // E setar o estado de loading como false
    const fetchCharacters = async (name = "", pageNumber = 1) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`);
            setCharacters(data.results);
            setTotalPages(data.info.pages);
            setNotFound(false);
        } catch {
            setCharacters([]);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    // Chamar a função de buscar personagens quando o componente for montado
    useEffect(() => {
        fetchCharacters();
    }, []);

    // ---------------------------------------------
    // 2️⃣ FILTRAR POR NOME
    // ---------------------------------------------

    // Criar hook para armazenar o nome do personagem a ser buscado
    const [search, setSearch] = useState("");

    // Criar função para buscar personagens com o nome
    // E setar o estado de página como 1
    // E chamar a função de buscar personagens com o nome e página 1
    const handleSearch = () => {
        setPage(1);
        fetchCharacters(search, 1);
    };

    // Criar função para resetar o filtro
    // E limpar o campo de busca
    // E setar o estado de página como 1
    // E chamar a função de buscar personagens com o nome vazio
    const handleReset = () => {
        setSearch("");
        setPage(1);
        fetchCharacters("", 1);
        toast.success("Filtro foi resetado", { position: "top-left" });
    };

    // ---------------------------------------------
    // 3️⃣ CLIQUE NO CARD E TOAST
    // ---------------------------------------------

    // Criar função para mostrar o nome do personagem no toast
    const handleCardClick = (char) => {
        toast.info(`Você clicou em ${char.name} que está ${char.status}`);
    };

    // ---------------------------------------------
    // 4️⃣ PAGINAÇÃO
    // ---------------------------------------------

    // Criar hook para armazenar a página atual e o total de páginas
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // usar o hook de efeito para buscar os personagens quando a página mudar
    useEffect(() => {
        fetchCharacters(search, page);
    }, [page]);

    // ---------------------------------------------
    // 🧱 INTERFACE (RENDERIZAÇÃO)
    // ---------------------------------------------

    return (
        <div className={styles.container}>
            <ToastContainer position="top-right" autoClose={7500} theme="light" />

            <h1 className={styles.title}>Personagens de Rick and Morty</h1>

            {/* Área de busca */}
            <div className={styles.controls}>
                <input type="text" placeholder="Buscar por nome" value={search} onChange={(e) => setSearch(e.target.value)} className={styles.input} />
                <button onClick={handleSearch} className={styles.buttonSearch}>
                    Buscar
                </button>
                <button onClick={handleReset} className={styles.buttonReset}>
                    Resetar
                </button>
            </div>

            {/* Navegação de páginas */}
            <div className={styles.navControls}>
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1 || notFound} className={styles.buttonNav}>
                    Página Anterior
                </button>

                {/* Indicador de página */}
                <span className={styles.pageIndicator}>
                    Página {page} de {totalPages}
                </span>

                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages || notFound} className={styles.buttonNav}>
                    Próxima Página
                </button>
            </div>

            {/* Mensagem de nenhum personagem encontrado */}
            {notFound && <h1 className={styles.notFound}>Nenhum personagem encontrado 😢</h1>}

            {/* Loader enquanto os personagens estão sendo carregados */}

            {loading ? (
                <div className={`${styles.loaderWrapper} ${loading ? "" : styles.hidden}`}>
                    <Loader />
                </div>
            ) : (
                <div className={styles.grid}>
                    {characters.map((char) => (
                        <CharacterCard key={char.id} character={char} onClick={() => handleCardClick(char)} />
                    ))}
                </div>
            )}
        </div>
    );
}
