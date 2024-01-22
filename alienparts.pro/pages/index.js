import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCar, faCogs, faUserSecret} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";

const Index = () => (
  <>
    <LdHead/>
    <LdTitle><FontAwesomeIcon icon={faCar}/> Интернет-магазин автозапчастей</LdTitle>

    <p>Наш интернет-магазин осуществляет поставку запасных частей для автомобилей иностранного производства.
      На данный момент это: Acura, BMW, Сhrysler, Ford, GM, Honda, Hyundai, Infiniti, Isuzu, Kia, Land Rover,
      Lexus, Mazda, Mercedes, Mitsubishi, Nissan, Opel, Saab, Subaru, Suzuki, Toyota, Volkswagen, Volvo и др.
      А также запчасти и расходные материалы для большинства мотоциклов, квадроциклов и скутеров различных
      рынков: BRP, Honda moto, Kawasaki, Polaris, Suzuki moto, Yamaha и др.</p>

    <p>Главным направлением для нас является поставка оригинальных деталей для автомобилей японского и
      американского рынка. Запасные части поставляются как с зарубежных складов, находящихся в Японии, ОАЭ,
      Германии и США, так и со складов партнёров в Москве.</p>

    <div className="title-small">
      <FontAwesomeIcon icon={faCogs} size='2x'/><br/>
      На сайте ведутся технические работы.<br/>
      По всем вопросам писать на <a href="mailto:office@alienparts.pro">office@alienparts.pro</a>
    </div>
  </>
)

export default Index;