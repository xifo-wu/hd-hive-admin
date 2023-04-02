import {
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';

interface Props {
  genres: Array<string>;
}

const TVCommonForm = ({ genres }: Props) => {
  return (
    <>
      <ProForm.Group colProps={{ sm: 24, md: 12 }}>
        <ProFormText
          name="name"
          label="名称"
          placeholder="请输入名称"
          rules={[{ required: true }]}
        />

        <ProFormText
          name="original_name"
          label="原名"
          placeholder="请输入原名"
          rules={[{ required: true }]}
        />

        <ProFormText name="tagline" label="标语" placeholder="请输入标语" />
      </ProForm.Group>

      <ProForm.Group colProps={{ sm: 12, md: 6 }}>
        <ProFormDependency name={['poster_path']}>
          {({ poster_path }) => {
            return (
              poster_path && (
                <img
                  style={{
                    width: '100%',
                    padding: 8,
                    borderRadius: 16,
                  }}
                  src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                />
              )
            );
          }}
        </ProFormDependency>
      </ProForm.Group>

      <ProForm.Group colProps={{ sm: 12, md: 6 }}>
        <ProFormDependency name={['backdrop_path']}>
          {({ backdrop_path }) => {
            return (
              backdrop_path && (
                <img
                  style={{
                    width: '100%',
                    padding: 8,
                    borderRadius: 16,
                  }}
                  src={`https://image.tmdb.org/t/p/w500${backdrop_path}`}
                />
              )
            );
          }}
        </ProFormDependency>

        <ProFormDependency name={['logo_path']}>
          {({ logo_path }) => {
            return (
              logo_path && (
                <img
                  style={{
                    background: '#f8fafc',
                    width: '100%',
                    padding: 8,
                    borderRadius: 16,
                  }}
                  src={`https://image.tmdb.org/t/p/w500${logo_path}`}
                />
              )
            );
          }}
        </ProFormDependency>
      </ProForm.Group>

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="poster_path"
        label="海报"
        placeholder="请输入海报"
        rules={[{ required: true }]}
      />

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="backdrop_path"
        label="背景"
        placeholder="请输入背景"
        rules={[{ required: true }]}
      />

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="logo_path"
        label="Logo"
        placeholder="请输入 Logo"
      />

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="first_air_date"
        label="首播时间"
        placeholder="请输入首播时间"
      />

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="last_air_date"
        label="最后播出时间"
        placeholder="请输入最后播出时间"
      />

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="original_language"
        label="原始语言"
        placeholder="请输入原始语言"
      />

      <ProFormText
        colProps={{ sm: 24, md: 8 }}
        name="status"
        label="状态"
        placeholder="请输入状态"
      />

      <ProFormSelect
        colProps={{ sm: 24, md: 16 }}
        options={genres}
        fieldProps={{
          mode: 'tags',
        }}
        name="genre_names"
        label="分类"
        rules={[{ required: true }]}
      />

      <ProFormTextArea colProps={{ span: 24 }} name="overview" label="简介" />
    </>
  );
};

export default TVCommonForm;
