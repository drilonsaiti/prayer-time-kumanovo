import React, {useEffect, useRef} from 'react';
import styled, {css} from "styled-components";

const StyledDropdown = styled.div`
    position: absolute;
    top: 7%;
    //left: 34.7%;
    background-color: var(--color-grey-0);
    color: black;
    border-radius: 4px;
    box-shadow: 0 10px 12px rgba(0, 0, 0, 0.3);;

    ${(props) =>
            props.backgroundColor &&
            css`
                background-image: ${props.backgroundColor} !important;
            `}
`

const StyledDropdownMenu = styled.div`
    display: flex;
    flex-direction: column;
    cursor: pointer;
`

const StyledDropdownItem = styled.div`
    font-size: 2.5rem;
    color: #fff;
    padding: 1rem;
    padding-right: 2rem;

    &:hover {
        background-color: #fff;
        color: #000 !important;
    }
`

const StyledHorizontalLine = styled.hr`
    border: none;
    border-top: 1px solid var(--color-grey-400); /* Change color as needed */
    margin: 0; /* Remove default margin */
`;

const Dropdown = ({onSelectCity, isCity, setIsCity, onOpenDropdown, backgroundColor}) => {
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onOpenDropdown();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsCity]);

    const handleCityClick = (city) => {
        onSelectCity(city);
        setIsCity(false);
    };
    const cities = [
        {name: "Kumanovë"},
        {name: "Tetovë"},

    ];
    return (
        <StyledDropdown ref={dropdownRef} backgroundColor={backgroundColor}>
            <StyledDropdownMenu>
                {cities.map((city, index) => (
                    <React.Fragment key={index}>
                        <StyledDropdownItem onClick={() => handleCityClick(city.name)}>
                            {city.name}
                        </StyledDropdownItem>
                        {index < cities.length - 1 &&
                            <StyledHorizontalLine/>} {/* Render <hr/> if it's not the last item */}
                    </React.Fragment>
                ))}
            </StyledDropdownMenu>
        </StyledDropdown>
    );
};

export default Dropdown;