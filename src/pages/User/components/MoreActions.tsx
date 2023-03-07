import api from '@/lib/utils/api';
import { useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, message, Space } from 'antd';

const MoreActions = ({ record, reloadData }: any) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { id } = record;

  const handleDelAdmin = async () => {
    const { response, error } = await api.put<any, any>(
      `/api/v1/manager/users/${id}/del-admin`,
    );

    if (error) {
      message.error(error.message);
      return;
    }

    message.success(response.message);
    reloadData?.();
  };

  const handleSetAdmin = async () => {
    const { response, error } = await api.put<any, any>(
      `/api/v1/manager/users/${id}/set-admin`,
    );

    if (error) {
      message.error(error.message);
      return;
    }

    message.success(response.message);
    reloadData?.();
  };

  const handleMenuClick = ({ key }: any) => {
    switch (key) {
      case 'del_admin':
        handleDelAdmin();
        break;
      case 'set_admin':
        handleSetAdmin();
        break;
    }

    setDropdownOpen(false);
  };

  const handleDropdownOpenChange = (v: boolean) => {
    setDropdownOpen(v);
  };

  const moreActions = [
    record.is_admin
      ? {
          key: 'del_admin',
          label: '取消管理员',
        }
      : {
          key: 'set_admin',
          label: '设为管理员',
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
          <MoreOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default MoreActions;
