import React, { useState, useEffect } from "react";
import {
  List,
  Input,
  Button,
  Select,
  Row,
  Col,
  message,
  Modal,
  Form,
} from "antd";
import axios from "axios";
import Note from "./Note";
import "./App.css"; // Import App.css instead of Notes.css

const { Option } = Select;

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("title");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, searchTerm, sortType]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("/notes");
      setNotes(response.data);
    } catch (error) {
      message.error("Failed to fetch notes");
    }
  };

  const filterAndSortNotes = () => {
    let filtered = notes.filter(
      (note) =>
        note?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note?.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortType === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === "creationDateAsc") {
      filtered.sort((a, b) => a.id - b.id);
    } else if (sortType === "creationDateDesc") {
      filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredNotes(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value) => {
    setSortType(value);
  };

  const handleAddNote = async (values) => {
    const newNote = { id: Date.now(), ...values };
    try {
      await axios.post("/notes", newNote);
      setNotes([...notes, newNote]);
      message.success("Note added successfully");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to add note");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="notes-container">
      <Row gutter={16} className="notes-controls">
        <Col>
          <Input
            placeholder="Search notes"
            onChange={handleSearch}
            style={{ width: 200 }}
          />
        </Col>
        <Col>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <b
              style={{
                marginRight: "10px",
                fontSize: "12px",
              }}
            >
              Sort By
            </b>
            <Select
              defaultValue="title"
              onChange={handleSortChange}
              style={{ width: 200 }}
              allowClear
            >
              <Option value="title">Title</Option>
              <Option value="creationDateAsc">Creation Date (Ascending)</Option>
              <Option value="creationDateDesc">
                Creation Date (Descending)
              </Option>
            </Select>
          </div>
        </Col>
        <Col>
          <Button type="primary" onClick={showModal}>
            Add Note
          </Button>
        </Col>
      </Row>
      <List
        itemLayout="horizontal"
        dataSource={filteredNotes}
        renderItem={(note) => (
          <Note key={note.id} note={note} setNotes={setNotes} notes={notes} />
        )}
        className="notes-list"
      />
      <Modal
        title="Add Note"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleAddNote}>
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            name="content"
            rules={[{ required: true, message: "Please input the content!" }]}
          >
            <Input.TextArea rows={4} placeholder="Content" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Notes;
