import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserSecret} from "@fortawesome/free-solid-svg-icons";
import LdFormLogin from "@/components/forms/LdFormLogin";
import LdFormRegistration from "@/components/forms/LdFormRegistration";
import LdFormRestore from "@/components/forms/LdFormRestore";
import LdTitle from "@/components/LdTitle";
import {useEffect} from "react";
import {useLdAppContext} from "@/utils/LdAppProvider";

export const getServerSideProps = async ({query}) => {
  const {action} = query;

  const isLogin = (action === 'login');
  const isRestore = (action === 'restore');
  const isRegistration = (action === 'registration');

  if (!(isLogin || isRestore || isRegistration))
    return {redirect: {destination: '/auth?action=login', permanent: false}};

  return {props: {action: {isLogin: isLogin, isRestore: isRestore, isRegistration: isRegistration}}}
};

const Auth = ({action}) => {

  const {handleLogout} = useLdAppContext();

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <>
      <LdHead/>
      <LdTitle><FontAwesomeIcon icon={faUserSecret}/> Авторизация</LdTitle>
      {action.isLogin && <LdFormLogin/>}
      {action.isRegistration && <LdFormRegistration/>}
      {action.isRestore && <LdFormRestore/>}
    </>
  );
};

export default Auth;