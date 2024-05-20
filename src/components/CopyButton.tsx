import Copy from '@/icons/Copy';
import Tick from '@/icons/Tick';
import { Button, ButtonProps } from '@nextui-org/react';
import { useClipboard } from '@nextui-org/use-clipboard';

export default function CopyButton({
  className = '',
  size = 16,
  copyValue
}: {
  className?: string;
  size?: number;
  copyValue?: string;
}) {
  const { copy, copied } = useClipboard();
  return (
    <Button
      isIconOnly
      className={' ' + className}
      variant='light'
      radius='sm'
      disableAnimation
      onPress={() => copy(copyValue)}
    >
      <Tick className={!copied ? 'hidden' : ''}  size={size}></Tick>
      <Copy className={copied ? 'hidden' : ''} size={size}></Copy>
    </Button>
  );
}
