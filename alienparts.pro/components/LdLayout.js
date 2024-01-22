import LdHeader from "@/components/LdHeader";
import LdFooter from "@/components/LdFooter";

const LdLayout = ({children}) => (
  <>
    <LdHeader />
    <div className="content">{children}</div>
    <LdFooter />
  </>
);

export default LdLayout;