import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function SearchBar({ initialValue = "" }) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const term = value.trim();
    if (!term) return;
    navigate({ pathname: "/busca", search: `?${new URLSearchParams({ q: term })}` });
  }

  return (
    <form className={styles.form} role="search" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="busca-filmes">
        Buscar filmes por título
      </label>
      <div className={styles.field}>
        <input
          id="busca-filmes"
          className={styles.input}
          type="search"
          name="q"
          placeholder="Buscar filmes por título"
          autoComplete="off"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button type="submit" className={styles.submit} aria-label="Buscar">
          <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <path
              d="M16.5 16.5L21 21"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
