import React from 'react';
import { Link, useNavigate } from 'react-router';

import appData from '@/app.data';
import { login } from '@/function/api/login';
import { signup } from '@/function/api/signup';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import Loader2 from '@/shared/components/loaders/Loader2';

import * as styles from './AuthForm.module.scss';

interface Props {
  isRegistration?: boolean;
}

const AuthForm = ({ isRegistration = false }: Props) => {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [nickname, setNickname] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isLaoding, setIsLoading] = React.useState(false);
  const [successRegistration, setSuccessRegistration] = React.useState(false);
  const [forgotPassword, setForgotPassword] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setErrorMsg('');
      setIsLoading(true);
      if (isRegistration) {
        // const data = await signup(email, nickname, password);
        await signup(email, nickname, password);
        setSuccessRegistration(true);
        // TODO show info about success registration
        console.log('registration was successful');
      } else {
        await login(password, email).then((res) => {
          console.log('res:', res);
          appData.changeNickname(res.nickname || '');
          appData.role = res.roles;
          navigate('/');
        });
      }
    } catch (e) {
      setErrorMsg((e as Error).message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  async function sendResetPasswordRequest() {
    try {
      setErrorMsg('');
      appData.showLoader();
      await universalFetchRequest('auth/forgot-password', HTMLRequestMethods.POST, {
        email: email,
      });
    } catch (e) {
      setErrorMsg((e as Error).message || 'Something went wrong');
    } finally {
      appData.hideLoader();
    }
  }

  // function validateForm() {
  //   return email.length > 0 && password.length > 0;
  //   // TODO add check of email and nickname
  //   // TODO add more complex validation
  // }

  return (
    <form className={styles.form}>
      {!successRegistration ? (
        <>
          <h3>{isRegistration ? 'Create Your Account' : 'Welcome'}</h3>
          {isRegistration && (
            <>
              <p>Nickname</p>
              <input
                type="text"
                placeholder={'nickname'}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </>
          )}
          <p>Email</p>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setErrorMsg('');
              setEmail(e.target.value);
            }}
          />
          <p>Password</p>
          <input
            className={'border-2'}
            type="text"
            value={password}
            onChange={(e) => {
              setErrorMsg('');
              setPassword(e.target.value);
            }}
          />
          {isRegistration && (
            <>
              <p>Confirm password</p>
              <input
                type="text"
                value={repeatPassword}
                onChange={(e) => {
                  setErrorMsg('');
                  setRepeatPassword(e.target.value);
                }}
              />
            </>
          )}
          <button
            type="submit"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isLaoding}
          >
            {isLaoding ? <Loader2 /> : <p>Continue</p>}
          </button>
          <div className={'actions'}>
            {isRegistration ? (
              <p>
                Already have an account?{' '}
                <Link to={'/login'} className={styles.link}>
                  Log In
                </Link>
              </p>
            ) : (
              <>
                <div className={styles.line}>
                  <p>Don't have an account?</p>
                  <Link to={'/signup'} className={styles.link}>
                    Sign Up
                  </Link>
                </div>
                {forgotPassword ? (
                  <div style={{ marginTop: '20px' }}>
                    <p>
                      Click the "Send" button to receive an email with a link to reset your
                      password.
                    </p>
                    <button
                      className={styles.sendButton}
                      onClick={(e) => {
                        e.preventDefault();
                        sendResetPasswordRequest();
                      }}
                    >
                      Send
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles.link}
                    onClick={(e) => {
                      e.preventDefault();
                      setForgotPassword(true);
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <p>Check your email to finish signing up</p>
          <Link to={'/'}>Main</Link>
        </>
      )}

      {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
    </form>
  );
};

export default AuthForm;
