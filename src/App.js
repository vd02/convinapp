import React, { useState, useEffect } from "react";
import date1 from "date-and-time";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Form,
  Navbar,
} from "react-bootstrap";
import ReactPlayer from "react-player";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import Modal from "react-bootstrap/Modal";

// const api = "http://localhost:5000/users";

const initialState = {
  name: "",
  email: "",
  contact: "",
  address: "",
  isViewed: "false",
};

function App() {
  const [state, setState] = useState(initialState);
  const [data, setData] = useState([]);
  // const [arr, setarr] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { name, email, contact } = state;
  useEffect(() => {
    loadUsers();
  }, []);
  const loadUsers = async () => {
    const devEnv = process.env.NODE_ENV !== "production";
    const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;
    const response = await axios.get(
      `${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}`
    );
    setData(response.data);
  };

  const [ytUrl, setytUrl] = useState(
    "https://www.youtube.com/watch?v=_MgOP0CBFh4&ab_channel=Convin"
  );

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleView = (id) => {
    showModal();
    const item1 = data.find((item) => item.id === id);
    setytUrl(item1.email);
    // let { isViewed } = item1;
    item1.isViewed = "true";
    const now = new window.Date();
    item1.date = date1.format(now, "YYYY/MM/DD HH:mm:ss");
    console.log(item1);
    setState({ ...item1 });
    // console.log(isViewed);
  };

  const handleUpdate = (id) => {
    const singleUser = data.find((item) => item.id === id);
    setState({ ...singleUser });
    setUserId(id);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const devEnv = process.env.NODE_ENV !== "production";
      const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;
      axios.delete(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/${id}`);
      toast.success("Deleted Successfully");
      setTimeout(() => loadUsers(), 500);
    }
  };

  const handleDeleteByBucket = async (name) => {
    if (window.confirm("Are you sure you want to delete the bucket?")) {
      const devEnv = process.env.NODE_ENV !== "production";
      const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;
      const arr1 = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].contact === name) {
          arr1.push(data[i].id);
        }
      }
      // console.log(arr1);
      // console.log(arr1.id);
      // console.log(arr1[0].id);
      for (let i = 0; i < arr1.length; i++) {
        axios.delete(
          `${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/${arr1[i]}`
        );
        setTimeout(() => loadUsers(), 500);
      }
      toast.success("Deleted Successfully");
      setTimeout(() => loadUsers(), 500);
    }
  };

  const [isOpen, setIsOpen] = React.useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const arr = [];
  for (let i = 0; i < data.length; i++) {
    if (!arr.includes(data[i].contact)) {
      arr.push(data[i].contact);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !contact) {
      toast.error("Please fill all the fields");
    } else {
      if (!editMode) {
        const devEnv = process.env.NODE_ENV !== "production";
        const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;
        axios.post(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}`, state);
        toast.success("Added Successfully");
        setState({ name: "", email: "", contact: "", address: "" });
        setTimeout(() => loadUsers(), 500);
      } else {
        const devEnv = process.env.NODE_ENV !== "production";
        const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;
        axios.put(
          `${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/${userId}`,
          state
        );
        toast.success("Updated Successfully");
        setState({ name: "", email: "", contact: "", address: "" });
        setTimeout(() => loadUsers(), 500);
        setUserId(null);
        setEditMode(false);
      }
    }
  };

  return (
    <>
      <Modal show={isOpen} onHide={hideModal} size="lg">
        <Modal.Header>
          <Modal.Title className="mx-auto my-2">
            Hello, Watch the video and have fun :)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="mx-auto my-2">
          <ReactPlayer url={ytUrl} />
        </Modal.Body>
        <Modal.Footer className="mx-auto my-2">
          <button onClick={hideModal}>Cancel</button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
      <Navbar
        bg="primary"
        variant="dark"
        className="justify-content-center mb-4"
      >
        <Navbar.Brand>Conwin Application by Varun Dixit</Navbar.Brand>
      </Navbar>
      <Container>
        <Row>
          <Col md={4}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label style={{ textAlign: "left" }}>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label style={{ textAlign: "left" }}>URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="URL"
                  name="email"
                  value={email}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label style={{ textAlign: "left" }}>
                  Bucket Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Bucket Name"
                  name="contact"
                  value={contact}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>

              <div className="d-grid gap-p mt-2">
                <Button type="submit" variant="primary" size="md">
                  {editMode ? "Update" : "Submit"}
                </Button>
              </div>
            </Form>
          </Col>
          <Col md={8}>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Link</th>
                  <th>Bucket Name</th>
                  <th>Options</th>
                  {/*<th>No.</th> */}
                </tr>
              </thead>
              {data &&
                data.map((item, index) => (
                  <tbody key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.contact}</td>
                      {/* <td>{item.address}</td> */}
                      <td>
                        <ButtonGroup>
                          <Button
                            variant="primary"
                            style={{ marginRight: "5px" }}
                            onClick={() => handleView(item.id)}
                            size="sm"
                          >
                            View
                          </Button>
                          <Button
                            variant="secondary"
                            style={{ marginRight: "5px" }}
                            onClick={() => handleUpdate(item.id)}
                            size="sm"
                          >
                            Update
                          </Button>
                          <Button
                            variant="danger"
                            style={{ marginRight: "5px" }}
                            onClick={() => handleDelete(item.id)}
                            size="sm"
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  </tbody>
                ))}
            </Table>
            {arr.map((element, index) => {
              index = Math.floor(Math.random() * arr.size);
              return (
                <Button
                  key={index}
                  variant="danger"
                  style={{ marginRight: "5px" }}
                  size="sm"
                  onClick={() => handleDeleteByBucket(element)}
                >
                  {`Delete Bucket: ${element}`}
                </Button>
              );
            })}
          </Col>
        </Row>
      </Container>
      <h2
        style={{ display: "flex", justifyContent: "center" }}
        className="mx-5"
      >
        History
      </h2>
      <Table bordered hover className="mx-auto">
        <thead>
          <tr>
            {/* <th>No.</th> */}
            <th>Name</th>
            <th>Link</th>
            <th>Bucket Name</th>
            <th>Date</th>
          </tr>
        </thead>
        {data &&
          data.map((item, index) =>
            item.isViewed === "true" ? (
              <tbody key={index}>
                <tr>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.contact}</td>
                  <td>{item.date}</td>
                </tr>
              </tbody>
            ) : null
          )}
      </Table>
    </>
  );
}

export default App;
