import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/userStore'
import { List, Typography } from 'antd'
import { getNotes } from '@/api/noteApi'
import SiteCard from '../../components/SiteCard/SiteCard'
import TagsCard from '../../components/TagsCard/TagsCard'
import NoteCard from '../../components/NoteCard/NoteCard'
import './Notes.css'

const { Title, Text } = Typography

const Notes = () => {
  const navigate = useNavigate()
  const { user } = useStore()
  const [notes, setNotes] = useState([])

  useEffect(() => {
    if (!user) navigate('/login')
  }, [navigate, user])

  const fetchNotes = async () => {
    try {
      const res = await getNotes(user?.id)
      setNotes(res.data)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])
  return (
    <>
          <div className="welcome-container">
          <div className="welcome-content">
        <Title className="welcome-title">
          笔记
        </Title>
      </div></div>
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
          <TagsCard />
        </div>
      </div>
    </>
  );
};

export default Notes;
