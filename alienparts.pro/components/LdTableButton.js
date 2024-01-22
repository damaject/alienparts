import Link from "next/link";

const LdButton = ({children, click}) => {
  if (click != null) return (<div className='table-button' onClick={click}><Link href=''>{children}</Link></div>);
};

export default LdButton;