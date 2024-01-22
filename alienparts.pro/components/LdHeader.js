import Link from "next/link";
import {faSearch, faSignInAlt, faUserTie} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {useRouter} from "next/router";
import {useLdAppContext} from "@/utils/LdAppProvider";


const LdHeader = () => {
  const [part, setPart] = useState('');
  const router = useRouter();

  const {isLoggedIn, getUser, notifications, dialogNotifications} = useLdAppContext();

  const clickSearch = (e) => {
    e.preventDefault();
    router.push(`/search?part=${part}`);
    setPart('');
  }

  return (
    <header>
      <form onSubmit={clickSearch} className="search-form">
        <input type="text" id="search-part" placeholder="Введите номер запчасти..." value={part} onChange={(e) => setPart(e.target.value)} required/>
        <button type="submit" id="search-submit"><FontAwesomeIcon icon={faSearch}/> Найти</button>
      </form>
      <Link href='/' className='header-logo'><img src='/img/header_logo.png' alt='alienparts.pro'/></Link>

      <div className="simple-button header-button usn">
        {isLoggedIn ?
          (<Link href='/profile'><FontAwesomeIcon icon={faUserTie}/> {getUser().login}</Link>) :
          (<Link href='/auth'><FontAwesomeIcon icon={faSignInAlt}/> Войти</Link>)
        }
      </div>

      <div className="header-contact">
        <a href="tel:+79998886655">+7 (999) 888-66-55</a><br/>
        <a href="mailto:office@alienparts.pro">office@alienparts.pro</a>
      </div>
      <div className="header-info-block">
        {notifications.map(notification => (
          <div className='header-info' key={notification.id}>{notification.text}</div>
        ))}
      </div>
      <div className="header-info-dialog-block">
        {dialogNotifications.map(dialogNotification => (
          <div className='header-info' key={dialogNotification.id}>{dialogNotification.text}</div>
        ))}
      </div>
    </header>
  );
};

export default LdHeader;