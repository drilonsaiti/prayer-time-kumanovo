import {createElement, useState} from 'react';
import {usePrayersTime} from "./usePrayersTime.js";
import {
    backgroundGradient,
    calculateTimeDifference,
    formatDate,
    gregorianDate,
    hijriDate,
    ICONS,
    nextPrayer,
    nextPrayerTime,
    PRAYERS
} from "../utils/helpers.js";
import Times from "./Times.jsx";
import styled, {css} from "styled-components";

import {HiOutlineLocationMarker} from "react-icons/hi";
import Icon from "../style/Icon.jsx";
import Separator from "../style/Seperator.jsx";
import FlexGroup from "../style/FlexGroup.jsx";

const Layout = styled.div`
    height: 100dvh;
    display: grid;
    grid-template-rows:10rem repeat(3, 1fr) 4rem;
    align-items: center;
    justify-content: center;
    justify-items: center;

    ${(props) =>
            props.backgroundColor &&
            css`
                background-image: ${props.backgroundColor};
            `}
`;

const Location = styled.div`

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
`

const Paragraph = styled.p`

    font-size: 2.5rem;


    ${(props) =>
            props.countDown &&
            css`
                font-size: 8rem;
            `}
`

const Home = () => {
    const {data, isLoading} = usePrayersTime();
    const [timeCountDown, setTimeCountDown] = useState(0);


    if (isLoading) return <div>Loading...</div>;

    const today = data.filter(item => {
        const date = new Date();
        const formattedDate = formatDate(date);
        return item.date.gregorian.date === formattedDate;
    })


    const prayerTime = nextPrayer(today[0].timings)
    let timecounddow = calculateTimeDifference(today[0].timings);


    setInterval(() => {
        if (timeCountDown === 0) {
            setTimeCountDown(timecounddow)
        }
        setTimeCountDown(calculateTimeDifference(today[0].timings))
    }, 30000);


    return (
        <Layout backgroundColor={backgroundGradient[prayerTime]}>
            <Location>
                <Icon>
                    <HiOutlineLocationMarker/>
                </Icon>
                <Paragraph>Kumanovë</Paragraph>
            </Location>
            <Icon bigIcon>
                {createElement(ICONS[prayerTime])}
            </Icon>
            <FlexGroup>
                <Paragraph
                    style={{alignSelf: 'center'}}>{PRAYERS[prayerTime]} {nextPrayerTime(today[0].timings)}</Paragraph>
                <Paragraph style={{alignSelf: 'center'}}
                           countDown>{timeCountDown === 0 ? timecounddow : timeCountDown}</Paragraph>
            </FlexGroup>
            <FlexGroup minHeight>
                <FlexGroup type="row" style={{alignSelf: 'center'}}>
                    <p>{gregorianDate(today[0].date.gregorian)} </p>
                    <Separator/>
                    <p>{hijriDate(today[0].date.hijri)} </p>
                </FlexGroup>
                <Times today={today}/>
            </FlexGroup>

            <Paragraph style={{fontSize: '1.5rem'}}>
                Created by Drilon Saiti
            </Paragraph>

        </Layout>
    );
};

export default Home;