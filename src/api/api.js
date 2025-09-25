import axios from "axios";

const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MjIzMjBlYzhmNjY0ZTgzYmUzZjg3MzQ5YzM5NTFkNSIsIm5iZiI6MTc1ODEwMjc3OS41OTM5OTk5LCJzdWIiOiI2OGNhODRmYjk3ZTQ1YjFjMDBkZTgzMmQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LJCCGEeL7CUi8H3nnlicFYjULWP9-795e28HtVG4U18";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    accept: "application/json"
  }
});

export async function getTopRatedMovies() {
  try {
    const res = await api.get("/movie/top_rated");
    return res.data.results;
  } catch (err) {
    console.error("Greška kod dohvata filmova:", err.response?.data || err.message);
    return [];
  }
}

export async function getTopRatedTVShows() {
  try {
    const res = await api.get("/tv/top_rated");
    return res.data.results;
  } catch (err) {
    console.error("Greška kod dohvata serija:", err.response?.data || err.message);
    return [];
  }
}

export async function searchMulti(query) {
  try {
    const trimmed = (query || "").trim();
    if (!trimmed) return [];
    const res = await api.get("/search/multi", { params: { query: trimmed } });
    return res.data.results || [];
  } catch (err) {
    console.error("Greška kod pretrage:", err.response?.data || err.message);
    return [];
  }
}

export async function getMovieDetails(id) {
  try {
    const res = await api.get(`/movie/${id}`);
    return res.data;
  } catch (err) {
    console.error("Greška kod dohvata detalja filma:", err.response?.data || err.message);
    return null;
  }
}

export async function getTVDetails(id) {
  try {
    const res = await api.get(`/tv/${id}`);
    return res.data;
  } catch (err) {
    console.error("Greška kod dohvata detalja serije:", err.response?.data || err.message);
    return null;
  }
}