import styled, {css} from "styled-components";

const FlexGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    text-align: left;
    gap: 1rem;


    ${(props) =>
    props.type === "row" &&
    css`
                flex-direction: row;
                align-items: center;
        justify-content: center;
            `}

    ${(props) =>
    props.header &&
    css`
                @media only screen and (max-width: 450px) {
                    gap: 0;
                }
            `}

    ${(props) =>
    props.contact &&
    css`
                @media only screen and (max-width: 450px) {
                    flex-direction: column;
                }
            `}

    ${(props) =>
    props.buttons &&
    css`
                @media only screen and (max-width: 1050px) {
                    width: 100%;
                }

                @media only screen and (min-width: 900px) {
                    width: 50%;
                    align-self: center;
                }
            `}

    ${(props) =>
    props.changeDirection &&
    css`


                @media only screen and (max-width: 450px) {
                    flex-direction: column !important;
                    margin-bottom: 2rem !important;
                }
            `}

    ${(props) =>
    props.operations &&
    css`
                @media only screen and (max-width: 900px) {
                    flex-direction: column;
                    align-self: center;
                }
            `}


`;

export default FlexGroup;