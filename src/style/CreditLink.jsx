import styled from "styled-components";

 const CreditLink = styled.a`
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.45);
    text-decoration: none;
    letter-spacing: 0.05em;

    span {
        color: rgba(255, 255, 255, 0.9);
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        padding-bottom: 1px;
        transition: color 0.2s ease, border-color 0.2s ease;
    }

    &:hover span {
        color: #fff;
        border-bottom-color: rgba(255, 255, 255, 0.9);
    }
`;

 export default CreditLink;