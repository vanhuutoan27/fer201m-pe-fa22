import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

function Detail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const url = `https://65420b97f0b8287df1ff6477.mockapi.io/api/v1/News/${id}`;
    axios(url)
      .then((response) => {
        const allNews = response.data;
        setNews(allNews);
      })
      .catch((error) => console.log(error.message));
  }, [id]);

  if (!news) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content" style={{ padding: '100px 0' }}>
      <div
        className="news-img"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <h1>{news.title}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ color: '#6b7280', fontWeight: '400' }}>{news.created}</h3>
          <h3 style={{ color: '#6b7280', fontWeight: '400' }}>{news.views} Views</h3>
        </div>
        <img src={news.img} alt={news.title} />
      </div>
      <div className="news-content">
        <p>{news.description}</p>
      </div>
    </div>
  );
}

export default Detail;
