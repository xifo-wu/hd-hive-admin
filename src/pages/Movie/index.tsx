import { PageContainer, ProList } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import SearchForm from './components/SearchForm';
import FetchMovieDetailModal from './components/FetchMovieDetailModal';
import CreateMovieModalForm from './components/CreateMovieModalForm';

const MovieListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = async (values: any) => {
    setSearchParams(values);
  };

  return (
    <PageContainer ghost extra={[<FetchMovieDetailModal key="createMovie" />]}>
      <SearchForm params={searchParams} onSearch={handleSearch} />

      <ProList />

      <CreateMovieModalForm />
    </PageContainer>
  );
};

export default MovieListPage;
