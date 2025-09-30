/**
 * Build the html content of the email message typically sent to a user
 *
 * @param {Object} param
 * @param {string} [param.heading] The heading of the message
 * @param {Array} [param.content] Contains the details of the main message. Each object in this array
 * should be of form { message: string, linkDetails: { url: string, btnValue: string, isMainBtn: boolean } }
 * @param {string} [param.footNote] Optional footnote message
 *
 * @returns {string}
 */
const emailTemplateBuilder = ({ heading, content, footNote }) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333; text-align: center;">${heading}</h2>

    ${_buildContent(content).join("\n")}

    ${footNote && _buildFootNote(footNote)} 

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

    ${
      linkDetails &&
      `<div style="text-align: center; margin: 30px 0;">
         <a href="${linkDetails.url}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: white; background-color: ${btnColor} text-decoration: none; border-radius: 6px;">
           ${linkDetails.btnValue}
         </a>
       </div>`
    }
    `;
  });
};

const _buildFootNote = (footnote) => {
  return `
    <p style="font-size: 14px; color: #888; text-align: center;">
      ${footnote}
    </p>`;
};

module.exports = emailTemplateBuilder;
