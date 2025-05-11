import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Button, message, Empty, Modal, Spin } from 'antd';
import { getNote, updateNote, deleteNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '../../utils/dateFormatter';
import './Note.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import MarkdownNavbar from 'markdown-navbar';
import 'markdown-navbar/dist/navbar.css';
import ReactMarkdownEditorLite from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import prism from 'prismjs';
import 'prismjs/themes/prism.css';
const { Title, Text } = Typography;

const Note = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);
  const editorRef = useRef(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        setLoading(true);
        const fetchedNote = await getNote(id);
        setNote(fetchedNote.data);
        setMarkdown(fetchedNote.data.content);
        // 检查当前用户是否是笔记所有者
        setIsOwner(user ? user.id === fetchedNote.data.user_id : false);
      } catch (error) {
        console.error('获取笔记详情失败:', error);
        setError(error);
        message.error('获取笔记详情失败');
        navigate('/notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNoteDetails();
  }, [id, navigate, user]); // 添加user到依赖项

  const handleEditorChange = ({ html, text }) => {
    if (isOwner) {
      setMarkdown(text);
    }
  };

  const hasHeadings = () => {
    if (!markdown) return false;
    const lines = markdown.split('\n');
    return lines.some(line => line.trim().match(/^#+\s/) && !line.trim().startsWith('```'));
  };

  const handleSave = async () => {
    if (!isOwner) return;
    
    try {
      await updateNote(id, { content: markdown });
      message.success('保存成功');
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  const handleImageUpload = () => {
    if (!isOwner) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          if (data.url) {
            editorRef.current.insertText(`![${file.name}](${data.url})`);
          } else {
            message.error('图片上传失败');
          }
        } catch (error) {
          console.error('图片上传失败:', error);
          message.error('图片上传失败');
        }
      }
    };
    input.click();
  };

  useEffect(() => {
    hljs.highlightAll();
    prism.highlightAll();
  }, [markdown]);

  const handleDelete = () => {
    if (!isOwner) return;
    
    Modal.confirm({
      title: '确认删除笔记',
      content: '确定要删除这篇笔记吗？删除后可以联系管理员恢复',
      okText: '确认删除',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteNote(id);
          message.success('笔记已删除');
          navigate('/notes');
        } catch (error) {
          console.error('删除笔记失败:', error);
          message.error(error.response?.data?.message || '删除失败');
        }
      },
    });
  };

  if (loading) return <Spin tip="加载中..." size="large" style={{ width: '100%', marginTop: '20%' }} />;
  if (error) return <div className="error-message">加载笔记失败，请稍后再试</div>;
  if (!note) return <Empty description="未找到笔记" />;

  return (
    <div className="note-container">
      <div className="welcome-container">
        <div className="welcome-content">
          <Title level={1} className="welcome-title">
            {note.title}
          </Title>
          <Text className="welcome-meta">
  <span className="welcome-date">
    <img 
      src="/static/create.png" 
      alt="创建时间" 
      style={{ width: 16, height: 16, marginRight: 4, verticalAlign: 'middle' }}
    />
    发表于 {formatDate(note.created_at)} | 
    <img 
      src="/static/update.png" 
      alt="更新时间" 
      style={{ width: 16, height: 16, marginLeft: 8, marginRight: 4, verticalAlign: 'middle' }}
    />
    更新至 {formatDate(note.updated_at)}
  </span>
  <span className="welcome-stats">
    <img 
      src="/static/word_count.png" 
      alt="字数统计" 
      style={{ width: 16, height: 16, marginLeft: 8, marginRight: 4, verticalAlign: 'middle' }}
    />
    字数总计: {note.word_count} | 
    <img 
      src="/static/reading_time.png" 
      alt="阅读时长" 
      style={{ width: 16, height: 16, marginLeft: 8, marginRight: 4, verticalAlign: 'middle' }}
    />
    阅读时长: {note.reading_time}分钟 | 
    <img 
      src="/static/view_count.png" 
      alt="阅读量" 
      style={{ width: 16, height: 16, marginLeft: 8, marginRight: 4, verticalAlign: 'middle' }}
    />
    阅读量: {note.view_count}
  </span>
</Text>
        </div>
      </div>
      <div className="content-container" ref={contentRef}>
        <Card className="content-card">
          {isOwner ? (
            <ReactMarkdownEditorLite
              ref={editorRef}
              value={markdown}
              onChange={handleEditorChange}
              renderHTML={(text) => (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <pre className={className}>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {text}
                </ReactMarkdown>
              )}
            />
          ) : (
            <div className="markdown-preview">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <pre className={className}>
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          )}

          {isOwner && (
            <div className="editor-toolbar">
              <Button onClick={handleImageUpload}>上传图片</Button>
              <Button onClick={handleSave}>保存</Button>
              <Button 
                danger 
                onClick={handleDelete}
                style={{ marginLeft: 'auto' }}
              >
                删除笔记
              </Button>
            </div>
          )}
        </Card>
        
        <Card className="directory-card">
          <h2>目录</h2>
          {hasHeadings() ? (
            <MarkdownNavbar
              source={markdown}
              ordered={false}
              headingTopOffset={80}
              updateHashAuto={true}
              declarative={true}
              className="markdown-navigation"
            />
          ) : (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无目录"
              style={{ marginTop: 20 }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Note;