import React, { useEffect, useState } from 'react';
import { Card, Tag, Typography, Spin, message } from 'antd';
import { getTags } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { TagOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// 随机颜色生成器
const getRandomColor = () => {
  const colors = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const TagsCard = ({ onTagClick }) => {
  const { user } = useStore();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await getTags(user.id);
        setTags(response.data || []);
      } catch (err) {
        setError(err);
        message.error('获取标签失败');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTags();
    }
  }, [user?.id]);

  const handleTagClick = (tag) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  if (error) return <Text type="danger">加载标签失败</Text>;

  return (
    <Card
      title={
        <Title level={4} style={{ textAlign: 'center' }}>
          所有标签
        </Title>
      }
      style={{ width: '300px', marginLeft: '10px', marginTop: '50px' }}
      hoverable
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
        }}
      >
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Tag
              key={tag}
              color={getRandomColor()}
              style={{
                cursor: 'pointer',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => handleTagClick(tag)}
            >
              <TagOutlined style={{ marginRight: 4 }} />
              {tag}
            </Tag>
          ))
        ) : (
          <Text type="secondary">暂无标签</Text>
        )}
      </div>
    </Card>
  );
};

export default TagsCard;