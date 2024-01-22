import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMaximize} from "@fortawesome/free-solid-svg-icons";
import LdTableButton from "@/components/LdTableButton";

const LdSource = ({source, show}) => {

  const click = () => show(Number(source.id));

  return (
    <tr>
      <td>{source.id}</td>
      <td>{source.name}</td>
      <td>{source.contractor_name}</td>
      <td>{source.type_name}</td>
      <td>{source.note}</td>
      <td><LdTableButton click={click}><FontAwesomeIcon icon={faMaximize}/></LdTableButton></td>
    </tr>
  );
};

export default LdSource;