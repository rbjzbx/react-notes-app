import { Layout, Typography, Card, Avatar, Descriptions, Button, Modal, Form, Input, message, Image, Row, Col } from 'antd';
import { UserOutlined, EditOutlined, MailOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/userStore';
import { updateUser } from '../../api/userApi';
import { useNavigate } from 'react-router-dom'
import './Profile.css';

const { Title } = Typography;

const Profile = () => {
  const { user, setUser } = useStore();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 示例图片数组
  const [userImages, setUserImages] = useState([
    'https://bucket-sxw.oss-cn-beijing.aliyuncs.com/images/wallhaven-p97l5e_300x200.png',
    'https://bucket-sxw.oss-cn-beijing.aliyuncs.com/images/background.png',
    'https://bucket-sxw.oss-cn-beijing.aliyuncs.com/images/profile_background2.png',
    'https://bucket-sxw.oss-cn-beijing.aliyuncs.com/images/profile_background.png',
    'https://bucket-sxw.oss-cn-beijing.aliyuncs.com/images/site.png',
    'https://bucket-sxw.oss-cn-beijing.aliyuncs.com/images/wallhaven-p96odm_340x350.png'
  ]);

  // 初始化表单值
  const initFormValues = {
    nickname: user?.nickname || '',
    email: user?.email || '',
    phone: user?.phone || ''
  };

  const showEditModal = () => {
    form.setFieldsValue(initFormValues);
    setIsEditModalVisible(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 调用更新用户的API
      const updatedUser = await updateUser(user.id,{
        nickname: values.nickname,
        email: values.email,
        phone: values.phone
      });
      
      // 更新 store 中的用户信息
      setUser(updatedUser.data);
      
      message.success('资料更新成功');
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('更新资料失败:', error);
      message.error(error.response?.data?.message || '更新资料失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  useEffect(() => {
    if (!user) navigate('/login')
  }, [navigate, user]);

  return (
    <>
      <div className="welcome-container">
        <div className="welcome-content">
          <Title className="welcome-title">我的相册</Title>
        </div>
      </div>
      
      <div className="profile-page-container">
        <div className="profile-card-wrapper">
          {/* 左侧图片展示 Card */}
          <Card
            className="left-card"
            style={{ width: '800px', marginRight: '20px' }}
            title="我的图片"
            extra={<Button type="primary" icon={<PlusOutlined />}>上传图片</Button>}
          >
            <Row gutter={[16, 16]}>
              {userImages.map((image, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <Image
                    src={image}
                    alt={`用户图片-${index}`}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    preview={{
                      src: image
                    }}
                  />
                </Col>
              ))}
            </Row>
          </Card>

          {/* 个人信息 Card */}
          <Card
            className="user-profile-card"
            cover={
              <div className="profile-banner">
                <Avatar 
                  size={120} 
                  src={user?.avatar_url} 
                  icon={<UserOutlined />} 
                  className="profile-avatar"
                  style={{marginLeft:'110px',marginTop:'20px'}}
                />
              </div>
            }
            actions={[
              <Button type="primary" icon={<EditOutlined />} onClick={showEditModal}>
                编辑资料
              </Button>,
            ]}
          >
            <Descriptions column={1} bordered={false} className="user-info">
              <Descriptions.Item label="昵称">
                <div className="info-value">{user?.nickname || '未设置'}</div>
              </Descriptions.Item>
              <Descriptions.Item label="邮箱" className="info-item">
                <div className="info-value">
                  <MailOutlined style={{ marginRight: 8 }} />
                  {user?.email || '未设置'}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="手机号" className="info-item">
                <div className="info-value">
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  {user?.phone || '未设置'}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </div>

      {/* 编辑资料模态框 */}
      <Modal
        title="编辑个人资料"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        width={600}
        footer={[
          <Button key="back" onClick={handleEditCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditOk} loading={loading}>
            保存
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Profile;