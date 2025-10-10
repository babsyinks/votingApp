import React, { MouseEventHandler } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectLoadingState } from "../../../app/loaderSlice";
import AdminDataToolTipBtn from "./AdminDataToolTipBtn";
import tooltipBtnDetails from "../helpers/tooltipBtnDetails";
import I from "components/ui/I";

export interface AdminDataToolTipsBtnsListProps {
  /** Whether the submit button should be disabled */
  isSubmitBtnDisabled: boolean;
  /** Handler to submit values when the submit button is clicked */
  handleSubmitVals: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Represents the shape of each tooltip button detail returned by tooltipBtnDetails().
 */
interface TooltipBtnDetail {
  data: string;
  compClass: string;
  route: string;
  iClasses: string;
}

/**
 * A list of admin tooltip buttons used in the admin panel.
 *
 * @param props - The component props.
 * @returns The rendered list of AdminDataToolTipBtn components.
 */
const AdminDataToolTipsBtnsList: React.FC<AdminDataToolTipsBtnsListProps> = ({
  isSubmitBtnDisabled,
  handleSubmitVals,
}) => {
  const navigate = useNavigate();
  const isLoading = useSelector(selectLoadingState);

  // Type assertion: ensure the helper returns the expected shape
  const listDetails = tooltipBtnDetails() as TooltipBtnDetail[];

  /**
   * Generates a navigation function for a given route.
   *
   * @param route - The route to navigate to.
   * @returns A function that navigates to the route when called.
   */
  const navigateFn = (route: string): MouseEventHandler<HTMLButtonElement> => {
    return () => {
      navigate(route);
    };
  };

  return (
    <>
      {listDetails.map(({ data, compClass, route, iClasses }, i) => {
        if (data === "Add A New Contestant") {
          const classes = isLoading ? "fa-circle-notch fa-spin fa-xs" : iClasses;
          return (
            <AdminDataToolTipBtn
              data={data}
              disabled={isSubmitBtnDisabled}
              className={compClass}
              onClick={handleSubmitVals}
              key={i}
            >
              <I
                className={`fas ${classes}`}
                aria-disabled={isSubmitBtnDisabled}
              />
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
            <I className={`fas ${iClasses}`} />
          </AdminDataToolTipBtn>
        );
      })}
    </>
  );
};

export default AdminDataToolTipsBtnsList;
