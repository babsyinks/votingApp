import React, { useState, useEffect } from "react";
import Heading from "../../../components/ui/Heading";
import Block from "../../../components/ui/Block";
import AdminFormFieldText from "./AdminFormFieldText";
import AdminFormFieldSelect from "./AdminFormFieldSelect";
import AdminFormFieldTextArea from "./AdminFormFieldTextArea";
import AdminFormFieldFile from "./AdminFormFieldFile";

const AdminFormDetails = ({ setIsDisabled, setFormData, dataSubmitted }) => {
  const [surname, setSurname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [post, setPost] = useState("President");
  const [manifesto, setManifesto] = useState("");
  const [picture, setPicture] = useState("");
  let [resetFile, setResetFile] = useState(0);

  useEffect(() => {
    if ([surname, firstName, post, manifesto, picture].every((v) => !!v)) {
      setIsDisabled(false);
      const formData = new FormData();
      formData.set("surname", surname);
      formData.set("firstName", firstName);
      formData.set("post", post);
      formData.set("manifesto", manifesto);
      formData.set("picture", picture);
      setFormData(formData);
    } else {
      setIsDisabled(true);
    }
  }, [surname, firstName, post, manifesto, picture, setIsDisabled, setFormData]);

  useEffect(() => {
    if (dataSubmitted) {
      setSurname("");
      setFirstName("");
      setPost("President");
      setManifesto("");
      setPicture("");
      setResetFile(++resetFile);
    }
  }, [dataSubmitted, resetFile]);

  return (
    <>
      <Heading className="ta-center">Add A Contestant</Heading>
      <Block type="flex-vert-fs">
        <AdminFormFieldText
          label="Surname"
          name="surname"
          value={surname}
          onChange={(e) => {
            setSurname(e.target.value);
          }}
        />
        <AdminFormFieldText
          label="First Name"
          name="firstName"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
        <AdminFormFieldSelect
          label="Post"
          name="post"
          value={post}
          onChange={(e) => {
            setPost(e.target.value);
          }}
        />
        <AdminFormFieldTextArea
          label="Manifesto"
          name="manifesto"
          value={manifesto}
          onChange={(e) => {
            setManifesto(e.target.value);
          }}
        />
        <AdminFormFieldFile
          label="Upload Picture"
          name="picture"
          resetKey={resetFile}
          onChange={(e) => {
            setPicture(e.target.files[0]);
          }}
        />
      </Block>
    </>
  );
};

export default AdminFormDetails;
