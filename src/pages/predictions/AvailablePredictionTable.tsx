import React from 'react';

import appData from '@/app.data';
import { Predictions } from '@/pages/predictions/Predictions';

import * as styles from './AvailablePredictionTable.module.scss';

interface AvailablePredictionTableProps {
  data: Predictions[];
}

const AvailablePredictionTable = ({ data }: AvailablePredictionTableProps) => {
  function createGroup(competition: Predictions) {
    appData.group.show({
      isNew: true,
      competition,
    });
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Start</th>
          <th>End</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((tournament, idx) => (
          <tr key={idx}>
            <td>{tournament.external_id}</td>
            {/* Tournament external name */}
            <td>{tournament.name}</td>
            <td>{tournament.currentSeason.start_date}</td>
            <td>{tournament.currentSeason.end_date}</td>
            <td>
              <button
                onClick={() => {
                  createGroup(tournament);
                }}
              >
                Create group
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AvailablePredictionTable;
