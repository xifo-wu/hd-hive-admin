import Guide from '@/components/Guide';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name="HD Hive" />
      </div>
    </PageContainer>
  );
};

export default HomePage;
