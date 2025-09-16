import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />

      <main className="main">
        <h1>Welcome!</h1>
        <p className="subtitle">Choose one of the following</p>

        <div className="options">
          <div className="option">
            <h2>🎬 Movies</h2>
            <p>Explore the latest movies.</p>
          </div>

          <div className="option">
            <h2>📺 TV Series</h2>
            <p>Discover trending TV shows.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
