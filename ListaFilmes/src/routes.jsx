import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/filme/:id" element={<MovieDetails />} />
      <Route path="/busca" element={<Search />} />
      <Route path="/favoritos" element={<Favorites />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
