import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <Heading as="h1" className={styles.heroTitle}>
          SDR Agent API Documentation
        </Heading>
        <p className={styles.heroSubtitle}>Integration API for CRM Connectivity</p>
        <div className={styles.buttons}>
          <Link
            className={clsx('button button--lg', styles.primaryButton)}
            to="/docs/intro">
            Get Started →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Integration API for CRM Connectivity">
      <HomepageHeader />
    </Layout>
  );
}
