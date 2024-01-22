
const LdDialog = ({isOpen, onClose, children}) => {
  if (!isOpen) return null;

  return (
    <div className="dialog">
      <div className="dialog-content">
        {onClose !== false && <span className="close" onClick={onClose}>&times;</span>}
        {children}
      </div>
    </div>
  );
};

export default LdDialog;