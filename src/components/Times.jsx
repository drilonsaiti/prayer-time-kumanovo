import {fajrTime, ICONS, nextPrayer, PRAYERS} from "../utils/helpers.js";
import styled from "styled-components";
import {createElement} from "react";
import Icon from "../style/Icon.jsx";
import TimeParagraph from "../style/Time.jsx";

const LayoutTime = styled.div`

    display: grid;
    grid-template-columns: repeat(5, max-content);
    gap: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    align-items: center;
    justify-content: center;

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


`

const LayoutPrayerTime = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 7rem;
    height: 12.5rem;

    &:nth-of-type(odd) {
        background-color: rgba(255, 255, 255, 0.08);
        padding: 1rem;
    }
`


const Times = ({today}) => {
    const timingsToShow = ['Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    const currentTimeStamp = new Date().getTime();
    const nextPrayerFont = nextPrayer(today[0]?.timings);

    return (
        <>
            {today?.map((item, index) => (
                <LayoutTime key={index}>
                    {timingsToShow.map(key => {
                        return (
                            <LayoutPrayerTime key={key}>
                                {PRAYERS[key]}
                                {<Icon>{createElement(ICONS[key])}</Icon>}
                                <TimeParagraph>{key === 'Sunrise' ? fajrTime(item.timings[key]) : item.timings[key].split(" ")[0]}</TimeParagraph>
                            </LayoutPrayerTime>
                        )
                    })}
                </LayoutTime>
            ))}
        </>
    )
};

export default Times;