import React, { useEffect } from "react";
import criteria from "../../config/strongPasswordConf";
import Block from "components/ui/Block";
import Heading from "components/ui/Heading";
import Span from "components/ui/Span";
import List from "components/ui/List";
import Li from "components/ui/Li";
import I from "components/ui/I";

export default function RegistrationFormPasswordValidator({
  password,
  setPasswordValid,
}) {
  const results = criteria.map((c) => c.test(password));

  useEffect(() => {
    const allValid = results.every(Boolean);
    setPasswordValid(allValid);
  }, [password, setPasswordValid, results]);

  return (
    <Block className="mt-1r p-1r bg-white-soft border-1-silver-soft border-rounded-10">
      <Heading type="h4" className="mb-1r fw-600 text-base text-black-firm">
        Password must meet the following criteria:
      </Heading>
      <List className="no-list-style m-0 pl-0">
        {criteria.map((criterion, index) => (
          <Li
            key={index}
            className={`${results[index] ? "text-green" : "text-red"} flex flex-align-items-center mb-0p5r text-base transition-color`}
          >
            {criterion.label}
            <Span type="inline-block" className="ml-10 text-lg ta-center w-25">
              <I
                className={`fas ${
                  results[index] ? "fa-check-circle" : "fa-times-circle"
                } icon`}
              ></I>
            </Span>
          </Li>
        ))}
      </List>
    </Block>
  );
}
