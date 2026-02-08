import React from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react';

import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { FootballCompetitionApi } from '@/pages/predictions/models/models';
import OnOffButton from '@/shared/components/OnOffButton/OnOffButton';

import * as styles from './AllApiTournaments.module.scss';

interface Props {
  competitions: FootballCompetitionApi[];
}

const AllApiTournaments = ({ competitions }: Props) => {
  const navigate = useNavigate();

  if (!competitions.length) return <p>No data to show</p>;

  async function addCompetition(id: number) {
    try {
      const response = await universalFetchRequest('tournaments/add', HTMLRequestMethods.POST, {
        competitionId: id,
      });
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteCompetition(id: number) {
    try {
      const response = await universalFetchRequest(
        `tournaments/${id}`,
        HTMLRequestMethods.DELETE,
        {}
      );
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }

  async function updateCompetitionObservableStatus(competition: FootballCompetitionApi) {
    try {
      const isObservable = !competition.isObservable;
      const id = competition.id;
      const response = await universalFetchRequest(`tournaments/${id}`, HTMLRequestMethods.PATCH, {
        isObservable: isObservable,
      });
      console.log('Response:', response);
      // TODO change status
    } catch (e) {
      console.error(e);
    }
  }

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
            <th>In DB</th>
            <th>Is observable</th>
            <th>Actions</th>
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
              <td className={styles.monoCell}>{String(competition.inDb)}</td>
              <td className={[styles.monoCell].join(' ')}>
                <OnOffButton
                  isOn={competition.isObservable}
                  disabled={!competition.inDb}
                  className={[
                    styles.button,
                    competition.inDb ? (competition.isObservable ? styles.add : styles.delete) : '',
                  ].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCompetitionObservableStatus(competition);
                  }}
                />
              </td>
              <td className={[styles.monoCell, styles.action].join(' ')}>
                {competition.inDb ? (
                  <button
                    className={[styles.button, styles.delete].join(' ')}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCompetition(competition.id);
                    }}
                  >
                    X
                  </button>
                ) : (
                  <button
                    className={[styles.button, styles.add].join(' ')}
                    onClick={(e) => {
                      e.stopPropagation();
                      addCompetition(competition.id);
                    }}
                  >
                    {' '}
                    +{' '}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default observer(AllApiTournaments);
