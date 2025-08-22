import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectLoadingState } from "../../../app/loaderSlice";
import AdminDataToolTipBtn from "./AdminDataToolTipBtn";
import tooltipBtnDetails from "../helpers/tooltipBtnDetails";
import I from "components/ui/I";

const AdminDataToolTipsBtnsList = ({
  isSubmitBtnDisabled,
  handleSubmitVals,
}) => {
  const navigate = useNavigate();
  const isLoading = useSelector(selectLoadingState);

  const listDetails = tooltipBtnDetails();

  const navigateFn = (route) => {
    return () => {
      navigate(route);
    };
  };

  return (
    <>
      {listDetails.map(({ data, compClass, route, iClasses }, i) => {
        if (data === "Add A New Contestant") {
          const classes = isLoading
            ? "fa-circle-notch fa-spin fa-xs"
            : iClasses;
          return (
            <AdminDataToolTipBtn
              data={data}
              disabled={isSubmitBtnDisabled}
              className={compClass}
              onClick={handleSubmitVals}
              key={i}
            >
              <I className={`fas ${classes}`}></I>
            </AdminDataToolTipBtn>
          );
        }
        return (
          <AdminDataToolTipBtn
            data={data}
            className={compClass}
            onClick={navigateFn(route)}
            key={i}
          >
            <I className={`fas ${iClasses}`}></I>
          </AdminDataToolTipBtn>
        );
      })}
    </>
  );
};

export default AdminDataToolTipsBtnsList;
