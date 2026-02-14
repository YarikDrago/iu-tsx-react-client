import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { FootballCompetitionMatchesApi } from '@/pages/predictions/models/football_api.models';

import * as styles from './ApiCompetitionMatches.module.scss';

const ApiCompetitionMatches = () => {
  const { id } = useParams<{ id: string }>();
  const [competition, setCompetition] = React.useState<FootballCompetitionMatchesApi | null>(null);

  const competitionId = Number(id);

  async function getCompetitionData(id: number) {
    try {
      const data = await universalFetchRequest<FootballCompetitionMatchesApi>(
        `tournaments/api/competitions/${id}`,
        HTMLRequestMethods.GET,
        {}
      );
      setCompetition(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getCompetitionData(competitionId);
  }, []);

  if (!id || Number.isNaN(competitionId)) {
    return (
      <div>
        <h1>API competition</h1>
        <p>Invalid competition id</p>
      </div>
    );
  }

  return (
    <article>
      <div>
        {competition && (
          <>
            <h1>Competition: {competition.competition.name}</h1>
            <p>ID: {competition.competition.id}</p>
          </>
        )}
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Match ID</th>
            <th>Home</th>
            <th>Away</th>
            <th>Date</th>
            <th>Status</th>
            <th>Score Full</th>
            <th>Score Regular</th>
            <th>Score Extra</th>
            <th>Penalties</th>
          </tr>
        </thead>
        <tbody>
          {competition?.matches.map((match) => (
            <tr key={match.id}>
              <td>{match.id}</td>
              <td
                className={
                  match.score.winner === null
                    ? ''
                    : match.score.winner === 'DRAW'
                      ? styles.draw
                      : match.score.winner === 'HOME_TEAM'
                        ? styles.win
                        : styles.lose
                }
              >
                {match.homeTeam.name}
              </td>
              <td
                className={
                  match.score.winner === null
                    ? ''
                    : match.score.winner === 'DRAW'
                      ? styles.draw
                      : match.score.winner === 'AWAY_TEAM'
                        ? styles.win
                        : styles.lose
                }
              >
                {match.awayTeam.name}
              </td>
              <td>{match.utcDate}</td>
              <td>{match.status}</td>
              <td>
                {match.score.fullTime.home === null
                  ? ''
                  : `${match.score.fullTime.home}-${match.score.fullTime.away}`}
              </td>
              <td>
                {match.score.regularTime && match.score.regularTime.home !== null
                  ? `${match.score.regularTime.home}-${match.score.regularTime.away}`
                  : ''}
              </td>
              <td>
                {match.score.extraTime && match.score.extraTime.home !== null ? (
                  <>
                    <span>{match.score.extraTime.home}</span>
                    <span>-</span>
                    <span>{match.score.extraTime.away}</span>
                  </>
                ) : (
                  ''
                )}
              </td>
              <td>
                {match.score.penalties && match.score.penalties.home !== null
                  ? `${match.score.penalties.home}-${match.score.penalties.away}`
                  : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};

export default ApiCompetitionMatches;
