import React from 'react';

import appData from '@/app.data';
import { Competition } from '@/pages/predictions/models/competition.dto';
import { Season } from '@/pages/predictions/models/season.dto';

import * as styles from './AvailablePredictionTable.module.scss';

interface AvailablePredictionTableProps {
  data: Competition[];
}

const AvailablePredictionTable = ({ data }: AvailablePredictionTableProps) => {
  function createGroup(competition: Competition) {
    if (!competition.currentSeason) return;
    const season: Season = {
      id: -1,
      external_id: competition.currentSeason.id,
      start_date: competition.currentSeason.start_date,
      end_date: competition.currentSeason.end_date,
    };
    appData.group.show({
      isNew: true,
      competition,
      season,
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
            <td>{tournament.currentSeason?.start_date}</td>
            <td>{tournament.currentSeason?.end_date}</td>
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
