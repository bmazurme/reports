import type { ReactNode } from 'react';

import Sidebar from '../sidebar';

import style from './content.module.css';

type ContentProps = {
  sidebar: boolean;
  main?: ReactNode;
}

function Content({ sidebar, main }: ContentProps) {
  return (
    <div className={style.content}>
      {sidebar && <aside className={style.sidebar}>
        <Sidebar />
      </aside>}
      <div className={style.right}>
        <div className={style.body}>
          {main && <main className={style.main}>{main}</main>}
        </div>
      </div>
    </div>
  )
}

export default Content;
