import styled from "styled-components";

interface IInfoBox {
  isNode: boolean;
}

export const InfoBox = styled.div<IInfoBox>`
  ${(props) => `
    ${
      props.isNode &&
      `
    &::before, &::after, .label-box-content::before, .label-box-content::after {
      border-color: yellowgreen;
    };
    `
    }
  `}
`;
