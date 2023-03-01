import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Popconfirm, Space } from 'antd';
import { useState } from 'react';

const MoreActions = ({ record, onDelete }: any) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleMenuClick = ({ key }: any) => {
    switch (key) {
      case 'delete':
        setDropdownOpen(true);
        return;
    }

    setDropdownOpen(false);
  };

  const handleDropdownOpenChange = (v: boolean) => {
    setDropdownOpen(v);
  };

  const moreActions = [
    {
      key: 'delete',
      danger: true,
      label: (
        <Popconfirm
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
