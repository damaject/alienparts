import LdTableButton from "@/components/LdTableButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMaximize} from "@fortawesome/free-solid-svg-icons";

const LdContractor = ({contractor, show}) => {

  const click = () => show(Number(contractor.id));

  let type = '';
  if (contractor.buyer === '1' && contractor.supplier === '1') type = 'Покупатель и поставщик';
  else if (contractor.buyer === '1') type = 'Покупатель';
  else if (contractor.supplier === '1') type = 'Поставщик';

  return (
    <tr>
      <td>{contractor.id}</td>
      <td>{contractor.code}</td>
      <td>{contractor.name}</td>
      <td>{contractor.legal_name}</td>
      <td>{type}</td>
      <td>{contractor.note}</td>
      <td><LdTableButton click={click}><FontAwesomeIcon icon={faMaximize}/></LdTableButton></td>
    </tr>
  );
};

export default LdContractor;