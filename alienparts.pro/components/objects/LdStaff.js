import LdTableButton from "@/components/LdTableButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMaximize} from "@fortawesome/free-solid-svg-icons";

const LdStaff = ({staff, show}) => {

  const click = () => show(Number(staff.id));

  return (
    <tr>
      <td>{staff.id}</td>
      <td>{staff.email}</td>
      <td>{staff.surname} {staff.name} {staff.patronymic}</td>
      <td>{staff.job_title}</td>
      <td>{staff.note}</td>
      <td><LdTableButton click={click}><FontAwesomeIcon icon={faMaximize}/></LdTableButton></td>
    </tr>
  );
};

export default LdStaff;