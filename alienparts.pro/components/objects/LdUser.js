import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMaximize} from "@fortawesome/free-solid-svg-icons";
import LdTableButton from "@/components/LdTableButton";

const LdUser = ({user, show}) => {

  const click = () => show(Number(user.id));

  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.login}</td>
      <td>{user.email}</td>
      <td>{user.surname} {user.name} {user.patronymic}</td>
      <td>{user.last_activity_time}</td>
      <td>{user.registration_time}</td>
      <td>{user.note}</td>
      <td><LdTableButton click={click}><FontAwesomeIcon icon={faMaximize}/></LdTableButton></td>
    </tr>
  );
};

export default LdUser;