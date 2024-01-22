import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faEnvelopeOpenText,
  faSignInAlt,
  faSquareCheck, faSquareXmark,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import LdButton from "@/components/LdButton";
import LdSpace from "@/components/LdSpace";
import {useState} from "react";
import LdApiRequest from "@/utils/LdApiRequest";
import LdLoader from "@/components/LdLoader";
import {useLdAppContext} from "@/utils/LdAppProvider";
import LdTitle from "@/components/LdTitle";
import LdDialog from "@/components/LdDialog";
import {useRouter} from "next/router";

const LdFormRegistration = () => {

  const router = useRouter();

  const {getUser, addNotification, addDialogNotification, handleLogin} = useLdAppContext();

  const [code, setCode] = useState('');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const clickCancel = () => closeDialog();

  const onCodeInput = (e) => setCode(e.target.value.replace(/\D/g, ''));

  const clickRegistration = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      addNotification('Пароли не совпадают!');
      return;
    }

    const apiRequestRegistration = new LdApiRequest('auth', 'registration');

    setIsLoading(true);
    const response = await apiRequestRegistration.request(getUser(), {step: 'init', login: login, email: email,
      password: btoa(password), name: name, surname: surname, patronymic: patronymic});
    setIsLoading(false);

    if (response.status === 1) {
      if (response.data.state === 1) {
        setCode('');
        openDialog();
      } else addNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addNotification(`Ошибка запроса: ${response.error}`);
  }

  const clickConfirmCode = async (e) => {
    e.preventDefault();

    const apiRequestRegistration = new LdApiRequest('auth', 'registration');

    setIsLoading(true);
    const response = await apiRequestRegistration.request(getUser(), {step: 'confirm', login: login, email: email,
      password: btoa(password), name: name, surname: surname, patronymic: patronymic, code: code});
    setIsLoading(false);

    if (response.status === 1) {
      if (response.data.state === 1) {
        closeDialog();
        handleLogin(response.data.user);
        await router.push('/profile');
        addNotification('Вы успешно зарегистрированы!');
      } else addDialogNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addDialogNotification(`Ошибка запроса: ${response.error}`);
  }

  return (
    <>
      <form onSubmit={clickRegistration} className="auth-form">
        <label htmlFor="af-name">Имя</label>
        <input type="text" id="af-name" placeholder="Введите имя..." onChange={(e) => setName(e.target.value)} required/>
        <label htmlFor="af-surname">Фамилия</label>
        <input type="text" id="af-surname" placeholder="Введите фамилию..." onChange={(e) => setSurname(e.target.value)} required/>
        <label htmlFor="af-patronymic">Отчество</label>
        <input type="text" id="af-patronymic" placeholder="Введите отчество..." onChange={(e) => setPatronymic(e.target.value)}/>
        <label htmlFor="af-login">Логин</label>
        <input type="text" id="af-login" placeholder="Введите логин..." onChange={(e) => setLogin(e.target.value)} required/>
        <label htmlFor="af-email">Адрес электронной почты</label>
        <input type="email" id="af-email" placeholder="Введите e-mail..." onChange={(e) => setEmail(e.target.value)} required/>
        <label htmlFor="af-password">Пароль</label>
        <input type="password" id="af-password" placeholder="Введите пароль..." onChange={(e) => setPassword(e.target.value)} required/>
        <label htmlFor="af-password2">Подтверждение пароля</label>
        <input type="password" id="af-password2" placeholder="Введите пароль ещё раз..." onChange={(e) => setPassword2(e.target.value)} required/>
        <LdSpace height={20}/>
        <button type="submit"><FontAwesomeIcon icon={faUserPlus}/> Зарегистрироваться</button>
        <LdSpace height={50}/>
        <LdButton link="?action=login"><FontAwesomeIcon icon={faSignInAlt}/> Вход</LdButton>
        <LdSpace height={50}/>
      </form>

      <LdDialog isOpen={isDialogOpen} onClose={false}>
        <LdTitle><FontAwesomeIcon icon={faEnvelopeOpenText}/> Подтверждение</LdTitle>
        <form onSubmit={clickConfirmCode} className="code-form">
          <label>Код отправлен на почту <b>{email}</b>, введите его для подтверждения почты.</label>
          <LdSpace height={10}/>
          <input type="text" id="cf-code" className="code-input" placeholder="XXXXXX" maxLength="6" value={code} onInput={onCodeInput} required/>
          <LdSpace height={20}/>
          <button type="submit"><FontAwesomeIcon icon={faSquareCheck}/> Подтвердить</button>
          <LdSpace height={50}/>
          <button onClick={clickCancel}><FontAwesomeIcon icon={faSquareXmark}/> Отмена</button>
        </form>
      </LdDialog>

      <LdLoader loading={isLoading}/>
    </>
  );
};

export default LdFormRegistration;