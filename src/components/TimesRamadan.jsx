import {ICONS, PRAYERS} from "../utils/helpers.js";
import styled, {keyframes} from "styled-components";
import {createElement} from "react";
import Icon from "../style/Icon.jsx";
import TimeParagraph from "../style/Time.jsx";

const fadeIn = keyframes`
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
`;

const LayoutTime = styled.div`
    display: grid;
    grid-template-columns: repeat(5, max-content);
    gap: 1rem;
    background: linear-gradient(135deg, 
        rgba(255, 215, 0, 0.08) 0%,
        rgba(255, 215, 0, 0.12) 50%,
        rgba(255, 215, 0, 0.08) 100%
    );
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 12px;
    padding: 1rem;
    align-items: center;
    justify-content: center;
    box-shadow: 
        0 4px 20px rgba(0, 0, 0, 0.3),
        0 0 40px rgba(255, 215, 0, 0.1);
    backdrop-filter: blur(10px);
    animation: ${fadeIn} 0.6s ease-out;

    @media only screen and (max-width: 390px) {
        grid-template-columns: repeat(5, 17%);
        align-items: center;
        justify-content: center;
    }

    @media only screen and (max-width: 750px) {
        width: 100%;
        gap: 1.1rem;
        align-items: center;
        justify-content: center;
    }

    @media only screen and (max-width: 360px) {
        gap: 1rem;
        width: 98%;
    }
`

const LayoutPrayerTime = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 7rem;
    height: 12.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:nth-of-type(odd) {
        background: linear-gradient(135deg, 
            rgba(255, 215, 0, 0.06) 0%,
            rgba(255, 215, 0, 0.1) 100%
        );
        border: 1px solid rgba(255, 215, 0, 0.15);
        padding: 1rem;
    }
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(255, 215, 0, 0.2);
        background: linear-gradient(135deg, 
            rgba(255, 215, 0, 0.12) 0%,
            rgba(255, 215, 0, 0.16) 100%
        );
    }
`

const Times = ({today}) => {
    const timingsToShow = ['Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    return (
        <>
            {today?.map((item, index) => (
                <LayoutTime key={index}>
                    {timingsToShow.map((key, idx) => (
                        <LayoutPrayerTime
                            key={key}
                            style={{
                                animationDelay: `${idx * 0.1}s`,
                                animation: `${fadeIn} 0.5s ease-out ${idx * 0.1}s both`
                            }}
                        >
                            {PRAYERS[key]}
                            <Icon>{createElement(ICONS[key])}</Icon>
                            <TimeParagraph>{item.timings[key]}</TimeParagraph>
                        </LayoutPrayerTime>
                    ))}
                </LayoutTime>
            ))}
        </>
    );
};

export default Times;