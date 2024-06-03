import {createElement, useEffect, useRef, useState} from 'react';
import {usePrayersTime} from "./usePrayersTime.js";
import {
    backgroundGradient,
    calculateTimeDifference,
    convertStringToDate,
    formatDate,
    gregorianDate,
    hijriDate,
    ICONS,
    nextPrayer,
    nextPrayerIconColor,
    nextPrayerTime,
    PRAYERS,
    WEATHER,
    WEATHER_ICONS
} from "../utils/helpers.js";
import Times from "./Times.jsx";
import styled, {css} from "styled-components";

import {HiOutlineLocationMarker, HiRefresh} from "react-icons/hi";
import Icon from "../style/Icon.jsx";
import Separator from "../style/Seperator.jsx";
import FlexGroup from "../style/FlexGroup.jsx";
import Spinner from "../style/Spinner.jsx";
import {useWeather} from "./useWeather.js";
import {HiChevronDown, HiChevronUp} from "react-icons/hi2";
import Dropdown from "../style/Dropdown.jsx";
import {useLocation} from "./useLocation.js";

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
    "Tetovo": "Tetovë"
}

const Home = () => {
    const [city, setCity] = useState("Kumanovë");
    const [isCity, setIsCity] = useState(false);
    //const {getCity,getCountry} = getUserLocation();
    const {address, isLoading: isLoadingLocation} = useLocation();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const storageCity = localStorage.getItem("city");
        if (address?.country === "North Macedonia") {
            if (!storageCity ) {
                setCity(cities[address?.city])
                localStorage.setItem("city", cities[address?.city])
            } else if (storageCity !== address?.city){
                setCity(cities[address?.city])
            }else{
                setCity(cities[storageCity]);
            }
        } else {
            setCity("Kumanovë")
        }
    }, [address?.city, address?.country]);


    const {data, isLoading} = usePrayersTime(city);
    //const {data: weather, isLoading: isLoadingWeather} = useWeather(city);
    const [timeCountDown, setTimeCountDown] = useState(0);


    if (isLoading || isLoadingLocation) return <Spinner/>;

    const today = data?.filter(item => {
        const date = new Date();
        const formattedDate = formatDate(date);
        const isha = convertStringToDate(item.date.gregorian.date, item.timings['Isha']);

        return item.date.gregorian.date >= formattedDate && (new Date(isha) > new Date(date));
    }).slice(0, 1);

    const prayerTime = nextPrayer(today[0].timings)
    let timecounddow = calculateTimeDifference(today[0].timings);

    localStorage.setItem('prev', prayerTime);


    setInterval(() => {
        if (timeCountDown === 0) {
            setTimeCountDown(timecounddow)
        }

        setTimeCountDown(calculateTimeDifference(today[0].timings));

        const now = new Date();
        if (timeCountDown.includes("s") || (now.getHours() === 0 && now.getMinutes() === 1) || localStorage.getItem('prev') !== prayerTime) {
            window.location.reload();
        }

    }, 30000);

    const handleCity = () => {
        setIsCity(!isCity)
    }
    const handleSelectCity = (selectedCity) => {
        setCity(selectedCity);
        setIsCity(false);
    };

    const handleIsOpenDropdown = () => {
        setIsCity(!isCity)
    }

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
                            {isCity && <Dropdown onSelectCity={handleSelectCity} onOpenDropdown={handleIsOpenDropdown}
                                                 backgroundColor={backgroundColor}/>}
                        </FlexGroup>

                    </FlexGroup>
                   {/* {weather && <>
                        <Separator/>
                        <FlexGroup type="row">
                            <Icon weatherIcon>
                                {createElement(WEATHER_ICONS[weather?.data.values.weatherCode])}
                            </Icon>
                            <FlexGroup weather>
                                <Paragraph>
                                    {`${Math.round(weather?.data.values.temperature)}°`}
                                </Paragraph>
                                <Paragraph weather>
                                    {WEATHER[weather?.data.values.weatherCode]}
                                </Paragraph>
                                <Icon smallIcon onClick={() => window.location.reload()}>
                                    <HiRefresh/>
                                </Icon>
                            </FlexGroup>
                        </FlexGroup>
                    </>}*/}
                </FlexGroup>
            </Location>

            <Icon bigIcon>
                {createElement(ICONS[nextPrayerIconColor(today[0].timings, today[0].date)])}
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