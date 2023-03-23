import api from '@/lib/utils/api';
import { useModal } from '@/lib/hooks';
import { useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Popconfirm, Space } from 'antd';

const MoreActions = ({ record, reloadData }: any) => {
  const { openModal } = useModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { slug } = record;

  const delBanner = async () => {
    const { response, error } = await api.put<any, any>(
      `/api/v1/manager/movies/${slug}/del-banner`,
    );
    if (error) {
      message.error(error.message);
      return;
    }

    message.success(response.message);
    reloadData();
  };

  const setBanner = async () => {
    const { response, error } = await api.put<any, any>(
      `/api/v1/manager/movies/${slug}/set-banner`,
    );

    if (error) {
      message.error(error.message);
      if (error.meta?.need_replace) {
        openModal('ReplaceBannerModal', { slug, shareType: record.share_type });
      }
      return;
    }

    message.success(response.message);
    reloadData();
  };

  const handleDelete = async () => {
    const { error } = await api.delete<any, any>(
      `/api/v1/manager/movies/${slug}`,
    );

    if (error) {
      message.error(error.message);
      return;
    }

    message.success('删除成功');
    reloadData?.();
  };

  const handleMenuClick = ({ key }: any) => {
    switch (key) {
      case 'update':
        openModal('UpdateMovieModalForm', { slug });
        break;
      case 'delete':
        setDropdownOpen(true);
        return;
      case 'del_banner':
        delBanner();
        break;
      case 'set_banner':
        setBanner();
        break;
    }

    setDropdownOpen(false);
  };

  const handleDropdownOpenChange = (v: boolean) => {
    setDropdownOpen(v);
  };

  const moreActions = [
    {
      key: 'update',
      label: '更新',
    },
    record.is_banner
      ? {
          key: 'del_banner',
          label: '取消推荐',
        }
      : {
          key: 'set_banner',
          label: '标记推荐',
        },
    {
      key: 'delete',
      danger: true,
      label: (
        <Popconfirm
          placement="left"
          title="确定删除吗?"
          description="删除后网站上的内容将无法访问"
          onConfirm={handleDelete}
        >
          <a onClick={(e) => e.preventDefault()}>删除</a>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Space>
      <Button
        size="small"
        onClick={() => openModal('ResourcesModal', { slug: record.slug })}
        type="link"
      >
        分享
      </Button>
      <Dropdown
        menu={{
          items: moreActions,
          onClick: handleMenuClick,
        }}
        trigger={['click']}
        open={dropdownOpen}
        onOpenChange={handleDropdownOpenChange}
        arrow
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <MoreOutlined />
          </Space>
        </a>
      </Dropdown>
    </Space>
  );
};

export default MoreActions;
