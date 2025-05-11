import React from 'react'
import { Card, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import './NoteCard.css'

const NoteCard = ({ data }) => {
  const navigate = useNavigate()

  return (
    <div 
      className="note-card-container"
      onClick={() => navigate(`/notes/${data.id}`)}
    >
      <Card
        hoverable
        style={{ 
                    width: '340px', 
                    height: '350px', 
                    overflow: 'hidden',
                    position: 'relative',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
        cover={
          data.url ? (
            <div 
              className="note-card-cover"
              style={{ backgroundImage: `url(${data.url})` }}
            >
              <h3 className="note-card-title">{data.title}</h3>
            </div>
          ) : (
            <div className="note-card-cover-default">
              <h3 className="note-card-title">{data.title}</h3>
            </div>
          )
        }
      >
        <div>
          <div className="note-card-tags my-3">
            {data.tags?.map((tag) => (
              <Tag color="cyan" key={tag}>
                {tag}
              </Tag>
            ))}
          </div>
          <p className="note-card-desc">
          {
  data.content 
    ? (data.content.length > 100 
        ? data.content.substring(0, 100) + '...' 
        : data.content)
    : '内容为空'
}
          </p>
        </div>
      </Card>
    </div>
  )
}

export default NoteCard