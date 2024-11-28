import { Link } from "react-router-dom";
function Unauthorized() {
  return (
    <div className="error-parent">
      <div className="error-page-container">
        <h1 className="error-code">Unauthorized</h1>
        <p className="error-message">
          You are not authorized to access this page.
        </p>
        <Link to="/" className="error-home-button">
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;
