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
    <div className={`tableWrapper ${styles.tableWrapper}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            {/*<th>ID</th>*/}
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tournament, idx) => (
            <tr key={idx}>
              {/*<td>{tournament.external_id}</td>*/}
              {/* Tournament external name */}
              <td data-label="Name">{tournament.name}</td>
              <td data-label="Start">{tournament.currentSeason?.start_date}</td>
              <td data-label="End">{tournament.currentSeason?.end_date}</td>
              <td data-label="Actions">
                <button
                  className={'tableButtonPrimary'}
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
    </div>
  );
};

export default AvailablePredictionTable;
