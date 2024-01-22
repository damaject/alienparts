
const LdSpace = ({height, width}) => {
  if (height != null) return <div style={{height: `${height}px`}}></div>
  if (width != null) return <div style={{width: `${width}px`, display: `inline-block`}}></div>
};

export default LdSpace;