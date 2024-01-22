import Link from "next/link";

const LdButton = ({children, click}) => {
  if (click != null) return (<div className='table-mini-button' onClick={click}><Link href=''>{children}</Link></div>);
};

export default LdButton;