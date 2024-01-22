import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDesktop, faScrewdriverWrench, faSignOutAlt, faUserTie} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";
import LdButton from "@/components/LdButton";
import {useRouter} from "next/router";
import {useLdAppContext} from "@/utils/LdAppProvider";
import {useEffect} from "react";
import LdSpace from "@/components/LdSpace";

export const getServerSideProps = async () => {
  // const response = await fetch('https://api.alienparts.pro/ping.php');
  const data = 'debug'; //await response.text();

  return {props: {data: data}}
};

const Profile = ({data}) => {
  const router = useRouter();

  const {getUser} = useLdAppContext();

  useEffect(() => {
    if (getUser() == null) router.push('/auth');
  }, []);

  return (
    <>
      <LdHead/>
      <LdTitle><FontAwesomeIcon icon={faUserTie}/> Профиль</LdTitle>



      <div className={'content-center-buttons'}>
        {getUser() != null && (
          <>
            <div>ID: {getUser().id}</div>
            <div>Логин: {getUser().login}</div>
            <div>Почта: {getUser().email}</div>
            <div>ФИО: {getUser().name} {getUser().surname} {getUser().patronymic}</div>
          </>
        )}
        <LdSpace height={20}/>
        {getUser() != null && <LdButton link={'/admin'}><FontAwesomeIcon icon={faDesktop}/> Админ-панель</LdButton>}
        {getUser() != null && <LdButton link={'/root'}><FontAwesomeIcon icon={faScrewdriverWrench}/> Root-панель</LdButton>}
        <LdSpace height={40}/>
        {getUser() != null && <LdButton link={'/auth'}><FontAwesomeIcon icon={faSignOutAlt}/> Выход</LdButton>}
      </div>
    </>
  );
};

export default Profile;