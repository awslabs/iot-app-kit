import React from 'react';

import './tree.scss';

export interface TreeProps extends React.ComponentPropsWithoutRef<'ol'> {}

const Tree = React.forwardRef<HTMLOListElement, TreeProps>(({ children, className = '', ...props }: TreeProps, ref) => {
  return (
    <ol ref={ref} role='tree' className={`tm-tree ${className}`.trim()} {...props}>
      {children}
    </ol>
  );
});

Tree.displayName = 'Tree';

export default Tree;
