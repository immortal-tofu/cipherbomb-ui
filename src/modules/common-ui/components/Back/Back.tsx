import { Link } from 'react-router-dom';

import './Back.css';

export const Back = () => {
  return (
    <Link to="/" className="Back">
      ⬅ Back to the main menu
    </Link>
  );
};
