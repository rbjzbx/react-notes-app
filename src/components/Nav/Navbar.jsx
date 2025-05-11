import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Radio } from 'antd';
import { 
  Layout, 
  Menu, 
  Typography, 
  Avatar, 
  Space, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select,
  Tag,
  message,
  Upload
} from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  FolderOutlined,
  AppstoreOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useStore } from '@/store/userStore';
import './Navbar.css';
import { getCategories } from '@/api/categoryApi';
import { getTags, createNote } from '@/api/noteApi';
import { uploadImage } from '@/api/commonApi'; // Import the uploadImage function

const { Header } = Layout;
const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(''); // State for background image URL
  const [imageUploading, setImageUploading] = useState(false); // State for image upload loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, tagsRes] = await Promise.all([
          getCategories(),
          getTags(user?.id)
        ]);
        setCategories(categoriesRes.data);
        setAvailableTags(tagsRes.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const handleLogout = () => {
    if (window.confirm('确定退出')) {
      logout();
      navigate('/');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const calculateWordCount = (text) => 
        [...text].reduce((count, char) => count + (char.match(/[\u4e00-\u9fa5]/) ? 2 : 1), 0);
      
      // 计算阅读时长（按中文字符计算，假设阅读速度500字/分钟）
      const calculateReadingTime = (text) => {
        const chineseChars = [...text].filter(char => char.match(/[\u4e00-\u9fa5]/)).length;
        return Math.max(1, Math.ceil(chineseChars / 500)); // 至少1分钟
      };
  
      const response = await createNote({
        userId: user.id,
        title: values.title,
        content: values.content,
        categoryId: values.category,
        tags: selectedTags,
        url: imageUrl,
        word_count: calculateWordCount(values.title + values.content),
        is_public: values.is_public,
        view_count: 1, // 初始浏览量为1
        reading_time: calculateReadingTime(values.content) // 计算阅读时长
      });
  
      message.success('笔记创建成功');
      setIsModalVisible(false);
      form.resetFields();
      setSelectedTags([]);
      navigate(`/notes/${response.data.id}`);
    } catch (error) {
      console.error('创建笔记失败:', error);
      message.error(error.response?.data?.error || '创建笔记失败');
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedTags([]);
    setImageUrl(''); // Reset image URL when canceling
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      setImageUploading(true);
      
      // Create FormData with the correct structure as shown in the API
      const formData = new FormData();
      formData.append('file', file); // Key should be 'file' as per API

      // Call uploadImage API
      const response = await uploadImage(formData);
      
      // Extract URL from response (structure shown in API response)
      const imageUrl = response.data.url;

      
      setImageUrl(imageUrl);
      message.success('图片上传成功');
    } catch (error) {
      console.error('图片上传失败:', error);
      message.error(error.response?.data?.message || '图片上传失败');
    } finally {
      setImageUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  // 标签处理函数
  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (removedTag) => {
    setSelectedTags(selectedTags.filter(tag => tag !== removedTag));
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !selectedTags.includes(inputValue)) {
      setSelectedTags([...selectedTags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const selectedKeys = React.useMemo(() => {
    switch (location.pathname) {
      case '/':
        return ['home'];
      case '/categories':
        return ['categories'];
      case '/notes':
        return ['notes'];
      case '/settings':
        return ['settings'];
      case '/profile':
        return ['profile'];
      default:
        return [];
    }
  }, [location.pathname]);

  return (
    <>
      <Header 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'transparent',
          padding: '0 24px',
          height: 64,
          lineHeight: '64px',
        }}
      >
        {/* 用户信息/登录按钮 */}
        <div style={{ flex: 1 }}>
          {user ? (
            <Space onClick={handleLogout} style={{ cursor: 'pointer' }}>
              {user.avatar_url ? (
                <Avatar src={user.avatar_url} />
              ) : (
                <Avatar icon={<UserOutlined />} />
              )}
              <Text style={{ color: '#fff', marginLeft: 8 }}>
                {user.nickname || user.username}
              </Text>
            </Space>
          ) : (
            <Button type="primary" style={{
              background: 'transparent',
              boxShadow: 'none', // 移除阴影
            }} onClick={() => navigate('/login')}>
              登录
            </Button>
          )}
        </div>

        {/* 导航菜单 */}
        <div style={{ display: 'flex', justifyContent: 'center', flex: 2 }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={selectedKeys}
            style={{
              background: 'transparent',
              borderBottom: 'none',
              width: '100%',
              justifyContent: 'center',
            }}
            items={[
              {
                key: 'home',
                label: (
                  <Space size="middle">
                    <HomeOutlined />
                    <span>首页</span>
                  </Space>
                ),
                onClick: () => navigate('/'),
              },
              {
                key: 'categories',
                label: (
                  <Space size="middle">
                    <AppstoreOutlined />
                    <span>分类</span>
                  </Space>
                ),
                onClick: () => navigate('/categories'),
              },
              {
                key: 'notes',
                label: (
                  <Space size="middle">
                    <FolderOutlined />
                    <span>笔记</span>
                  </Space>
                ),
                onClick: () => navigate('/notes'),
              },
              {
                key: 'settings',
                label: (
                  <Space size="middle">
                    <SettingOutlined />
                    <span>设置</span>
                  </Space>
                ),
                onClick: () => navigate('/settings'),
              },
              {
                key: 'profile',
                label: (
                  <Space size="middle">
                    <InfoCircleOutlined />
                    <span>我的</span>
                  </Space>
                ),
                onClick: () => navigate('/profile'),
              },
            ]}
          />
        </div>

        {/* 新建笔记按钮 */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {user && (
            <Button 
              type="text"
              icon={<PlusOutlined />}
              onClick={showModal}
              className="transparent-button"
              style={{ marginLeft: 16 }}
            >
              新建笔记
            </Button>
          )}
        </div>
      </Header>

      {/* 新建笔记模态框 */}
      <Modal
        title="新建笔记"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
            创建
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入笔记标题' }]}
          >
            <Input placeholder="请输入笔记标题" />
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类" loading={loading}>
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
    name="is_public"
    label="可见性"
    initialValue={1}
    rules={[{ required: true, message: '请选择笔记可见性' }]}
  >
    <Radio.Group>
      <Radio value={1}>公开</Radio>
      <Radio value={0}>私有</Radio>
    </Radio.Group>
  </Form.Item>
          <Form.Item label="标签">
            {/* 已选标签区域 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 'bold' }}>已选标签</div>
              {selectedTags.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selectedTags.map(tag => (
                    <Tag 
                      key={tag} 
                      closable 
                      onClose={() => handleTagRemove(tag)}
                      style={{ margin: 0 }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#999' }}>暂无已选标签</div>
              )}
            </div>

            {/* 可选标签区域 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 'bold' }}>可选标签</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {availableTags.filter(t => !selectedTags.includes(t)).map(tag => (
                  <Tag 
                    key={tag} 
                    onClick={() => handleTagSelect(tag)}
                    style={{ cursor: 'pointer', margin: 0 }}
                  >
                    {tag}
                  </Tag>
                ))}
                
                {/* 自定义标签输入 */}
                {inputVisible ? (
                  <Input
                    type="text"
                    size="small"
                    style={{ width: 100 }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                    autoFocus
                  />
                ) : (
                  <Tag 
                    onClick={showInput}
                    style={{ 
                      background: '#fff', 
                      borderStyle: 'dashed',
                      cursor: 'pointer',
                      margin: 0
                    }}
                  >
                    <PlusOutlined /> 新建标签
                  </Tag>
                )}
              </div>
            </div>
          </Form.Item>
          <Form.Item label="封面图片">
            <div 
              style={{ 
                width: '100%', 
                height: 200, 
                backgroundColor: '#f0f0f0', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 4,
                border: '1px dashed #d9d9d9'
              }}
            >
              {!imageUrl ? (
                <Upload
                  name="file"  // Changed to 'file' to match API
                  showUploadList={false}
                  beforeUpload={handleImageUpload}
                  accept="image/*"
                  disabled={imageUploading}
                >
                  <Button 
                    icon={<UploadOutlined />} 
                    loading={imageUploading}
                  >
                    {imageUploading ? '上传中...' : '上传封面图片'}
                  </Button>
                </Upload>
              ) : (
                <Space>
                  <Button 
                    onClick={() => setImageUrl('')}
                    danger
                  >
                    移除图片
                  </Button>
                  <Upload
                    name="file"  // Changed to 'file' to match API
                    showUploadList={false}
                    beforeUpload={handleImageUpload}
                    accept="image/*"
                    disabled={imageUploading}
                  >
                    <Button 
                      icon={<UploadOutlined />} 
                      loading={imageUploading}
                    >
                      更换图片
                    </Button>
                  </Upload>
                </Space>
              )}
            </div>
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入笔记内容' }]}
          >
            <TextArea 
              rows={10} 
              placeholder="请输入笔记内容，可在笔记中编辑（支持Markdown语法）" 
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Navbar;