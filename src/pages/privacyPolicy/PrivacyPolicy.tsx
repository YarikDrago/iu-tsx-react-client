import React from 'react';
import { observer } from 'mobx-react';

import * as styles from './PrivacyPolicy.module.scss';

const PrivacyPolicy = () => {
  return (
    <article className={styles.privacy}>
      <header className={styles.header}>
        <h1>Privacy Policy of IU portal</h1>
      </header>

      <section className={styles.section}>
        {/*<h2>CONTROLLER’S NAME AND CONTACT DETAILS</h2>*/}
      </section>
    </article>
  );
};

export default observer(PrivacyPolicy);
