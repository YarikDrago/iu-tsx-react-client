import React, { FormEvent, useEffect } from 'react';
import { useParams } from 'react-router';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [isvalid, setIsValid] = React.useState(false);
  const [tokenIsValid, setTokenIsValid] = React.useState(false);

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    validateForm();
  }, [password, repeatPassword]);

  async function checkToken() {
    try {
      appData.showLoader();
      await universalFetchRequest('auth/reset-password/verify', HTMLRequestMethods.POST, {
        token: token,
      });
      setTokenIsValid(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      console.log('Click');
      setError('');
      appData.showLoader();
      await universalFetchRequest('auth/reset-password', HTMLRequestMethods.POST, {
        token: token,
        password: password,
      });
      setSuccess(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  };

  function validateForm() {
    if (password.length === 0 || repeatPassword.length === 0) setIsValid(false);
    if (password !== repeatPassword) setIsValid(false);
    setIsValid(true);
  }

  return (
    <section>
      <form action="" onSubmit={handleSubmit}>
        {success ? (
          <p>Password was reset successfully</p>
        ) : (
          <>
            {tokenIsValid && (
              <>
                <p>Password</p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setError('');
                    setPassword(e.target.value);
                  }}
                />
                <p>Repeat password</p>
                <input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => {
                    setError('');
                    setRepeatPassword(e.target.value);
                  }}
                />
                <button type={'submit'} disabled={!isvalid}>
                  Reset
                </button>
              </>
            )}

            {error && <p>{error}</p>}
          </>
        )}
      </form>
    </section>
  );
};

export default ResetPassword;
