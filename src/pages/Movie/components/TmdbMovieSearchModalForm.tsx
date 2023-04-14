import useSWRMutation from 'swr/mutation';
import useModal from '@/lib/hooks/useModal';
import {
  ProFormDigit,
  ProFormText,
  QueryFilter,
} from '@ant-design/pro-components';
import {
  Button,
  Col,
  Form,
  Modal,
  Pagination,
  Row,
  Spin,
  Typography,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import api from '@/lib/utils/api';

interface Props {
  onFinish?: (values: any) => void;
  modalName?: string;
}

interface QueryData {
  query: string;
  primary_release_year?: number;
}

interface Meta {
  image_base_url: string;
  image_poster_sizes: Array<string>;
  page: number;
  total: number;
  total_pages: number;
}

async function handleSearch(url: string, { arg }: { arg: QueryData }) {
  return api.get(url, {
    params: arg,
  });
}

const TmdbMovieSearchModalForm = ({
  onFinish,
  modalName = 'TmdbMovieSearchModalForm',
}: Props) => {
  const { open, params, openModal, closeModal } =
    useModal<QueryData>(modalName);
  const [form] = Form.useForm();
  const [selected, setSelected] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [spinText, setSpinText] = useState('加载中');

  const {
    trigger,
    data: response = {},
    isMutating,
  } = useSWRMutation('/api/v1/tmdb/movie/search', handleSearch);

  const { data = [], meta = {} } = response as any;
  const { page = 1, ...restMeta } = meta as Meta;

  useEffect(() => {
    if (params?.query) {
      form.setFieldsValue(params);
      trigger(params);
    }
  }, [params]);

  const handleFormSearch = async (values: QueryData) => {
    trigger(values);
    setSelected({});
  };

  const handlePageChange = (page: number) => {
    const query = form.getFieldsValue();
    setSelected({});
    trigger({
      ...query,
      page,
    });
  };

  const handleSumbit = async (values: any) => {
    setSpinText('自动获取数据中');
    setSubmitting(true);
    const { response, error } = await api.post<any, any>(
      '/api/v1/manager/movies/tmdb',
      {
        tmdb_id: values.id,
      },
    );
    setSubmitting(false);
    setSpinText('加载中');

    if (error) {
      message.error(error.message);
      return;
    }

    const { data } = response;
    onFinish?.(data);
    openModal('ResourcesModal', { slug: data.slug });
  };

  return (
    <Modal
      title="TMDB 电影搜索"
      width={1200}
      open={open}
      onCancel={() => closeModal(modalName)}
      footer={false}
    >
      <QueryFilter<QueryData> form={form} onFinish={handleFormSearch}>
        <ProFormText
          name="query"
          label="关键字"
          placeholder="请输入影片关键字"
          rules={[
            {
              required: true,
              message: '请输入关键字',
            },
          ]}
        />

        <ProFormDigit
          fieldProps={{ precision: 0 }}
          name="primary_release_year"
          label="年份"
          placeholder="请输入影片年份"
        />
      </QueryFilter>

      <Spin spinning={isMutating || submitting} tip={spinText}>
        <Row gutter={[16, 16]} style={{ minHeight: 327 }}>
          {data.map((item: any) => (
            <Col key={item.id} xs={12} sm={12} md={6} lg={4}>
              <div
                onClick={() => setSelected(item)}
                style={{
                  position: 'relative',
                  borderRadius: 16,
                  height: '100%',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    paddingBottom: 'calc(9 / 6 * 100%)',
                    background: '#cbd5e1',
                    borderRadius: 16,
                  }}
                >
                  {item.poster_path ? (
                    <img
                      style={{
                        zIndex: 9,
                        borderRadius: 16,
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        objectFit: 'cover',
                      }}
                      src={`${restMeta.image_base_url}/w500/${item.poster_path}`}
                    />
                  ) : (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      暂无图片
                    </div>
                  )}

                  {selected.id === item.id && (
                    <div
                      style={{
                        borderRadius: 16,
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'rgba(0, 0, 0, 0.78)',
                        left: 0,
                        zIndex: 10,
                      }}
                    >
                      <Button type="primary" onClick={() => handleSumbit(item)}>
                        添加
                      </Button>
                    </div>
                  )}
                </div>
                <div style={{ padding: 8, cursor: 'pointer' }}>
                  <Typography.Text ellipsis={{ tooltip: true }}>
                    {item.title}
                  </Typography.Text>
                  <Typography.Text
                    style={{ display: 'block' }}
                    type="secondary"
                  >
                    {item.release_date}
                  </Typography.Text>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <div style={{ textAlign: 'right', padding: 8 }}>
          <Pagination
            current={page}
            total={restMeta.total}
            pageSize={20}
            hideOnSinglePage={true}
            showSizeChanger={false}
            showTotal={(total) => `共搜索到 ${total} 条记录`}
            onChange={handlePageChange}
          />
        </div>
      </Spin>
    </Modal>
  );
};

export default TmdbMovieSearchModalForm;
