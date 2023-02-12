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
import { Button, Form, message, Popover, Popconfirm } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import api from '@/lib/utils/api';

interface Props {
  onFinish?: (response: any) => void;
}

const CreateModalForm = ({ onFinish }: Props) => {
  // 获取 TMDB 时的 Loading
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [form] = Form.useForm();
  const tmdbId = Form.useWatch('tmdb_id', form);
  const shareType = Form.useWatch('share_type', form);
  const posterPath = Form.useWatch('poster_path', form);
  const backdropPath = Form.useWatch('backdrop_path', form);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  const handleAutoWrite = async () => {
    setTmdbLoading(true);
    let apiUrl = '/api/v1/tmdb/';
    if (shareType === 'movie') {
      apiUrl += `movie/${tmdbId}`;
    }
    if (shareType === 'tv') {
      apiUrl += `tv/${tmdbId}`;
    }

    try {
      const data = await api.get<any, any>(apiUrl);

      const genres = (data.genres || []).map((item: any) => item.name);
      setGenres(genres);
      const formValue = {
        genres,
        backdrop_path: data.backdrop_path,
        overview: data.overview,
        poster_path: data.poster_path,
        tagline: data.tagline,
      };

      if (shareType === 'tv') {
        const keywords = [`#${data.name}`].concat(
          (data.genres || []).map((item: any) => `#${item.name}`),
        );
        setKeywords(keywords);

        form.setFieldsValue({
          ...formValue,
          title: data.name,
          keywords,
          original_title: data.original_name,
          number_of_episodes: data.number_of_episodes,
          number_of_seasons: data.number_of_seasons,
          release_date: data.first_air_date,
        });
      } else if (shareType === 'movie') {
        const keywords = [`#${data.title}`].concat(
          (data.genres || []).map((item: any) => `#${item.name}`),
        );
        setKeywords(keywords);

        form.setFieldsValue({
          ...formValue,
          keywords,
          title: data.title,
          original_title: data.original_title,
          runtime: data.runtime,
          release_date: data.release_date,
        });
      }
    } catch (error: any) {
      message.warning(error.message);
    }

    setTmdbLoading(false);
  };

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

    message.success('创建成功');
    onFinish?.(response);
    return true;
  };

  return (
    <ModalForm
      title="新建分享"
      form={form}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建分享
        </Button>
      }
      autoFocusFirstInput
      submitTimeout={2000}
      onFinish={handleSubmit}
      modalProps={{
        destroyOnClose: true,
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="tmdb_id"
          width="md"
          label="TMDB ID"
          tooltip="themoviedb 链接上那串数字"
          placeholder="请输入 TMDB ID"
        />
        <ProFormSelect
          options={[
            {
              value: 'movie',
              label: '电影',
            },
            {
              value: 'tv',
              label: '剧集',
            },
          ]}
          width="sm"
          addonAfter={
            <Popconfirm
              title="将根据影视信息自动填写"
              description="如果已有内容将会覆盖，你确定要覆盖现有内容嘛？"
              onConfirm={handleAutoWrite}
            >
              <Button loading={tmdbLoading} disabled={!tmdbId || !shareType}>
                自动填写
              </Button>
            </Popconfirm>
          }
          name="share_type"
          label="资源类型"
        />
      </ProForm.Group>

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

      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        initialValue="频道推荐: [群主自营优惠阿里会员](https://t.me/Aliyun_4K_Movies/3933)"
      />

      <ProForm.Group>
        <ProFormText
          width="md"
          label="分享来源"
          name="share_source"
          initialValue="@Aliyun_4K_Movies"
        />

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

export default CreateModalForm;
