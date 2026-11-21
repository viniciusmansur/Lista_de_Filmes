// "2024-07-31" -> "31/07/2024". Não usa Date para evitar deslocamento de fuso.
export function formatDate(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

// 135 -> "2h 15min"
export function formatRuntime(minutes) {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}min`;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}min`;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

// 7.84 -> "7.8"; filmes sem votos aparecem como "–".
export function formatRating(value) {
  const rating = Number(value);
  if (!rating) return "–";
  return rating.toFixed(1);
}

export function formatVotes(count) {
  return Number(count ?? 0).toLocaleString("pt-BR");
}

export function getYear(isoDate) {
  return isoDate ? isoDate.slice(0, 4) : "";
}
