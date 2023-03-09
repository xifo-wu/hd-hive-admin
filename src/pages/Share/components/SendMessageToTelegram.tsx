import useSWR from 'swr';
import withModalForm from '@/lib/hoc/withModalForm';
import api from '@/lib/utils/api';
import {
  ModalForm,
  ModalFormProps,
  ProFormTextArea,
} from '@ant-design/pro-components';
import ReactMarkdown from 'react-markdown';
import { Row, Col, Form, Card, notification } from 'antd';
import styles from '../styles.less';
import rehypeRaw from 'rehype-raw';
import { useModal } from '@/lib/hooks';

type Props = {
  modalName?: string;
} & ModalFormProps;

const initModalName = 'SendMessageToTelegram';

const SendMessageToTelegram = ({ open, modalName, ...rest }: Props) => {
  const { params } = useModal(modalName);
  const { slug } = params;
  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();

  const { data: response = {} } = useSWR<any>(
    open ? `/api/v1/share/${slug}` : null,
    api.get,
    {
      revalidateOnFocus: false,
      onSuccess: (res) => {
        const { data } = res;
        // 暂时不存上次发送的信息
        // if (data.share_notification) {
        //   form.setFieldValue('caption', data.share_notification.content);
        //   return;
        // }

        form.setFieldValue(
          'caption',
          `资源名称: <b>${data.title} ${data.remark || ''}</b>  
影片原名: ${data.original_title}  
影片年代: ${data.release_date}  
资源简介: ${data.overview}  

🏷️ 资源标签:  
${(data.keywords || []).map((item: string) => `${item}`).join(', ')}  

${data.share_size ? `📦 资源大小: ${data.share_size}` : ''}  

${
  data.video_resolution && data.video_resolution.length
    ? `🖥️ 分辨率: ${data.video_resolution.join(', ')}`
    : ''
}

🔗 分享链接:  
${(data.share_url || [])
  .map((item: string) => `<a href="${item}">${item}</a>`)
  .join('  \n')}

🌈
<a href="https://hdhive.org/share/${data.slug}">${data.title} - 影巢</a>
`,
        );
      },
    },
  );

  const { data = {} } = response;
  const handleSubmit = async (values: any) => {
    const { error } = await api.post<any, any>(
      `/api/v1/share/${slug}/telegram`,
      values,
    );

    if (error) {
      notificationApi.error({
        message: error.message,
        description: error?.data?.description,
      });

      return false;
    }

    return true;
  };

  return (
    <ModalForm
      open={open}
      form={form}
      preserve={false}
      title="发送消息到 Telegram"
      onFinish={handleSubmit}
      {...rest}
    >
      {contextHolder}
      <Row gutter={[16, 16]}>
        <Col md={10} sm={24}>
          <Card
            bordered={false}
            style={{ boxShadow: 'none' }}
            bodyStyle={{ padding: '4px 0' }}
            cover={<img alt="电影海报" src={data.poster_url} />}
          >
            <Form.Item shouldUpdate style={{ fontSize: 12 }}>
              {() => {
                return (
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    className={styles.markdown}
                  >
                    {form.getFieldValue('caption')}
                  </ReactMarkdown>
                );
              }}
            </Form.Item>
          </Card>
        </Col>
        <Col xs={24} md={14} sm={24}>
          <span>
            需要用 Telegram 的
            <a
              href="https://core.telegram.org/bots/api#html-style"
              target="_blank"
              rel="noreferrer"
            >
              语法
            </a>
          </span>
          <ProFormTextArea
            name="caption"
            label="消息内容"
            placeholder="请输入具体消息"
            fieldProps={{ autoSize: true }}
            tooltip="Telegram Html 格式"
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default withModalForm<Props>(SendMessageToTelegram, initModalName);
