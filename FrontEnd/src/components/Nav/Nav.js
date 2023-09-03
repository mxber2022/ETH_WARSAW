import { Web3Button } from '@web3modal/react'
import "./Nav.css";

function Nav() {
  return (
    <div className="nav">
      <div className="top-left">
        <p>Asset Link</p>
      </div>
      <div className="top-right">
        <Web3Button />
      </div>
    </div>
  );
}

export default Nav;
