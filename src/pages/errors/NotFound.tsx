import { Link } from "react-router-dom";
function NotFound() {
  return (
    <div className="error-parent">
      <div className="error-page-container">
        <h1 className="error-code">404</h1>
        <p className="error-message">Oops! Page not found.</p>
        <Link to="/" className="error-home-button">
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
