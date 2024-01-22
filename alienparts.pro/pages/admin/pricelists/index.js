import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faDatabase, faFileArrowDown, faFileArrowUp,
  faFileInvoiceDollar, faFileZipper
} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";
import LdButton from "@/components/LdButton";
import LdSpace from "@/components/LdSpace";

const PriceLists = () => (
  <>
    <LdHead/>
    <LdTitle><FontAwesomeIcon icon={faFileInvoiceDollar}/> Прайс-листы</LdTitle>
    <div className={'content-center-buttons'}>
      <LdButton link={'/admin/pricelists/import'}><FontAwesomeIcon icon={faFileArrowDown}/> Импорт прайс-листов</LdButton>
      <LdButton link={'/admin/pricelists/export'}><FontAwesomeIcon icon={faFileArrowUp}/> Экспорт прайс-листов</LdButton>
      <LdButton link={'/admin/pricelists/sources'}><FontAwesomeIcon icon={faDatabase}/> Источники данных</LdButton>
      <LdSpace height={20}/>
      <LdButton link={'https://alienparts.ru/archivepricelists'}><FontAwesomeIcon icon={faFileZipper}/> Архивные прайс-листы</LdButton>
    </div>
  </>
)

export default PriceLists;