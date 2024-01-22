import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";
import {useRouter} from "next/router";

export const getServerSideProps = async ({query}) => {
  let {part} = query;

  part = String(part).replace(/[ ,.\t-]/g, '');

  return {props: {part: part}}
};

const Search = ({part}) => {
  // const router = useRouter();
  // let {part} = router.query;

  return (
    <>
      <LdHead/>
      <LdTitle><FontAwesomeIcon icon={faSearch}/> Поиск «{part}»</LdTitle>
    </>
  );
};

export default Search;