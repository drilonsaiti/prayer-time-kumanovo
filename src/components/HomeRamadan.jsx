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
import styled, {css, keyframes} from "styled-components";

import {HiOutlineLocationMarker} from "react-icons/hi";
import Icon from "../style/Icon.jsx";
import Separator from "../style/Seperator.jsx";
import FlexGroup from "../style/FlexGroup.jsx";
import {HiChevronDown, HiChevronUp} from "react-icons/hi2";
import Dropdown from "../style/Dropdown.jsx";
import {useLocation} from "./useLocation.js";
import TimesRamadan from "./TimesRamadan.jsx";
import SkeletonRamadan from "./SkeletonRamadan.jsx";

// Ramadan animations
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const twinkle = keyframes`
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
`;

const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
`;

const shimmer = keyframes`
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
`;

const Layout = styled.div`
    height: 100dvh;
    display: grid;
    grid-template-rows: 10rem repeat(3, 1fr) 4rem;
    align-items: center;
    justify-content: center;
    justify-items: center;
    position: relative;
    overflow: hidden;

    /* Ramadan gradient background with deep purples and golds */
    background: linear-gradient(135deg, 
        #1a0b2e 0%,
        #2d1b4e 25%,
        #3d2463 50%,
        #2d1b4e 75%,
        #1a0b2e 100%
    );
    
    ${(props) =>
    props.backgroundColor &&
    css`
            &::before {
                content: '';
                position: absolute;
                inset: 0;
                background-image: ${props.backgroundColor};
                opacity: 0.4;
                z-index: 0;
            }
        `}
    
    /* Islamic geometric pattern overlay */
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: 
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255, 215, 0, 0.02) 35px, rgba(255, 215, 0, 0.02) 70px),
            repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255, 215, 0, 0.02) 35px, rgba(255, 215, 0, 0.02) 70px);
        z-index: 0;
        pointer-events: none;
    }
    
    /* All children above overlays */
    > * {
        position: relative;
        z-index: 1;
    }
`;

// Decorative stars scattered across the background
const Stars = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    
    &::before, &::after {
        content: '✦';
        position: absolute;
        color: #ffd700;
        font-size: 1.2rem;
        animation: ${twinkle} 3s infinite;
    }
    
    &::before {
        top: 15%;
        left: 10%;
        animation-delay: 0s;
    }
    
    &::after {
        top: 25%;
        right: 15%;
        animation-delay: 1.5s;
    }
`;

const Star = styled.span`
    position: absolute;
    color: #ffd700;
    font-size: ${props => props.size || '1rem'};
    animation: ${twinkle} ${props => props.duration || '3s'} infinite;
    animation-delay: ${props => props.delay || '0s'};
    top: ${props => props.top};
    left: ${props => props.left};
    right: ${props => props.right};
    bottom: ${props => props.bottom};
`;

// Crescent moon decoration
const Crescent = styled.div`
    position: absolute;
    top: 8%;
    right: 10%;
    font-size: 4rem;
    color: #ffd700;
    animation: ${float} 6s ease-in-out infinite;
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
    z-index: 0;
    pointer-events: none;
    
    &::before {
        content: '☪';
    }
`;

// Ramadan greeting banner
const RamadanBanner = styled.div`
    position: absolute;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Georgia', serif;
    font-size: 1.4rem;
    color: #ffd700;
    text-align: center;
    padding: 0.8rem 2rem;
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 50px;
    background: linear-gradient(90deg, 
        rgba(45, 27, 78, 0.8) 0%,
        rgba(61, 36, 99, 0.9) 50%,
        rgba(45, 27, 78, 0.8) 100%
    );
    backdrop-filter: blur(10px);
    box-shadow: 
        0 4px 20px rgba(255, 215, 0, 0.2),
        inset 0 1px 0 rgba(255, 215, 0, 0.3);
    animation: ${fadeIn} 1s ease-out, ${shimmer} 3s infinite;
    background-size: 200% 100%;
    z-index: 2;
    
    &::before,
    &::after {
        content: '✦';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.8rem;
        color: #ffd700;
    }
    
    &::before { left: 0.5rem; }
    &::after { right: 0.5rem; }
`;

const Location = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    animation: ${fadeIn} 0.8s ease-out 0.2s both;
`;

const Paragraph = styled.p`
    font-size: 2.5rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

    ${(props) =>
    props.countDown &&
    css`
            font-size: 8rem;
            background: linear-gradient(135deg, #ffd700, #ffed4e, #ffd700);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 4px 10px rgba(255, 215, 0, 0.3));
            animation: ${shimmer} 3s infinite;
            background-size: 200% 100%;
        `}

    ${(props) =>
    props.weather &&
    css`
            font-size: 1.4rem;
        `}
`;

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

const HomeRamadan = () => {
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

    if (isLoading || !data || !data[0]) return <SkeletonRamadan />;

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
        <Layout backgroundColor={backgroundColor}>
            {/* Ramadan decorations */}
            <RamadanBanner>Ramazan Mubarek 🌙</RamadanBanner>
            <Crescent />
            <Stars />

            {/* Scattered stars */}
            <Star size="1.5rem" top="12%" left="20%" duration="4s" delay="0.5s">✦</Star>
            <Star size="1rem" top="70%" left="8%" duration="5s" delay="1s">✦</Star>
            <Star size="1.2rem" top="85%" right="12%" duration="3.5s" delay="2s">✦</Star>
            <Star size="0.9rem" bottom="15%" right="25%" duration="4.5s" delay="0.3s">✦</Star>
            <Star size="1.3rem" top="40%" right="8%" duration="3s" delay="1.8s">✦</Star>
            <Star size="1.1rem" bottom="25%" left="15%" duration="4s" delay="0.8s">✦</Star>

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

            <Icon bigIcon style={{animation: `${fadeIn} 0.8s ease-out 0.4s both`}}>
                {createElement(ICONS[nextPrayerIconColor(today[0].timings, today[0].date)])}
            </Icon>

            <FlexGroup style={{animation: `${fadeIn} 0.8s ease-out 0.6s both`}}>
                <Paragraph style={{alignSelf: 'center'}}>
                    {PRAYERS[prayerTime]} {nextPrayerTime(today[0].timings)}
                </Paragraph>
                <Paragraph style={{alignSelf: 'center'}} countDown>
                    {timecountdown}
                </Paragraph>
            </FlexGroup>

            <FlexGroup minHeight style={{animation: `${fadeIn} 0.8s ease-out 0.8s both`}}>
                <FlexGroup type="row" style={{alignSelf: 'center'}}>
                    <p>{gregorianDate(today[0].date.gregorian)} </p>
                    <Separator/>
                    <p>{hijriDate(today[0].date.hijri)} </p>
                </FlexGroup>
                <TimesRamadan today={today}/>
            </FlexGroup>

            <Paragraph style={{fontSize: '1.5rem', animation: `${fadeIn} 0.8s ease-out 1s both`}}>
                Created by Drilon Saiti
            </Paragraph>
        </Layout>
    );
};

export default HomeRamadan;