import React, { FormEvent, useEffect } from 'react';
import { useParams } from 'react-router';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

import * as styles from './ResetPassword.module.scss';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [isvalid, setIsValid] = React.useState(false);

  useEffect(() => {
    validateForm();
  }, [password, repeatPassword]);

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
    <section className={styles.container}>
      <form className={styles.form} action="" onSubmit={handleSubmit}>
        {success ? (
          <p>Password was reset successfully</p>
        ) : (
          <>
            <>
              <p>Password</p>
              <input
                type="password"
                value={password}
                placeholder={'Password'}
                onChange={(e) => {
                  setError('');
                  setPassword(e.target.value);
                }}
              />
              <p>Repeat password</p>
              <input
                type="password"
                value={repeatPassword}
                placeholder={'Repeat password'}
                onChange={(e) => {
                  setError('');
                  setRepeatPassword(e.target.value);
                }}
              />
              <button className={styles.submitButton} type={'submit'} disabled={!isvalid}>
                Reset
              </button>
            </>
            {error && <p className={styles.errorMsg}>{error}</p>}
          </>
        )}
      </form>
    </section>
  );
};

export default ResetPassword;
