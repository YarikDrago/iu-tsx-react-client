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
  const [formType, setFormType] = React.useState<'login' | 'signup' | 'forgot'>(
    isRegistration ? 'signup' : 'login'
  );
  const [successLinkSend, setSuccessLinkSend] = React.useState(false);
  // const [forgotPassword, setForgotPassword] = React.useState(false);

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
      setSuccessLinkSend(true);
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

  let mainTitleText: string = 'Log In';

  switch (formType) {
    case 'login':
      mainTitleText = 'Welcome back!';
      break;
    case 'signup':
      mainTitleText = 'Create your account';
      break;
    case 'forgot':
      mainTitleText = 'Forgot Password?';
      break;
  }

  return (
    <form className={styles.form}>
      {!successRegistration ? (
        <>
          <h3>{mainTitleText}</h3>
          {!successLinkSend && (
            <>
              <p>Email</p>
              <input
                type="text"
                placeholder={'Email'}
                value={email}
                onChange={(e) => {
                  setErrorMsg('');
                  setEmail(e.target.value);
                }}
              />
            </>
          )}
          {formType === 'signup' && (
            <>
              <p>Nickname</p>
              <input
                type="text"
                placeholder={'nickname'}
                value={nickname}
                onChange={(e) => {
                  setErrorMsg('');
                  setNickname(e.target.value);
                }}
              />
            </>
          )}
          {formType !== 'forgot' && (
            <>
              <p>Password</p>
              <input
                className={'border-2'}
                type="password"
                value={password}
                placeholder={'Password'}
                onChange={(e) => {
                  setErrorMsg('');
                  setPassword(e.target.value);
                }}
              />
            </>
          )}
          {formType === 'signup' && (
            <>
              <p>Confirm password</p>
              <input
                type="text"
                value={repeatPassword}
                placeholder={'Confirm password'}
                onChange={(e) => {
                  setErrorMsg('');
                  setRepeatPassword(e.target.value);
                }}
              />
            </>
          )}
          {formType !== 'forgot' && (
            <>
              <button
                type="submit"
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={isLaoding}
              >
                {isLaoding ? <Loader2 /> : <p>Continue</p>}
              </button>
            </>
          )}
          <div className={'actions'}>
            {formType === 'signup' && (
              <p>
                Already have an account?{' '}
                <Link
                  to={'/login'}
                  onClick={() => {
                    setErrorMsg('');
                    setFormType('login');
                  }}
                  className={styles.link}
                >
                  Log In
                </Link>
              </p>
            )}
            {formType === 'login' && (
              <>
                <div className={styles.line}>
                  <p>Don't have an account?</p>
                  <Link
                    to={'/signup'}
                    onClick={() => {
                      setErrorMsg('');
                      setFormType('signup');
                    }}
                    className={styles.link}
                  >
                    Sign Up
                  </Link>
                </div>
                <button
                  type="button"
                  className={styles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    setErrorMsg('');
                    setFormType('forgot');
                  }}
                >
                  Forgot password?
                </button>
              </>
            )}
            {formType === 'forgot' && (
              <div
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {successLinkSend ? (
                  <>
                    <p>
                      Link was sent to your email. Check your inbox and follow the link to reset
                      your password.
                    </p>
                  </>
                ) : (
                  <>
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
                  </>
                )}
                <button
                  type="button"
                  className={`${styles.link} ${styles.forgotLogin}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setErrorMsg('');
                    setFormType('login');
                  }}
                >
                  Log In
                </button>
              </div>
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
