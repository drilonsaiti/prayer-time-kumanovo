import styled, {css} from "styled-components";

const Icon = styled.svg`
    width: 2.5rem;
    height: 2.5rem;
    font-size: 2.5rem;
    transition: all 0.3s;
    color: var(--color-grey-0);

    
    ${(props) =>
    props.smallIcon &&
    css`
                width: 1.5rem;
                height: 1.5rem;
                font-size: 1.5rem;
            `}
    ${(props) =>
    props.bigIcon &&
    css`
                width: 13.5rem;
                height: 13.5rem;
                font-size: 13.5rem;
            `}

    ${(props) =>
    props.weatherIcon &&
    css`
                width: 5.5rem;
                height: 5.5rem;
                font-size: 5.5rem;
            `}

`

export default Icon;