import { forwardRef } from 'react';
import './tree.scss';

export type TreeProps = React.ComponentPropsWithoutRef<'ol'>;

const Tree = forwardRef<HTMLOListElement, TreeProps>(({ children, className = '', ...props }: TreeProps, ref) => {
  return (
    <ol ref={ref} role='tree' className={`tm-tree ${className}`.trim()} {...props}>
      {children}
    </ol>
  );
});

Tree.displayName = 'Tree';

export default Tree;
