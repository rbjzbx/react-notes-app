import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/userStore'
import { List, Typography } from 'antd'
import { getPublicNotes } from '@/api/noteApi'
import SiteCard from '@/components/SiteCard/SiteCard'
import TagsCard from '@/components/TagsCard/TagsCard'
import NoteCard from '@/components/NoteCard/NoteCard'
import './Home.css'

const { Title, Text } = Typography

const Home = () => {
  // const navigate = useNavigate()
  const { user } = useStore()
  const [notes, setNotes] = useState([])

  // useEffect(() => {
  //   if (!user) navigate('/login')
  // }, [navigate, user])

  const fetchNotes = async () => {
    try {
      const res = await getPublicNotes()
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
        <Title level={1} className="welcome-title">
          {user?.nickname || user?.username || 'Welcome'}
        </Title>
        <Text className="welcome-subtitle">
          Hope you have a wonderful day!
        </Text></div>
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
          <TagsCard />
        </div>
      </div>
    </>
  )
}

export default Home