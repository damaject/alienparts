import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faEnvelopeOpenText,
  faSignInAlt, faSquareCheck, faSquareXmark,
  faUnlockAlt,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import LdButton from "@/components/LdButton";
import LdSpace from "@/components/LdSpace";
import LdDialog from "@/components/LdDialog";
import LdTitle from "@/components/LdTitle";
import LdApiRequest from "@/utils/LdApiRequest";
import LdLoader from "@/components/LdLoader";
import {useLdAppContext} from "@/utils/LdAppProvider";
import {useRouter} from "next/router";

const LdFormRestore = () => {

  const router = useRouter();

  const {getUser, addNotification, addDialogNotification} = useLdAppContext();

  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const clickCancel = () => {
    setCode('');
    setEmail('');
    closeDialog();
  }

  const onCodeInput = (e) => setCode(e.target.value.replace(/\D/g, ''));

  const clickRestore = async (e) => {
    e.preventDefault();

    const apiRequestRestore = new LdApiRequest('auth', 'restore');

    setIsLoading(true);
    const response = await apiRequestRestore.request(getUser(), {step: 'init', email: email});
    setIsLoading(false);

    if (response.status === 1) {
      if (response.data.state === 1) {
        setCode('');
        setPassword('');
        setPassword2('');
        openDialog();
      } else addNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addNotification(`Ошибка запроса: ${response.error}`);
  }

  const clickConfirmCode = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      addDialogNotification('Пароли не совпадают!');
      return;
    }

    const apiRequestRestore = new LdApiRequest('auth', 'restore');

    setIsLoading(true);
    const response = await apiRequestRestore.request(getUser(), {step: 'confirm', email: email,
      password: btoa(password), code: code});
    setIsLoading(false);

    if (response.status === 1) {
      if (response.data.state === 1) {
        closeDialog();
        await router.push('/auth');
        addNotification('Пароль успешно изменен!');
      } else addDialogNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addDialogNotification(`Ошибка запроса: ${response.error}`);
  }

  return (
    <>
      <form onSubmit={clickRestore} className="auth-form">
        <label htmlFor="af-email">Адрес электронной почты</label>
        <input type="email" id="af-email" placeholder="Введите e-mail..." value={email} onChange={(e) => setEmail(e.target.value)} required/>
        <LdSpace height={20}/>
        <button type="submit"><FontAwesomeIcon icon={faUnlockAlt}/> Восстановить</button>
        <label>На e-mail придет письмо с кодом для восстановления доступа.</label>
        <LdSpace height={50}/>
        <LdButton link="?action=login"><FontAwesomeIcon icon={faSignInAlt}/> Вход</LdButton>
        <LdButton link="?action=registration"><FontAwesomeIcon icon={faUserPlus}/> Регистрация</LdButton>
        <LdSpace height={50}/>
      </form>

      <LdDialog isOpen={isDialogOpen} onClose={false}>
        <LdTitle><FontAwesomeIcon icon={faEnvelopeOpenText}/> Подтверждение</LdTitle>
        <form onSubmit={clickConfirmCode} className="code-form">
          <label>Код отправлен на почту <b>{email}</b>, введите его и задайте новый пароль для восстановления доступа.</label>
          <LdSpace height={10}/>
          <input type="text" id="cf-code" className="code-input" value={code} placeholder="XXXXXX" maxLength="6" onInput={onCodeInput} required/>
          <LdSpace height={20}/>

          <label>Новый пароль</label>
          <input type="password" value={password} placeholder="Введите пароль..." maxLength="100" onChange={(e) => setPassword(e.target.value)}/>
          <label>Подтверждение пароля</label>
          <input type="password" value={password2} placeholder="Введите пароль ещё раз..." maxLength="100" onChange={(e) => setPassword2(e.target.value)}/>

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

export default LdFormRestore;