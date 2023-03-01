import api from '@/lib/utils/api';
import { useModal } from '@/lib/hooks';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, message, Popconfirm, Space } from 'antd';

const MoreActions = ({ record, onDelete, reloadData }: any) => {
  const { openModal } = useModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { slug } = record;

  const delBanner = async () => {
    const { response, error } = await api.put<any, any>(
      `api/v1/share/${slug}/del-banner`,
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
      `api/v1/share/${slug}/set-banner`,
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

  const handleMenuClick = ({ key }: any) => {
    switch (key) {
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
          onConfirm={() => onDelete(record.slug)}
        >
          <a onClick={(e) => e.preventDefault()}>删除</a>
        </Popconfirm>
      ),
    },
  ];

  return (
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
          更多操作
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default MoreActions;
