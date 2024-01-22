import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWarning} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Index = () => (
  <>
    <LdHead/>
    <div className="title"><FontAwesomeIcon icon={faWarning}/> 404</div>
    <div className="title-small">
      Ошибочка вышла, страница не найдена...<br/>
      Вернуться на <Link href='/'>главную</Link>
    </div>
  </>
)

export default Index;