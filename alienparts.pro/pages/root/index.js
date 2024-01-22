import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faScrewdriverWrench, faUsers} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";
import LdButton from "@/components/LdButton";

const RootPanel = () => (
  <>
    <LdHead/>
    <LdTitle><FontAwesomeIcon icon={faScrewdriverWrench}/> Root-панель</LdTitle>
    <div className={'content-center-buttons'}>
      <LdButton link={'/root/users'}><FontAwesomeIcon icon={faUsers}/> Пользователи</LdButton>
    </div>
  </>
)

export default RootPanel;