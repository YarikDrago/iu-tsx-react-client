import React, { FormEvent, useEffect } from 'react';
import { Link } from 'react-router';

import appData from '@/app.data';
import { me } from '@/function/api/me';
import { sendContactMessage } from '@/function/api/sendContactMessage';
import { routes } from '@/routes/routes';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

import * as styles from './Contact.module.scss';

const Contact = () => {
  useRequireAccessToken();
  const [email, setEmail] = React.useState(appData.email);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSent, setIsSent] = React.useState(false);

  useEffect(() => {
    if (appData.email) {
      setEmail(appData.email);
      return;
    }

    void me()
      .then((user) => {
        if (user.email) {
          appData.changeEmail(user.email);
          setEmail(user.email);
        }
      })
      .catch(() => undefined);
  }, []);

  function clearErrorOnInput() {
    if (error) {
      setError('');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const normalizedEmail = email.trim();
    const normalizedMessage = message.trim();

    if (!normalizedEmail || !normalizedMessage) {
      setError('Please fill in your email address and message.');
      return;
    }

    try {
      setError('');
      appData.showLoader();
      await sendContactMessage({
        email: normalizedEmail,
        message: normalizedMessage,
      });
      setIsSent(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  function writeAnotherMessage() {
    setMessage('');
    setError('');
    setIsSent(false);
  }

  return (
    <section className={styles.container}>
      <article className={styles.panel}>
        {isSent ? (
          <>
            <h1>Message sent</h1>
            <p>Your message was sent successfully. Thank you, we really value you.</p>
            <div className={styles.actions}>
              <Link className={`button secondary ${styles.linkButton}`} to={routes.home.href}>
                Back to home
              </Link>
              <button className="primary" type="button" onClick={writeAnotherMessage}>
                I have something else to say
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>Contact us</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                E-mail address
                <input
                  type="email"
                  value={email}
                  placeholder="your@email.com"
                  autoComplete="email"
                  onChange={(e) => {
                    clearErrorOnInput();
                    setEmail(e.target.value);
                  }}
                />
              </label>
              <label className={styles.field}>
                Your message
                <textarea
                  className={styles.textarea}
                  value={message}
                  placeholder="How can we help?"
                  onChange={(e) => {
                    clearErrorOnInput();
                    setMessage(e.target.value);
                  }}
                />
              </label>
              <p
                className={`${styles.errorMsg} ${error ? '' : styles.hidden}`}
                aria-hidden={!error}
              >
                {error || 'Hidden error message'}
              </p>
              <button className="primary" type="submit">
                Send message
              </button>
            </form>
          </>
        )}
      </article>
    </section>
  );
};

export default Contact;
