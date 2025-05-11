import React, { useState, useEffect } from 'react';
import { List, Card, Typography } from 'antd';
import { getCategories } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import './Categories.css';

const { Title } = Typography;

const Categories = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        alert('获取分类失败');
      }
    };

    fetchCategoriesData();
  }, []);

  return (
<div className="min-h-screen ">
        {/* 标题部分 */}
        <div className="welcome-container">
        <div className="welcome-content">
        <Title className="welcome-title">
          分类
        </Title>
      </div></div>
    
      
      {/* 主要内容容器 - 增加左右padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 分类卡片列表 */}
        <List
          grid={{ 
            gutter: 32,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4
          }}
          dataSource={categories}
          renderItem={(item) => (
            <List.Item>
              <Card 
                hoverable 
                className="h-full transition-all duration-300 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg"
                bodyStyle={{ padding: 0 }}
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex-grow">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-lg font-semibold">
                          {item.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <a 
                      href={`/notes/categories/${item.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
                    >
                      查看笔记
                      <svg 
                        className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Categories;