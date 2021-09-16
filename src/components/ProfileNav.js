import { faCrow, faDove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
const ProfileNav = ({userObj}) => {
    return (
        <nav>
            <ul className="navList">
                <li><Link to='/'><FontAwesomeIcon className="faDove" icon={faDove}/></Link></li>
                {userObj && <li><Link className="bold" to='/profile'>{userObj.displayName}</Link><sapn>님 이름을 변경할 수 있습니다.</sapn></li>}

            </ul>
        </nav>
        );
}
export default ProfileNav;
