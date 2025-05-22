import React, { useState, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminAuth } from "../features/auth/admin/adminAuthSlice";
import { useAxios } from "../hooks/useAxios";
import { useToastMessage } from "../hooks/useToastMessage";
import Container from "../layout/Container";
import Block from "../components/ui/Block";
import ToastMessage from "../components/ui/ToastMessage";
import AdminFormDetails from "../features/admin/components/AdminFormDetails";
import AdminDataToolTipsBtnsList from "../features/admin/components/AdminDataToolTipsBtnsList";

const Admin = () => {
  const [submitData, setSubmitData] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [formData, setFormData] = useState(null);
  const { toast, triggerToast, toastDetailsSet } = useToastMessage();
  const navigate = useNavigate();
  const adminAuthenticated = useSelector(adminAuth);
  const { response, error, triggerRequest } = useAxios();

  useEffect(() => {
    if (!adminAuthenticated) {
      navigate("/");
    }
  }, [adminAuthenticated, navigate]);

  useEffect(() => {
    if (submitData) {
      const submitForm = async () => {
        await triggerRequest({
          params: {
            method: "POST",
            url: "/election/contestants",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          },
          useDefaultJsonHeader: false,
        });
        setFormData(null);
        setSubmitData(false);
      };
      submitForm();
    }
  }, [formData, triggerRequest, submitData]);

  useEffect(() => {
    if (response) {
      triggerToast({
        status: "success",
        message: "New Contestant Successfully Added!!!",
      });
    }
  }, [response, triggerToast]);

  useEffect(() => {
    if (error) {
      triggerToast({
        status: "failed",
        message: `${error.message || "Something went wrong!"}`,
      });
    }
  }, [error, triggerToast]);

  const handleSubmitVals = async () => {
    setSubmitData(true);
  };

  const backgroundImage =
    "linear-gradient(to right, var(--grad-pink-start), var(--grad-orange), var(--grad-yellow), var(--grad-green), var(--grad-violet), var(--grad-purple), var(--grad-pink-end))";

  return (
    <Container backgroundImage={backgroundImage}>
      {toastDetailsSet() && <ToastMessage toast={toast} />}
      <AdminFormDetails
        dataSubmitted={submitData}
        setFormData={setFormData}
        setIsDisabled={setIsDisabled}
      />
      <Block type="flex-horz-sb" custom={{ custClass: "sp-2" }}>
        <AdminDataToolTipsBtnsList
          handleSubmitVals={handleSubmitVals}
          isSubmitBtnDisabled={isDisabled}
        />
      </Block>
    </Container>
  );
};

export default memo(Admin);
