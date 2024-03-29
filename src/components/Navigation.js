import { faCrow, faDove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
const Navigation = ({userObj}) => {
    return (
        <nav>
            <ul className="navList">
                <li><Link to='/'><FontAwesomeIcon className="faDove" icon={faDove}/></Link></li>
                {userObj && <li><Link className="bold" to='/profile'>{userObj.displayName}</Link><sapn>님 안녕하세요</sapn></li>}

            </ul>
        </nav>
        );
}
export default Navigation;
