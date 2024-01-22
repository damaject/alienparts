import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMaximize} from "@fortawesome/free-solid-svg-icons";
import LdTableButton from "@/components/LdTableButton";

const LdImport = ({list, show}) => {

  const click = () => show(Number(list.id));

  return (
    <tr>
      <td>{list.id}</td>
      <td>{list.name}</td>
      <td>{list.contractor_name}</td>
      <td>{list.source_name} ({list.source_type_name})</td>
      <td>{list.last_export_time} ({list.duration}с.)</td>
      <td>{list.now_rows} ({list.now_rows - list.last_rows})</td>
      <td>{list.note}</td>
      <td><LdTableButton click={click}><FontAwesomeIcon icon={faMaximize}/></LdTableButton></td>
    </tr>
  );
};

export default LdImport;