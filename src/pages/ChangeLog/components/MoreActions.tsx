import { useModal } from '@/lib/hooks';
import { useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const MoreActions = ({ record }: any) => {
  const { openModal } = useModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { id } = record;

  const handleMenuClick = ({ key }: any) => {
    switch (key) {
      case 'update':
        openModal('UpdateChangeLogModalForm', { id });
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
  ];

  return (
    <Space>
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
