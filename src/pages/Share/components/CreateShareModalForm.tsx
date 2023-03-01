import { useState } from 'react';
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, message, Popover } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import api from '@/lib/utils/api';
import withModalForm from '@/lib/hoc/withModalForm';
import { useModal } from '@/lib/hooks';

interface Props {
  onFinish?: (response: any) => void;
}

const modalName = 'CreateShareModalForm';
const shareType = [
  {
    value: 'movie',
    label: '电影',
  },
  {
    value: 'tv',
    label: '剧集',
  },
  {
    value: 'anime',
    label: '动漫',
  },
  {
    value: 'zongyi',
    label: '综艺',
  },
  {
    value: 'study',
    label: '学习',
  },
  {
    value: 'recital',
    label: '演唱会',
  },
  {
    value: 'documentary',
    label: '纪录片',
  },
  {
    value: 'ebook',
    label: '电子书',
  },
];

const CreateShareModalForm = ({ onFinish, ...rest }: Props) => {
  const { params, closeModal } = useModal(modalName);
  const [form] = Form.useForm();
  const posterPath = Form.useWatch('poster_path', form);
  const backdropPath = Form.useWatch('backdrop_path', form);
  const [keywords] = useState<string[]>(params.keywords);
  const [genres] = useState<string[]>(params.genres);

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      share_url: values.share_url.map((i: any) => i.url),
    };

    const { response, error } = await api.post<any, any>(
      '/api/v1/share',
      payload,
    );
    if (error) {
      message.error(error.message);
      return;
    }

    message.success('分享成功 🎉');
    onFinish?.(response);
    closeModal(modalName);
    closeModal('SelectModeModal');
    return true;
  };

  return (
    <ModalForm
      initialValues={params}
      title="新建分享"
      form={form}
      autoFocusFirstInput
      submitTimeout={2000}
      onFinish={handleSubmit}
      modalProps={{
        destroyOnClose: true,
      }}
      {...rest}
    >
      <ProFormText hidden name="tmdb_id" />
      <ProForm.Group title="影视信息">
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="title"
          label="标题"
          placeholder="请输入标题"
        />

        <ProFormText
          width="md"
          name="original_title"
          label="原标题"
          placeholder="请输入原标题"
        />

        <ProFormDigit
          label="时长"
          name="runtime"
          min={0}
          fieldProps={{ precision: 0 }}
        />

        <ProFormText
          width="sm"
          label="海报"
          name="poster_path"
          fieldProps={{
            addonAfter: posterPath && (
              <Popover
                content={
                  <img
                    width={256}
                    src={`https://image.tmdb.org/t/p/w600_and_h900_multi_faces/${posterPath}`}
                  />
                }
              >
                <EyeOutlined disabled style={{ cursor: 'pointer' }} />
              </Popover>
            ),
          }}
        />

        <ProFormText
          width="sm"
          label="背景图"
          name="backdrop_path"
          fieldProps={{
            addonAfter: backdropPath && (
              <Popover
                content={
                  <img
                    width={256}
                    src={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${backdropPath}`}
                  />
                }
              >
                <EyeOutlined disabled style={{ cursor: 'pointer' }} />
              </Popover>
            ),
          }}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormText label="首播时间" name="release_date" />
        <ProFormText width="md" label="标语" name="tagline" />
      </ProForm.Group>

      {params.tmdb_type === 'tv' && (
        <ProForm.Group>
          <ProFormDigit
            label="季数"
            name="number_of_seasons"
            min={0}
            fieldProps={{ precision: 0 }}
          />
          <ProFormDigit
            label="集数"
            name="number_of_episodes"
            min={0}
            fieldProps={{ precision: 0 }}
          />
        </ProForm.Group>
      )}

      <ProFormSelect
        options={genres}
        fieldProps={{
          mode: 'tags',
        }}
        name="genres"
        label="分类"
      />
      <ProFormSelect
        options={keywords}
        fieldProps={{
          mode: 'tags',
        }}
        name="keywords"
        label="关键字"
      />

      <ProFormTextArea name="overview" label="简介" placeholder="请输入简介" />

      <ProForm.Group title="分享信息">
        <ProFormSelect
          width="sm"
          options={shareType}
          name="share_type"
          label="资源类型"
          required
        />

        <ProFormText width="sm" label="资源大小" name="share_size" />

        <ProFormText
          width="sm"
          label="分享来源"
          name="share_source"
          initialValue="@Aliyun_4K_Movies"
        />

        <ProFormSelect
          width="lg"
          options={['8k', '4k', '1080p', '720p']}
          fieldProps={{
            mode: 'tags',
          }}
          name="video_resolution"
          label="分辨率"
        />
      </ProForm.Group>

      <ProFormList
        required
        rules={[
          {
            required: true,
            validator: async (_, value) => {
              console.log(value);
              if (value && value.length > 0) {
                return;
              }
              throw new Error('至少要有一项！');
            },
          },
        ]}
        min={1}
        tooltip="可以填写网盘分享链接等"
        creatorButtonProps={{ creatorButtonText: '新增一个分享链接' }}
        label="分享链接"
        name="share_url"
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入您的分享链接',
            },
          ]}
          name="url"
          width="xl"
          key="url"
        />
      </ProFormList>

      <ProFormTextArea name="remark" label="备注" placeholder="请输入备注" />

      <ProForm.Group>
        {/* {params.tmdb_type === 'tv' && (
          <ProForm.Group>
            <ProFormDigit
              label="分享的季数"
              name="share_number_of_seasons"
              min={0}
              fieldProps={{ precision: 0 }}
            />
            <ProFormDigit
              label="分享的集数"
              name="share_number_of_episodes"
              min={0}
              fieldProps={{ precision: 0 }}
            />
          </ProForm.Group>
        )} */}
      </ProForm.Group>
    </ModalForm>
  );
};

export default withModalForm(CreateShareModalForm, modalName);
