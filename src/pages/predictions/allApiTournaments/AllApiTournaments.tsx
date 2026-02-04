import React from 'react';
import { useNavigate } from 'react-router';

import { FootballCompetitionApi } from '@/pages/predictions/models/models';

import * as styles from './AllApiTournaments.module.scss';

interface Props {
  competitions: FootballCompetitionApi[];
}

const AllApiTournaments = ({ competitions }: Props) => {
  const navigate = useNavigate();

  if (!competitions.length) return <p>No data to show</p>;

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th colSpan={2}>Competition</th>
            <th colSpan={3}>Season</th>
          </tr>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>ID</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {competitions.map((competition) => (
            <tr
              key={competition.id}
              onClick={() => navigate('/predictions/competition/' + competition.id)}
            >
              <td className={styles.nameCell}>{competition.name}</td>
              <td>{competition.id}</td>
              <td>{competition.currentSeason.id}</td>
              <td className={styles.monoCell}>{competition.currentSeason.startDate}</td>
              <td className={styles.monoCell}>{competition.currentSeason.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllApiTournaments;
