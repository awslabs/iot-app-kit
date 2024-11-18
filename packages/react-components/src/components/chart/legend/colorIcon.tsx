import './colorIcon.css';

export const ColorIcon = ({ color }: { color?: string }) => (
  <div className='color-icon-container'>
    <div
      className='color-icon'
      style={{
        backgroundColor: color,
      }}
    />
  </div>
);
