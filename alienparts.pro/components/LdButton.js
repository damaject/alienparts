import Link from "next/link";

const LdButton = ({children, link, click}) => {
  if (link != null) return (<div className="main-button"><Link href={link}>{children}</Link></div>);
  if (click != null) return (<div className="main-button" onClick={click}><Link href=''>{children}</Link></div>);
};

export default LdButton;