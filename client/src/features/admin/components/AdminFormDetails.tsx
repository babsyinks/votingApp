import Block from "components/ui/Block";
import Heading from "components/ui/Heading";
import React, { useState, useEffect } from "react";

import AdminFormFieldFile from "./AdminFormFieldFile";
import AdminFormFieldSelect from "./AdminFormFieldSelect";
import AdminFormFieldText from "./AdminFormFieldText";
import AdminFormFieldTextArea from "./AdminFormFieldTextArea";

/**
 * Props for the AdminFormDetails component.
 */
export interface AdminFormDetailsProps {
  /** Setter to enable or disable form submission button */
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  /** Setter to provide the composed FormData back to parent */
  setFormData: React.Dispatch<React.SetStateAction<FormData | null>>;
  /** Flag to indicate that data was submitted successfully and fields should reset */
  dataSubmitted: boolean;
}

/**
 * Admin form component for adding a contestant.
 * Handles local state, resets on submission, and passes back FormData.
 *
 * @param props - Component props
 * @returns The rendered AdminFormDetails component.
 */
const AdminFormDetails: React.FC<AdminFormDetailsProps> = ({
  setIsDisabled,
  setFormData,
  dataSubmitted,
}) => {
  const [surname, setSurname] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [post, setPost] = useState<string>("President");
  const [manifesto, setManifesto] = useState<string>("");
  const [picture, setPicture] = useState<File | null>(null);
  const [resetFile, setResetFile] = useState<number>(0);

  useEffect(() => {
    if (surname && firstName && post && manifesto && picture) {
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
      setPicture(null);
      setResetFile((prev) => prev + 1);
    }
  }, [dataSubmitted]);

  return (
    <>
      <Heading className="ta-center">Add A Contestant</Heading>
      <Block type="flex-vert-fs">
        <AdminFormFieldText
          label="Surname"
          name="surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <AdminFormFieldText
          label="First Name"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <AdminFormFieldSelect
          label="Post"
          name="post"
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
        <AdminFormFieldTextArea
          label="Manifesto"
          name="manifesto"
          value={manifesto}
          onChange={(e) => setManifesto(e.target.value)}
        />
        <AdminFormFieldFile
          label="Upload Picture"
          name="picture"
          resetFile={resetFile}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setPicture(file);
          }}
        />
      </Block>
    </>
  );
};

export default AdminFormDetails;
