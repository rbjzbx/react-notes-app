import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Skeleton, Space, theme } from 'antd';
import { getUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
const { Text, Title } = Typography;
const { useToken } = theme;

const SiteCard = () => {
  const { token } = useToken();
  const { user } = useStore();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default guest data
  const guestData = {
    username: '游客',
    email: 'guest@example.com',
    avatar_url: 'https://bucket-sxw.oss-cn-beijing.aliyuncs.com/images/wallhaven-p97l5e_300x200.png',
    bio: '欢迎访客，请登录查看更多内容'
  };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await getUser(user.id);
        setUserData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user?.id]);

  if (loading) {
    return (
      <Card style={{ width: 300, height: 400, marginLeft: 10 }}>
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        style={{ 
          width: 300, 
          height: 400, 
          marginLeft: 10,
          borderColor: token.colorError 
        }}
      >
        <Space direction="vertical" align="center" style={{ width: '100%', paddingTop: 40 }}>
          <Text type="danger">加载用户数据失败</Text>
          <Text type="secondary">{error.message}</Text>
        </Space>
      </Card>
    );
  }

  // Use user data if available, otherwise use guest data
  const displayData = user?.id ? userData || user : guestData;

  return (
    <Card
      style={{ 
        width: 300, 
        height: 400, 
        marginLeft: 10,
        borderRadius: 12,
        boxShadow: token.boxShadow
      }}
      className="site-card"
      hoverable
      cover={
        <img
          alt="avatar"
          src='https://bucket-sxw.oss-cn-beijing.aliyuncs.com/images/wallhaven-p97l5e_300x200.png'
          style={{ 
            width: '100%', 
            height: 180, 
            objectFit: 'cover',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12
          }}
        />
      }
      bodyStyle={{
        padding: 16,
        height: 'calc(100% - 180px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ flex: 1 }}>
        <Card.Meta
          avatar={
            <Avatar 
              size={64} 
              src={displayData.avatar_url} 
              style={{ border: `2px solid ${token.colorPrimary}` }}
            />
          }
          title={
            <Title level={4} style={{ marginBottom: 4 }}>
              {displayData.nickname||displayData.username}
            </Title>
          }
          description={
            <Space direction="vertical" size={4}>
              <Text type="secondary">{displayData.email}</Text>
              <Text style={{ color: token.colorTextSecondary, fontSize: 12 }}>
                {displayData.bio || '欢迎来到我的个人空间'}
              </Text>
            </Space>
          }
          style={{ alignItems: 'center' }}
        />
      </div>
      
      
    </Card>
  );
};

export default SiteCard;