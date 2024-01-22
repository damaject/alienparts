import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartPie} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";

const Analytics = () => (
  <>
    <LdHead/>
    <LdTitle><FontAwesomeIcon icon={faChartPie}/> Аналитика</LdTitle>
  </>
)

export default Analytics;