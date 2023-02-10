import { useRef, useState } from 'react';
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Form, message, Popover } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import api from '@/lib/utils/api';

interface Props {
  onFinish?: (response: any) => void;
  slug: string;
}

const EditModalForm = ({ onFinish, slug, ...rest }: Props) => {
  const dataRef = useRef({});
  const [form] = Form.useForm();
  const posterPath = Form.useWatch('poster_path', form);
  const backdropPath = Form.useWatch('backdrop_path', form);
  const [shareType, setShareType] = useState<string>('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  const handleSubmit = async (values: any) => {
    const payload = {
      ...dataRef.current,
      ...values,
      share_url: values.share_url.map((i: any) => i.url),
    };

    const { response, error } = await api.put<any, any>(
      `/api/v1/share/${slug}`,
      payload,
    );
    if (error) {
      message.error(error.message);
      return;
    }

    message.success('更新成功');
    onFinish?.(response);
    return true;
  };

  return (
    <ModalForm
      autoFocusFirstInput={false}
      title="编辑"
      form={form}
      preserve={false}
      submitTimeout={2000}
      onFinish={handleSubmit}
      onOpenChange={(v) => {
        if (!v) {
          form.resetFields();
        }
      }}
      modalProps={{
        destroyOnClose: true,
      }}
      request={async () => {
        try {
          const response = await api.get(`/api/v1/share/${slug}`);
          setShareType(response.data.share_type);
          setKeywords(response.data.keywords);
          setGenres(response.data.genres);
          dataRef.current = response.data;

          console.log(response.data, 'response.data');
          return {
            ...response.data,
            share_url: (response.data.share_url || []).map((i: any) => ({
              url: i,
            })),
          };
        } catch (error: any) {
          message.error(error.message);
          return;
        }
      }}
      {...rest}
    >
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

      {shareType === 'tv' && (
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

      <ProForm.Group title="分享信息"></ProForm.Group>

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
        <ProFormText width="md" label="分享来源" name="share_source" />

        {shareType === 'tv' && (
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
        )}
      </ProForm.Group>
    </ModalForm>
  );
};

const EditModalFormWrapper = ({ modalProps, ...rest }: any) => {
  const [open, setOpen] = useState(false);
  const [isMount, setIsMount] = useState(true);

  const handleAfterClose = () => {
    setIsMount(false);
  };
  const handleOpen = () => {
    setIsMount(true);
    setOpen(true);
  };

  return (
    <>
      <Button type="link" onClick={handleOpen}>
        编辑
      </Button>
      {isMount && (
        <EditModalForm
          modalProps={{
            ...modalProps,
            afterClose: () => {
              handleAfterClose();
              modalProps?.afterClose();
            },
          }}
          onOpenChange={setOpen}
          open={open}
          {...rest}
          handleAfterClose={handleAfterClose}
        />
      )}
    </>
  );
};

export default EditModalFormWrapper;
