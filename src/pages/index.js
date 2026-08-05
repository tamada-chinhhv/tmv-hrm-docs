import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';

import styles from './index.module.css';

const FEATURES = [
  {
    title: <Translate id="homepage.feature.attendance.title">Chấm công</Translate>,
    description: (
      <Translate id="homepage.feature.attendance.description">
        Check-in/out qua GPS hoặc WiFi công ty, theo dõi chấm công theo tháng.
      </Translate>
    ),
  },
  {
    title: <Translate id="homepage.feature.leave.title">Nghỉ phép</Translate>,
    description: (
      <Translate id="homepage.feature.leave.description">
        Tạo đơn xin nghỉ, duyệt theo cấp quản lý, tích hợp báo cáo.
      </Translate>
    ),
  },
  {
    title: <Translate id="homepage.feature.payroll.title">Bảng lương</Translate>,
    description: (
      <Translate id="homepage.feature.payroll.description">
        Xem phiếu lương, khóa kỳ lương, cấu hình thuế và ca làm.
      </Translate>
    ),
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">
          <Translate id="homepage.tagline">
            Tài liệu hệ thống Quản lý Nhân sự TMV
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            <Translate id="homepage.cta.docs">Xem tài liệu</Translate>
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            href="https://hrm.tamada.vn/login"
          >
            <Translate id="homepage.cta.login">Đăng nhập HRM</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Feature({ title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const tagline = translate({
    id: 'homepage.tagline',
    message: 'Tài liệu hệ thống Quản lý Nhân sự TMV',
    description: 'Homepage tagline',
  });

  return (
    <Layout title={siteConfig.title} description={tagline}>
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {FEATURES.map((feature) => (
                <Feature
                  key={feature.title.props.id}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
