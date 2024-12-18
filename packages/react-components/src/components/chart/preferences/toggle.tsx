import Button from '@cloudscape-design/components/button';

export const PreferencesModalToggle = ({ onShow }: { onShow: () => void }) => {
  return (
    <div style={{ position: 'absolute', right: 26, top: 34 }}>
      <Button iconName='ellipsis' variant='icon' onClick={onShow} />
    </div>
  );
};
