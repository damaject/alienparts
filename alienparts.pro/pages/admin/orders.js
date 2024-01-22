import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileInvoice} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";

const Orders = () => (
  <>
    <LdHead/>
    <LdTitle><FontAwesomeIcon icon={faFileInvoice}/> Заказы</LdTitle>
  </>
)

export default Orders;