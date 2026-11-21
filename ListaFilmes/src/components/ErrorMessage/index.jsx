import styles from "./styles.module.css";

const DEFAULT_MESSAGE =
  "Não foi possível carregar os filmes. Verifique sua conexão e tente novamente.";

export default function ErrorMessage({ title, message = DEFAULT_MESSAGE, onRetry }) {
  return (
    <div className={styles.box} role="alert">
      {title && <h2 className={styles.title}>{title}</h2>}
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
