import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt, faUnlockAlt, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import LdButton from "@/components/LdButton";
import {useState} from "react";
import LdSpace from "@/components/LdSpace";
import LdApiRequest from "@/utils/LdApiRequest";
import LdLoader from "@/components/LdLoader";
import {useRouter} from "next/router";
import {useLdAppContext} from "@/utils/LdAppProvider";

const LdFormLogin = () => {

  const {getUser, handleLogin, addNotification} = useLdAppContext();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const clickLogin = async (e) => {
    e.preventDefault();

    const apiRequestLogin = new LdApiRequest('auth', 'login');

    setIsLoading(true);
    const response = await apiRequestLogin.request(getUser(), {login: login, password: btoa(password)});
    setIsLoading(false);

    if (response.status === 1) {
      if (response.data.state === 1) {
        handleLogin(response.data.user);
        await router.push('/profile');
        addNotification('Вы успешно авторизованы!');
      } else addNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addNotification(`Ошибка запроса: ${response.error}`);
  }

  return (
    <>
      <form onSubmit={clickLogin} className="auth-form">
        <label htmlFor="af-login">Логин</label>
        <input type="text" id="af-login" placeholder="Введите логин или e-mail..." onChange={(e) => setLogin(e.target.value)} required/>
        <label htmlFor="af-password">Пароль</label>
        <input type="password" id="af-password" placeholder="Введите пароль..." onChange={(e) => setPassword(e.target.value)} required/>
        <LdSpace height={20}/>
        <button type="submit"><FontAwesomeIcon icon={faSignInAlt}/> Войти</button>
        <LdSpace height={50}/>
        <LdButton link="?action=registration"><FontAwesomeIcon icon={faUserPlus}/> Регистрация</LdButton>
        <LdButton link="?action=restore"><FontAwesomeIcon icon={faUnlockAlt}/> Восстановление</LdButton>
        <LdSpace height={50}/>
      </form>

      <LdLoader loading={isLoading}/>
    </>
  );
};

export default LdFormLogin;