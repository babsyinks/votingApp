import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminFormDetails from "features/admin/components/AdminFormDetails";

jest.mock("components/ui/Heading", () => ({ children, className }) => (
  <h1 data-testid="heading" className={className}>
    {children}
  </h1>
));

jest.mock("components/ui/Block", () => ({ children, type }) => (
  <div data-testid="block" data-type={type}>
    {children}
  </div>
));

jest.mock("features/admin/components/AdminFormFieldText", () => ({ label, name, value, onChange }) => (
  <div data-testid={`text-${name}`}>
    <label htmlFor={name}>{label}</label>
    <input type="text" id={name} name={name} value={value} onChange={onChange} />
  </div>
));

jest.mock("features/admin/components/AdminFormFieldSelect", () => ({ label, name, value, onChange }) => (
  <div data-testid={`select-${name}`}>
    <label htmlFor={name}>{label}</label>
    <select id={name} name={name} value={value} onChange={onChange}>
      <option value="president">President</option>
      <option value="vice president">Vice President</option>
    </select>
  </div>
));

jest.mock("features/admin/components/AdminFormFieldTextArea", () => ({ label, name, value, onChange }) => (
  <div data-testid={`textarea-${name}`}>
    <label htmlFor={name}>{label}</label>
    <textarea id={name} name={name} value={value} onChange={onChange} />
  </div>
));

jest.mock("features/admin/components/AdminFormFieldFile", () => ({ label, name, resetKey, onChange }) => (
  <div data-testid={`file-${name}`}>
    <label htmlFor={name}>{label}</label>
    <input type="file" id={name} name={name} onChange={onChange} />
  </div>
));

describe("AdminFormDetails", () => {
  let setIsDisabled, setFormData;

  beforeEach(() => {
    setIsDisabled = jest.fn();
    setFormData = jest.fn();
  });

  it("renders all form fields", () => {
    render(
      <AdminFormDetails
        setIsDisabled={setIsDisabled}
        setFormData={setFormData}
        dataSubmitted={false}
      />,
    );

    expect(screen.getByTestId("heading")).toHaveTextContent("Add A Contestant");
    expect(screen.getByTestId("text-surname")).toBeInTheDocument();
    expect(screen.getByTestId("text-firstName")).toBeInTheDocument();
    expect(screen.getByTestId("select-post")).toBeInTheDocument();
    expect(screen.getByTestId("textarea-manifesto")).toBeInTheDocument();
    expect(screen.getByTestId("file-picture")).toBeInTheDocument();
  });

  it("disables the submit initially and enables it when all fields are filled", () => {
    render(
      <AdminFormDetails
        setIsDisabled={setIsDisabled}
        setFormData={setFormData}
        dataSubmitted={false}
      />,
    );

    const surnameInput = screen.getByLabelText("Surname");
    const firstNameInput = screen.getByLabelText("First Name");
    const postSelect = screen.getByLabelText("Post");
    const manifestoInput = screen.getByLabelText("Manifesto");
    const pictureInput = screen.getByLabelText("Upload Picture");

    // Fill all inputs
    fireEvent.change(surnameInput, { target: { value: "Doe" } });
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(postSelect, { target: { value: "vice president" } });
    fireEvent.change(manifestoInput, { target: { value: "My vision..." } });

    const mockFile = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
    fireEvent.change(pictureInput, { target: { files: [mockFile] } });

    expect(setIsDisabled).toHaveBeenCalledWith(false);
    expect(setFormData).toHaveBeenCalledTimes(1);
    const formArg = setFormData.mock.calls[0][0];
    expect(formArg.get("surname")).toBe("Doe");
    expect(formArg.get("firstName")).toBe("John");
    expect(formArg.get("post")).toBe("vice president");
    expect(formArg.get("manifesto")).toBe("My vision...");
    expect(formArg.get("picture")).toBe(mockFile);
  });

  it("resets the form when dataSubmitted changes from false to true", async () => {
    const { rerender } = render(
      <AdminFormDetails
        setIsDisabled={setIsDisabled}
        setFormData={setFormData}
        dataSubmitted={false}
      />,
    );

    const surnameInput = screen.getByLabelText("Surname");
    const firstNameInput = screen.getByLabelText("First Name");
    const postSelect = screen.getByLabelText("Post");
    const manifestoInput = screen.getByLabelText("Manifesto");
    const pictureInput = screen.getByLabelText("Upload Picture");

    // Fill in the form
    fireEvent.change(surnameInput, { target: { value: "Doe" } });
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(postSelect, { target: { value: "vice president" } });
    fireEvent.change(manifestoInput, { target: { value: "My vision..." } });

    const mockFile = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
    fireEvent.change(pictureInput, { target: { files: [mockFile] } });

    // Now simulate form submission by setting dataSubmitted to true
    rerender(
      <AdminFormDetails
        setIsDisabled={setIsDisabled}
        setFormData={setFormData}
        dataSubmitted={true}
      />,
    );

    // Wait for reset to reflect in the DOM
    await waitFor(() => {
      expect(screen.getByLabelText("Surname").value).toBe("");
    });

    await waitFor(() => {
      expect(screen.getByLabelText("First Name").value).toBe("");
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Manifesto").value).toBe("");
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Post").value.toLowerCase()).toBe("president");
    });
  });
});
