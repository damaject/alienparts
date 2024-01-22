
const LdLoader = ({loading, isMini}) => {
  if (!loading) return null;
  if (isMini === undefined) isMini = false;

  return (
    <div className={`${isMini ? 'loader-mini' : 'loader'} ${loading ? 'loader-active' : ''}`}>
      <div className="loader-content">
        <div className="loader-cube"></div>
        <div className="loader-cube"></div>
        <div className="loader-cube"></div>
        <div className="loader-cube"></div>
        <div className="loader-cube"></div>
        <div className="loader-cube"></div>
        <div className="loader-cube"></div>
        <div className="loader-cube"></div>
        <div className="loader-cube"></div>
        <div className="loader-cube"></div>
      </div>
    </div>
  );
};

export default LdLoader;