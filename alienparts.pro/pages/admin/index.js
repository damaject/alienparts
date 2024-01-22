import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBook, faChartPie,
  faDesktop,
  faFileInvoice,
  faFileInvoiceDollar,
  faHandshakeSimple, faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";
import LdButton from "@/components/LdButton";
import {faPeopleRoof} from "@fortawesome/free-solid-svg-icons/faPeopleRoof";
import LdSpace from "@/components/LdSpace";

const AdminPanel = () => (
  <>
    <LdHead/>
    <LdTitle><FontAwesomeIcon icon={faDesktop}/> Админ-панель</LdTitle>
    <div className={'content-center-buttons'}>
      <LdButton link={'/admin/company'}><FontAwesomeIcon icon={faPeopleRoof}/> Наша компания</LdButton>
      <LdButton link={'/admin/staff'}><FontAwesomeIcon icon={faPeopleGroup}/> Сотрудники</LdButton>
      <LdButton link={'/admin/contractors'}><FontAwesomeIcon icon={faHandshakeSimple}/> Контрагенты</LdButton>
      <LdButton link={'/admin/pricelists'}><FontAwesomeIcon icon={faFileInvoiceDollar}/> Прайс-листы</LdButton>
      <LdSpace height={20}/>
      <LdButton link={'/admin/orders'}><FontAwesomeIcon icon={faFileInvoice}/> Заказы</LdButton>
      <LdButton link={'/admin/analytics'}><FontAwesomeIcon icon={faChartPie}/> Аналитика</LdButton>
      <LdButton link={'/admin/logs'}><FontAwesomeIcon icon={faBook}/> Журнал событий</LdButton>
    </div>
  </>
)

export default AdminPanel;