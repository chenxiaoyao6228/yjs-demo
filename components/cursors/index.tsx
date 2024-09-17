
import React from 'react';
import { UserAwareness } from '../../app/apps/todo/store';

interface CursorsProps {
  cursors: UserAwareness[];
}

const Cursors: React.FC<CursorsProps> = ({ cursors }) => {
  return (
    <>
      {cursors.map((cursor) => (
        <div
          key={cursor.clientId}
          style={{
            position: 'absolute',
            left: cursor.cursor?.x,
            top: cursor.cursor?.y,
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon fill={cursor.color} points="8.2,20.9 8.2,4.9 19.8,16.5 13,16.5 12.6,16.6" />
            <polygon fill={cursor.color} points="17.3,21.6 13.7,23.1 9,12 12.7,10.5" />
            <rect x="12.5" y="13.6" transform="matrix(0.9221 -0.3871 0.3871 0.9221 -5.7605 6.5909)" width="2" height="8" fill={cursor.color} />
            <polygon fill={cursor.color} points="9.2,7.3 9.2,18.5 12.2,15.6 12.6,15.5 17.4,15.5" />
          </svg>
          <span style={{ backgroundColor: cursor.color, color: 'white', padding: '2px 4px', borderRadius: '2px', marginLeft: '4px' }}>
            {cursor.name}
          </span>
        </div>
      ))}
    </>
  );
};

export default Cursors;