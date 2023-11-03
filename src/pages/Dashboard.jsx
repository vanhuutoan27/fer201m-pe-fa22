import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  Switch,
} from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Dashboard() {
  const url = 'https://65420b97f0b8287df1ff6477.mockapi.io/api/v1/News';
  const [data, setData] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle the "Delete" button click
  const handleDelete = (newsId) => {
    setCurrentId(newsId);
    setDeleteDialogOpen(true);
  };

  // Function to confirm and execute the delete operation
  const confirmDelete = () => {
    if (currentId) {
      axios
        .delete(`${url}/${currentId}`)
        .then((response) => {
          if (response.status === 200) {
            // Successfully deleted, update the list
            setData(data.filter((news) => news.id !== currentId));
          } else {
            console.log('Failed to delete');
          }
        })
        .catch((error) => {
          console.log('Error:', error);
        })
        .finally(() => {
          setDeleteDialogOpen(false);
        });
    }
  };

  // Function to close any open dialogs
  const closeDialog = () => {
    setAddDialogOpen(false);
    setUpdateDialogOpen(false);
    setDeleteDialogOpen(false);
    setCurrentId(null);
  };

  // Formik configuration for adding news
  const addFormik = useFormik({
    initialValues: {
      title: '',
      description: '',
      content: '',
      created: '',
      status: false,
      views: 0,
      attractive: false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      content: Yup.string().required('Content is required'),
      created: Yup.date().required('Created date is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      axios
        .post(url, values)
        .then((response) => {
          if (response.status !== 201) {
            throw new Error('Network response was not ok');
          }
          console.log('Server response:', response.data);
          resetForm();
          setAddDialogOpen(false);
          fetchData(); // Fetch data again to update the list
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    },
  });

  // Function to open the update dialog with data from a specific news item
  const openUpdateDialog = (row) => {
    setCurrentId(row.id);
    axios
      .get(`${url}/${row.id}`)
      .then((response) => {
        if (response.status === 200) {
          // Successfully fetched data and set values for updateFormik initialValues
          updateFormik.setValues(response.data); // Set initial values from the response data
          setUpdateDialogOpen(true);
        } else {
          console.log('Failed to fetch data for update');
        }
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  // Formik configuration for updating news
  const updateFormik = useFormik({
    initialValues: {
      title: data.title || '',
      description: data.description || '',
      content: data.content || '',
      created: data.created || '',
      status: data.status || false,
      views: data.views || 0,
      attractive: data.attractive || false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      content: Yup.string().required('Content is required'),
      created: Yup.date().required('Created date is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      axios
        .put(`${url}/${currentId}`, values)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('Network response was not ok');
          }
          console.log('Server response:', response.data);
          resetForm();
          setUpdateDialogOpen(false);
          fetchData(); // Fetch data again to update the list
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    },
  });

  // Function to fetch news data
  const fetchData = () => {
    axios(url)
      .then((response) => {
        const fetchedData = response.data;
        setData(fetchedData);
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <div className="content" style={{ padding: '100px 0' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '0 40px 20px 0',
        }}
      >
        <Button
          variant="contained"
          style={{ padding: '8px 40px' }}
          onClick={() => setAddDialogOpen(true)}
        >
          Add
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }}>
                Title
              </TableCell>
              <TableCell align="left" style={{ maxWidth: '280px', fontWeight: 'bold' }}>
                Description
              </TableCell>
              <TableCell align="left" style={{ maxWidth: '480px', fontWeight: 'bold' }}>
                Created At
              </TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }}>
                Views
              </TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }}>
                Status
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell style={{ maxWidth: '280px' }}>{row.title}</TableCell>
                <TableCell style={{ maxWidth: '480px' }}>{row.description}</TableCell>
                <TableCell>{row.created}</TableCell>
                <TableCell>{row.views}</TableCell>
                <TableCell>{row.status ? 'Active' : 'Inactive'}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    style={{ marginRight: '12px' }}
                    onClick={() => openUpdateDialog(row)}
                  >
                    Update
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDelete(row.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding news */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle style={{ fontSize: '20px', fontWeight: 'bold' }}>Add News</DialogTitle>
        <DialogContent>
          <form onSubmit={addFormik.handleSubmit} style={{ marginTop: '8px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  name="title"
                  value={addFormik.values.title}
                  onChange={addFormik.handleChange}
                  error={addFormik.touched.title && Boolean(addFormik.errors.title)}
                  helperText={addFormik.touched.title && addFormik.errors.title}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={addFormik.values.description}
                  onChange={addFormik.handleChange}
                  error={addFormik.touched.description && Boolean(addFormik.errors.description)}
                  helperText={addFormik.touched.description && addFormik.errors.description}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={3}
                  label="Content"
                  name="content"
                  value={addFormik.values.content}
                  onChange={addFormik.handleChange}
                  error={addFormik.touched.content && Boolean(addFormik.errors.content)}
                  style={{ width: '100%', marginBottom: '8px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  name="created"
                  value={addFormik.values.created}
                  onChange={addFormik.handleChange}
                  error={addFormik.touched.created && Boolean(addFormik.errors.created)}
                  helperText={addFormik.touched.created && addFormik.errors.created}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="Views"
                  name="views"
                  value={addFormik.values.views}
                  onChange={addFormik.handleChange}
                  error={addFormik.touched.views && Boolean(addFormik.errors.views)}
                  helperText={addFormik.touched.views && addFormik.errors.views}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <Switch
                  name="status"
                  checked={addFormik.values.status}
                  onChange={addFormik.handleChange}
                  color="primary"
                  style={{ marginBottom: '8px' }}
                />
                Status
              </Grid>
              <Grid item xs={6}>
                <Switch
                  name="attractive"
                  checked={addFormik.values.attractive}
                  onChange={addFormik.handleChange}
                  color="primary"
                  style={{ marginBottom: '8px' }}
                />
                Attractive
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={addFormik.handleSubmit}
            variant="contained"
            color="primary"
            style={{ marginBottom: '2%', marginRight: '2%' }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for updating news */}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
        <DialogTitle style={{ fontSize: '20px', fontWeight: 'bold' }}>Update News</DialogTitle>
        <DialogContent>
          <form onSubmit={updateFormik.handleSubmit} style={{ marginTop: '8px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  name="title"
                  value={updateFormik.values.title}
                  onChange={updateFormik.handleChange}
                  error={updateFormik.touched.title && Boolean(updateFormik.errors.title)}
                  helperText={updateFormik.touched.title && updateFormik.errors.title}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={updateFormik.values.description}
                  onChange={updateFormik.handleChange}
                  error={
                    updateFormik.touched.description && Boolean(updateFormik.errors.description)
                  }
                  helperText={updateFormik.touched.description && updateFormik.errors.description}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={3}
                  label="Content"
                  name="content"
                  value={updateFormik.values.content}
                  onChange={updateFormik.handleChange}
                  error={updateFormik.touched.content && Boolean(updateFormik.errors.content)}
                  style={{ width: '100%', marginBottom: '8px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  name="created"
                  value={updateFormik.values.created}
                  onChange={updateFormik.handleChange}
                  error={updateFormik.touched.created && Boolean(updateFormik.errors.created)}
                  helperText={updateFormik.touched.created && updateFormik.errors.created}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="Views"
                  name="views"
                  value={updateFormik.values.views}
                  onChange={updateFormik.handleChange}
                  error={updateFormik.touched.views && Boolean(updateFormik.errors.views)}
                  helperText={updateFormik.touched.views && updateFormik.errors.views}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>

              <Grid item xs={6}>
                <Switch
                  name="status"
                  checked={updateFormik.values.status}
                  onChange={updateFormik.handleChange}
                  color="primary"
                  style={{ marginBottom: '8px' }}
                />
                Status
              </Grid>

              <Grid item xs={6}>
                <Switch
                  name="attractive"
                  checked={updateFormik.values.attractive}
                  onChange={updateFormik.handleChange}
                  color="primary"
                  style={{ marginBottom: '8px' }}
                />
                Attractive
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={updateFormik.handleSubmit}
            variant="contained"
            color="primary"
            style={{ marginBottom: '2%', marginRight: '2%' }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for deleting news */}
      <Dialog open={deleteDialogOpen} onClose={closeDialog}>
        <DialogTitle style={{ fontSize: '20px', fontWeight: 'bold' }}>Delete News</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete News {currentId}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary" style={{ color: '#000' }}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            style={{ marginBottom: '2%', marginRight: '2%' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dashboard;
