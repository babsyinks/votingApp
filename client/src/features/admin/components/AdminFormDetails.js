import React, { useState, useEffect, memo } from "react";
import Heading from "../../../components/ui/Heading";
import Input from "../../../components/ui/Input";
import Block from "../../../components/ui/Block";
import Label from "../../../components/ui/Label";
import Select from "../../../components/ui/Select";
import TextArea from "../../../components/ui/TextArea";
import getOptions from "../helpers/options";

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
  }, [
    surname,
    firstName,
    post,
    manifesto,
    picture,
    setIsDisabled,
    setFormData,
  ]);

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

  const custom = { custClass: "wd-md bld" };
  const blockProp = { type: "flex-horz-fs", custom: { custClass: "sp-2" } };
  return (
    <>
      <Heading>Add A Contestant</Heading>
      <Block type="flex-vert-fs">
        <Block {...blockProp}>
          <Label name="surname" custom={custom}>
            Surname:
          </Label>
          <Input
            type="text"
            name="surname"
            value={surname}
            onChange={(e) => {
              setSurname(e.target.value);
            }}
          />
        </Block>
        <Block {...blockProp}>
          <Label name="firstName" custom={custom}>
            First Name:
          </Label>
          <Input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
        </Block>
        <Block {...blockProp}>
          <Label name="post" custom={custom}>
            Post:
          </Label>
          <Select
            name="post"
            value={post}
            onChange={(e) => {
              setPost(e.target.value);
            }}
            selectOptions={getOptions()}
          />
        </Block>
        <Block {...blockProp}>
          <Label name="manifesto" custom={custom}>
            Manifesto:
          </Label>
          <TextArea
            name="manifesto"
            value={manifesto}
            onChange={(e) => {
              setManifesto(e.target.value);
            }}
          />
        </Block>
        <Block {...blockProp}>
          <Label name="picture" custom={custom}>
            Upload Picture:
          </Label>
          <Input
            type="file"
            name="picture"
            resetKey={resetFile}
            onChange={(e) => {
              setPicture(e.target.files[0]);
            }}
          />
        </Block>
      </Block>
    </>
  );
};

export default memo(AdminFormDetails);
