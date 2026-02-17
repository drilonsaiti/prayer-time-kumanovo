import {createElement, useEffect, useRef, useState} from 'react';
import {usePrayersTime} from "./usePrayersTime.js";
import {
    backgroundGradient,
    calculateTimeDifference,
    gregorianDate,
    hijriDate,
    ICONS,
    nextPrayer,
    nextPrayerIconColor,
    nextPrayerTime,
    PRAYERS
} from "../utils/helpers.js";
import Times from "./Times.jsx";
import styled, {css} from "styled-components";

import {HiOutlineLocationMarker} from "react-icons/hi";
import Icon from "../style/Icon.jsx";
import Separator from "../style/Seperator.jsx";
import FlexGroup from "../style/FlexGroup.jsx";
import {HiChevronDown, HiChevronUp} from "react-icons/hi2";
import Dropdown from "../style/Dropdown.jsx";
import {useLocation} from "./useLocation.js";
import Skeleton from "./Skeleton.jsx"

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

    ${(props) =>
            props.weather &&
            css`
                font-size: 1.4rem;
            `}
`

const cities = {
    "Kumanovo": "Kumanovë",
    "Skopje": "Shkup",
    "Tetovo": "Tetovë",
    "Struga": "Strugë",
    "Gostivar": "Gostivar",
    "Prilep": "Prilep",
    "Kičevo": "Kërçovë",
    "Debar": "Dibër",
    "Veles": "Veles",
    "Strumica": "Strumicë"
}

const Home = () => {
    const [city, setCity] = useState("Kumanovë");
    const [isCity, setIsCity] = useState(false);
    const {address, isLoading: isLoadingLocation} = useLocation();
    const dropdownRef = useRef(null);
    const [timeCountDown, setTimeCountDown] = useState("");

    useEffect(() => {
        const storageCity = localStorage.getItem("city");
        if (address?.country === "North Macedonia") {
            if (!storageCity) {
                setCity(cities[address?.city])
                localStorage.setItem("city", cities[address?.city])
            } else if (storageCity !== address?.city) {
                setCity(cities[address?.city])
            } else {
                setCity(cities[storageCity]);
            }
        } else {
            setCity("Kumanovë")
        }
    }, [address?.city, address?.country]);

    const {data, isLoading, error} = usePrayersTime(city);

    useEffect(() => {
        if (!data || !data[0]) return;

        const updateCountdown = () => {
            const newCountdown = calculateTimeDifference(data[0].timings);
            setTimeCountDown(newCountdown);

            const now = new Date();
            const prayerTime = nextPrayer(data[0].timings);
            const prevPrayer = localStorage.getItem('prev');

            if (newCountdown.includes("s") ||
                (now.getHours() === 0 && now.getMinutes() <= 1) ||
                prevPrayer !== prayerTime) {
                window.location.reload();
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 30000);
        return () => clearInterval(interval);
    }, [data]);

    // Show skeleton while loading or waiting for data
    if (isLoading || !data || !data[0]) return <Skeleton/>;

    if (error) {
        return (
            <Layout style={{backgroundColor: 'black'}}>
                <Paragraph>Error loading prayer times. Please refresh.</Paragraph>
            </Layout>
        );
    }

    const today = data;
    const prayerTime = nextPrayer(today[0].timings);
    const timecountdown = timeCountDown || calculateTimeDifference(today[0].timings);

    localStorage.setItem('prev', prayerTime);

    const handleCity = () => setIsCity(!isCity);

    const handleSelectCity = (selectedCity) => {
        setCity(selectedCity);
        setIsCity(false);
        localStorage.setItem("city", selectedCity);
    };

    const handleIsOpenDropdown = () => setIsCity(!isCity);

    const backgroundColor = backgroundGradient[nextPrayerIconColor(today[0].timings, today[0].date)];

    return (
        <Layout style={{backgroundColor: 'black'}} backgroundColor={backgroundColor}>
            <Location>
                <FlexGroup type="row">
                    <FlexGroup type="row">
                        <Icon>
                            <HiOutlineLocationMarker/>
                        </Icon>
                        <FlexGroup>
                            <FlexGroup type="row" onClick={handleCity} style={{cursor: 'pointer'}}>
                                <Paragraph>{city}</Paragraph>
                                {isCity ? <HiChevronUp/> : <HiChevronDown/>}
                            </FlexGroup>
                            {isCity && <Dropdown
                                onSelectCity={handleSelectCity}
                                onOpenDropdown={handleIsOpenDropdown}
                                backgroundColor={backgroundColor}
                            />}
                        </FlexGroup>
                    </FlexGroup>
                </FlexGroup>
            </Location>

            <Icon bigIcon>
                {createElement(ICONS[nextPrayerIconColor(today[0].timings, today[0].date)])}
            </Icon>

            <FlexGroup>
                <Paragraph style={{alignSelf: 'center'}}>
                    {PRAYERS[prayerTime]} {nextPrayerTime(today[0].timings)}
                </Paragraph>
                <Paragraph style={{alignSelf: 'center'}} countDown>
                    {timecountdown}
                </Paragraph>
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