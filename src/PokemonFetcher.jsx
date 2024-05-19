import React, { useState } from "react";
import "./PokemonFetcher.css";
import pokedexLogo from "./assets/pokedex_logo.png"; // Import the Pokedex logo

const PokemonFetcher = () => {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pokemonId, setPokemonId] = useState(1);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    fighting: "#C03028",
    water: "#6890F0",
    flying: "#A890F0",
    grass: "#78C850",
    poison: "#A040A0",
    electric: "#F8D030",
    ground: "#E0C068",
    psychic: "#F85888",
    rock: "#B8A038",
    ice: "#98D8D8",
    bug: "#A8B820",
    dragon: "#7038F8",
    ghost: "#705898",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };

  const fetchPokemonData = (id) => {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pokemon not found");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error fetching Pokémon data:", error);
        throw new Error("Pokemon not found. Please enter a valid name or ID.");
      });
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter" && pokemonName.trim() !== "") {
      setLoading(true);
      try {
        const data = await fetchPokemonData(pokemonName.toLowerCase());
        setPokemonData(data);
        console.log("Fetched Pokémon data:", data);
        setError(null);
        setPokemonId(data.id); // Update the Pokémon ID
      } catch (error) {
        setPokemonData(null);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    const newPokemonId = Math.max(pokemonId - 1, 1);
    setPokemonId(newPokemonId);
    fetchPokemon(newPokemonId);
  };

  const handleNext = () => {
    const newPokemonId = pokemonId + 1;
    setPokemonId(newPokemonId);
    fetchPokemon(newPokemonId);
  };

  const fetchPokemon = (id) => {
    setLoading(true);
    fetchPokemonData(id)
      .then((data) => {
        setPokemonData(data);
        setError(null);
        setShowSearchInput(false);
      })
      .catch((error) => {
        setPokemonData(null);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  const renderTypes = () => {
    if (pokemonData && pokemonData.types) {
      return pokemonData.types.map((typeInfo, index) => {
        const typeName = typeInfo.type.name;
        const capitalizedTypeName =
          typeName.charAt(0).toUpperCase() + typeName.slice(1);
        const backgroundColor = typeColors[typeName] || "#777"; // Default color if type not found
        return (
          <span
            key={index}
            className="pokemon-type"
            style={{ backgroundColor }}
          >
            {capitalizedTypeName}
          </span>
        );
      });
    }
    return null;
  };

  const renderStats = () => {
    if (pokemonData && pokemonData.stats) {
      return pokemonData.stats.map((stat, index) => (
        <div key={index} className="pokemon-stat">
          <p className="pokemon-stat-title">{stat.stat.name}</p>
          <p className="pokemon-stat-value">{stat.base_stat}</p>
        </div>
      ));
    }
    return null;
  };

  return (
    <div className="pokemon-fetcher">
      <div className="header">
        <img src={pokedexLogo} alt="Pokedex Logo" className="pokedex-logo" />
        <h1>Pokédex</h1>
      </div>
      <div className="welcome-message">
        <p>
          Welcome to the Pokédex! Search for your favorite Pokémon by name or
          ID.
        </p>
      </div>
      <div className="copyright">© 2024 Nirs</div> {/* Add copyright */}
      <div className="navigation-buttons">
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
      <div className={`search-container ${showSearchInput ? "show" : ""}`}>
        <input
          type="text"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter Pokémon name or ID and press Enter"
          className={`pokemon-input ${showSearchInput ? "show" : ""}`}
        />
      </div>
      {loading && (
        <div className="loading-indicator">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="Loading..."
          />
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      {pokemonData && (
        <div className="pokemon-card">
          <h2 className="pokemon-name">{pokemonData.name}</h2>
          <p className="pokemon-number"># {pokemonId}</p>
          <img
            src={pokemonData.sprites.front_default}
            alt={pokemonData.name}
            className="pokemon-image"
          />
          <div className="pokemon-types">{renderTypes()}</div>
          <div className="pokemon-stats">{renderStats()}</div>
        </div>
      )}
    </div>
  );
};

export default PokemonFetcher;
