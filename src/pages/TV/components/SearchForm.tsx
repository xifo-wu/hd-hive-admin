import searchParamsToObj from '@/lib/utils/searchParamsToObj';
import { ProFormText, QueryFilter } from '@ant-design/pro-components';
import { Card, Form } from 'antd';
import { useEffect } from 'react';

interface SearchFormData {
  title?: string;
}

interface SearchFormProps {
  params: URLSearchParams;
  onSearch: (values: SearchFormData) => Promise<boolean | void>;
}

const SearchForm = ({ params, onSearch }: SearchFormProps) => {
  const [form] = Form.useForm();
  useEffect(() => {
    const paramsValue = searchParamsToObj(params);
    form.setFieldsValue(paramsValue);
  }, [params]);

  const handleReset = () => {
    onSearch({});
  };

  return (
    <Card bodyStyle={{ padding: 0, marginBottom: 16 }} bordered={false}>
      <QueryFilter<SearchFormData>
        form={form}
        onFinish={onSearch}
        onReset={handleReset}
      >
        <ProFormText name="title" label="电影名称" />
      </QueryFilter>
    </Card>
  );
};

export default SearchForm;
