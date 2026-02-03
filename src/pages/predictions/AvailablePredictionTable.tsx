import React from 'react';

import { Predictions } from '@/pages/predictions/Predictions';

import * as styles from './AvailablePredictionTable.module.scss';

interface AvailablePredictionTableProps {
  data: Predictions[];
}

const AvailablePredictionTable = ({ data }: AvailablePredictionTableProps) => {
  return (
    <table className={styles.table}>
      <tbody>
        {data.map((tournament, idx) => (
          <tr key={idx}>
            <td>{tournament.name}</td>
            <td
              className={[
                styles.status,
                tournament.isActive ? styles.active : styles.inactive,
              ].join(' ')}
            >
              {tournament.isActive ? 'Active' : 'Inactive'}
            </td>
            <td>
              <button>Add new</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AvailablePredictionTable;
