"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Build the HTML content of the email message typically sent to a user
 */
const emailTemplateBuilder = ({ heading, content, footNote, }) => {
    const divStyle = [
        "font-family: Arial, sans-serif",
        "max-width: 600px",
        "margin: auto",
        "padding: 20px",
        "border: 1px solid #eaeaea",
        "border-radius: 10px",
        "background-color: #f9f9f9",
    ].join("; ");
    return `
  <div style="${divStyle}">
    <h2 style="color: #333; text-align: center;">${heading}</h2>

    ${_buildContent(content).join("\n")}

    ${footNote ? _buildFootNote(footNote) : ""} 

    <hr style="border: none; border-top: 1px solid #ddd;" />

    <p style="font-size: 12px; color: #aaa; text-align: center;">
      &copy; ${new Date().getFullYear()} Corestack Technologies. All rights reserved.
    </p>
  </div>
`;
};
const _buildContent = (contentArr) => {
    return contentArr.map(({ message, linkDetails }) => {
        let pStyle = "font-size: 16px; color: #555; text-align: center;";
        let btnColor = "#3b82f6;";
        if (linkDetails && !linkDetails.isMainBtn) {
            pStyle = "font-size: 14px; color: #666; text-align: center;";
            btnColor = "#d62222ff;";
        }
        return `
    <p style="${pStyle}">
        ${message}
    </p>

    ${linkDetails
            ? `<div style="text-align: center; margin: 30px 0;">
         <a 
           href="${linkDetails.url}" 
           style="display: inline-block; 
                  padding: 12px 20px; 
                  font-size: 16px; 
                  color: white; 
                  background-color: ${btnColor}
                  text-decoration: none; 
                  border-radius: 6px;"
         >
           ${linkDetails.btnValue}
         </a>
       </div>`
            : ""}
    `;
    });
};
const _buildFootNote = (footnote) => {
    return `
    <p style="font-size: 14px; color: #888; text-align: center;">
      ${footnote}
    </p>`;
};
exports.default = emailTemplateBuilder;
