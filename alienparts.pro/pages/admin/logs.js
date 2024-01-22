import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";

const Logs = () => (
  <>
    <LdHead/>
    <LdTitle><FontAwesomeIcon icon={faBook}/> Журнал событий</LdTitle>
  </>
)

export default Logs;