import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const url = 'https://65420b97f0b8287df1ff6477.mockapi.io/api/v1/News';
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios(url)
      .then((response) => {
        const allNews = response.data;
        // Sort by Tile
        const sortedByTitle = [...allNews].sort((a, b) => a.title.localeCompare(b.title));

        // Sort by Created Date
        const sortedByCreated = [...allNews].sort(
          (b, a) => new Date(a.created) - new Date(b.created)
        );

        // Sort by Status
        const sortedStatus = allNews.filter((news) => news.status === true);

        // Sort by Attractive
        const sortedAttractive = allNews.filter((news) => news.attractive === true);

        // Sort by Views
        const sortedByViews = [...allNews].sort((a, b) => a.views - b.views);

        setNews(sortedAttractive);
      })
      .catch((error) => console.log(error.message));
  }, []);

  return (
    <div className="content" style={{ padding: '120px 0' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {news.map((newItem) => (
            <Grid item xs={2} sm={4} md={4} key={newItem.id}>
              <Card
                sx={{ maxWidth: 360 }}
                style={{ minHeight: '760px', margin: '40px 0 40px 20px', borderRadius: '8px' }}
              >
                <CardActionArea>
                  <CardMedia component="img" height="320" image={newItem.img} alt={newItem.title} />
                  <CardContent
                    style={{
                      minHeight: '370px',
                    }}
                  >
                    <Typography
                      style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}
                    >
                      {newItem.title}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: '16px',
                        color: '#6b7280',
                        marginBottom: '12px',
                      }}
                    >
                      {newItem.description}
                    </Typography>
                    <Typography style={{ fontSize: '20px', color: '#6b7280' }}>
                      {newItem.created}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Link
                    to={`/detail/${newItem.id}`}
                    style={{
                      margin: '8px auto',
                    }}
                  >
                    <Button
                      size="medium"
                      style={{
                        padding: '12px 100px',
                        background: '#1950d2',
                        color: '#fff',
                        fontWeight: '600',
                      }}
                    >
                      <VisibilityIcon style={{ marginRight: '8px' }} />
                      View Detail
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default Home;
