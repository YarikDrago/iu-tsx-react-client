import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

const JoinToGroup = () => {
  const [searchParams] = useSearchParams();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successStatus, setSuccessStatus] = React.useState<boolean>(false);

  // TODO auth user
  useEffect(() => {
    if (appData.nickname === '') {
      setErrorMsg('You should be logged in to join to group');
      return;
    }
    console.log('appData.nickname:', appData.nickname);
    joinToGroup();
  }, []);

  async function joinToGroup() {
    try {
      appData.showLoader();
      const code = searchParams.get('code'); // string | null
      if (!code) {
        throw new Error('Missing "code" in URL query');
      }
      console.log('code:', code);
      await universalFetchRequest(
        `tournaments/groups/join/?code=${code}`,
        HTMLRequestMethods.POST,
        {}
      );
      setSuccessStatus(true);
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  return (
    <div>
      <p>Join to group</p>
      {successStatus && (
        <p>
          Your request has been sent. After it is verified by the group owner, you will receive an
          email.
        </p>
      )}
      {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
};

export default observer(JoinToGroup);
