import React from 'react';
import { observer } from 'mobx-react';

import * as styles from './PrivacyPolicy.module.scss';

const PrivacyPolicy = () => {
  return (
    <article className={styles.privacy}>
      <header className={styles.header}>
        <h1>Privacy Policy of IU portal</h1>
        <p className={styles.updated}>Draft version. Last updated: July 13, 2026.</p>
      </header>

      <section className={styles.section}>
        <h2>Controller's Name and Contact Details</h2>
        <p>
          The controller responsible for data processing within the meaning of Article 13(1)(a) of
          the General Data Protection Regulation (GDPR) is:
        </p>
        <dl className={styles.details}>
          <div>
            <dt>Data Controller</dt>
            <dd>Iaroslav Uliantsev</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              <a href="mailto:privacy@uliantcev.ru">privacy@uliantcev.ru</a>
            </dd>
          </div>
        </dl>
      </section>
    </article>
  );
};

export default observer(PrivacyPolicy);
