import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LdTitle from "@/components/LdTitle";
import {faPeopleRoof} from "@fortawesome/free-solid-svg-icons/faPeopleRoof";

const Company = () => (
  <>
    <LdHead/>
    <LdTitle><FontAwesomeIcon icon={faPeopleRoof}/> Наша компания</LdTitle>
    <div className={'content-center-buttons'}>
      <div>Название: AlienParts</div>
      <div>Юридическое название: ООО «Алиен-Партс»</div>
    </div>
  </>
)

export default Company;