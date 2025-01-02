import React, { useState } from "react";
import { List, Button, message, Modal, Form, Input } from "antd";
import axios from "axios";
import moment from "moment";

const Note = ({ note, setNotes, notes }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleDelete = async () => {
    try {
      await axios.delete(`/notes/${note.id}`);
      setNotes(notes.filter((n) => n.id !== note.id));
      message.success("Note deleted successfully");
    } catch (error) {
      message.error("Failed to delete note");
    }
  };

  const handleEdit = async (values) => {
    try {
      await axios.put(`/notes/${note.id}`, values);
      setNotes(notes.map((n) => (n.id === note.id ? { ...n, ...values } : n)));
      message.success("Note updated successfully");
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update note");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue(note);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return moment(date).format("MMMM Do YYYY, h:mm a");
  };

  return (
    <>
      <List.Item
        actions={[
          <span className="note-date">{formatDate(note.id)}</span>,
          <Button type="link" onClick={showModal}>
            Edit
          </Button>,
          <Button type="link" danger onClick={handleDelete}>
            Delete
          </Button>,
        ]}
        className="note-item"
      >
        <List.Item.Meta title={note.title} description={note.content} />
      </List.Item>
      <Modal
        title="Edit Note"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleEdit}>
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
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Note;
