import React, { useState, useEffect } from 'react';
import { List, Card, Tag, Typography } from 'antd';
import { getNotesByCategory } from '@/api/noteApi';
import { getCategory } from '../../api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import NoteCard from '../../components/NoteCard/NoteCard';
import SiteCard from '../../components/SiteCard/SiteCard';
import TagsCard from '../../components/TagsCard/TagsCard';
import './CategoryNotes.css'
const { Title, Text } = Typography
const CategoryNotes = () => {
  console.log('CategoryNotes component rendered');
  const { user } = useStore();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [notes, setNotes] = useState([]);
 const[category,setCategory]=useState([]);
  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);
  useEffect(()=>{
    const fetchCategory=async()=>{
      try{
        const fetchCategoryName=await getCategory(categoryId);
        setCategory(fetchCategoryName.data);
      }catch(error){
        alert('获取分类名称失败')
      }
    };
    fetchCategory();
  },[categoryId]);
  useEffect(() => {
    const fetchNotesByCategory = async () => {
      try {
        const fetchedNotes = await getNotesByCategory(user.id, categoryId);
        setNotes(fetchedNotes.data);
      } catch (error) {
        console.error('Failed to fetch notes by category:', error);
        alert('获取笔记失败');
      }
    };

    fetchNotesByCategory();
  }, [categoryId]);

  if (!notes) return <div>Loading...</div>;

  return (
    <>
              <div className="welcome-container">
        <Title className="welcome-title">
          {category.name}
        </Title>
      </div>
    <div className="main-content" >
    <div className="notes-list-container">
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={notes}
            className="p-4"
            pagination={{
              pageSize: 9,
              position: 'bottom',
              style: { 
                display: 'flex',
                justifyContent: 'center',
              },
            }}
            renderItem={(item) => <NoteCard data={item} />}
          />
        </div>
        <div className="sidebar">
          <SiteCard />
          <TagsCard /></div>
        </div>
    </>
  );
};

export default CategoryNotes;
