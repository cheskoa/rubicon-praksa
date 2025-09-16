import "../styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">BitAlijansa Internship</div>
      <div className="search-bar">
        <input type="text" placeholder="Search movies or series..." />
      </div>
    </header>
  );
}
