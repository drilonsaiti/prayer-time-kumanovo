import {createElement, useEffect, useRef, useState} from 'react';
import {usePrayersTime} from "./usePrayersTime.js";
import {
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
import Skeleton from "../style/Skeleton.jsx";

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
`;

const float = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
`;

const swing = keyframes`
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
`;

const glow = keyframes`
    0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4)); }
    50% { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.7)); }
`;

const twinkle = keyframes`
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
`;

// Time-based backgrounds
const ramadanBackgrounds = {
    'Fajr': 'linear-gradient(135deg, #2d1b4e 0%, #4a3a6b 100%)',
    'Sunrise': 'linear-gradient(135deg, #5a4a7a 0%, #8b7ba8 100%)',
    'Dhuhr': 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
    'Asr': 'linear-gradient(135deg, #e8a05d 0%, #f4b860 100%)',
    'Sunset': 'linear-gradient(135deg, #d35d6e 0%, #e88388 100%)',
    'Maghrib': 'linear-gradient(135deg, #8b5a8e 0%, #a67ba8 100%)',
    'Isha': 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%)',
};

const Layout = styled.div`
    height: 100dvh;
    display: grid;
    grid-template-rows: 10rem repeat(3, 1fr) 4rem;
    align-items: center;
    justify-content: center;
    justify-items: center;
    position: relative;
    overflow: hidden;
    
    ${(props) => props.timeColor && css`
        background: ${props.timeColor};
    `}
    transition: background 1s ease;
    
    /* Subtle pattern */
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255, 215, 0, 0.02) 35px,
            rgba(255, 215, 0, 0.02) 70px
        );
        z-index: 0;
        pointer-events: none;
    }
    
    > * {
        position: relative;
        z-index: 1;
    }
`;

// CSS Crescent Moon
const Crescent = styled.div`
    position: absolute;
    top: 8%;
    left: 8%;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    box-shadow: 15px 5px 0 0 #ffd700;
    animation: ${float} 6s ease-in-out infinite;
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
    z-index: 0;

    &::after {
        content: '';
        position: absolute;
        top: -5px;
        right: -5px;
        width: 15px;
        height: 15px;
        background: #ffd700;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
    }
`;

// CSS Lantern
const Lantern = styled.div`
    position: absolute;
    width: 40px;
    height: 55px;
    background: linear-gradient(to bottom, #d4af37, #b8860b);
    border-radius: 0 0 10px 10px;
    animation: ${swing} 3s ease-in-out infinite;
    transform-origin: top center;
    
    &::before {
        content: '';
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 15px;
        background: #8b7355;
    }
    
    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 25px;
        height: 30px;
        background: #ffe4b5;
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        animation: ${glow} 2s ease-in-out infinite;
    }
    
    ${(props) => props.position && css`
        top: ${props.position.top};
        right: ${props.position.right};
        left: ${props.position.left};
        animation-delay: ${props.delay || '0s'};
    `}
`;

// CSS Islamic Arch
const IslamicArch = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 150px;
    border: 3px solid rgba(255, 215, 0, 0.3);
    border-bottom: none;
    border-radius: 100px 100px 0 0;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 30px solid transparent;
        border-right: 30px solid transparent;
        border-bottom: 40px solid rgba(255, 215, 0, 0.2);
    }
`;

// CSS Stars
const Star = styled.div`
    position: absolute;
    width: 0;
    height: 0;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-bottom: 5px solid #ffd700;
    animation: ${twinkle} ${props => props.duration || '3s'} infinite;
    animation-delay: ${props => props.delay || '0s'};
    
    ${(props) => props.position && css`
        top: ${props.position.top};
        left: ${props.position.left};
        right: ${props.position.right};
        bottom: ${props.position.bottom};
    `}
    
    &::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-top: 5px solid #ffd700;
        top: -8px;
        left: -3px;
    }
`;

const RamadanBanner = styled.div`
    position: absolute;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Georgia', serif;
    font-size: 1.4rem;
    color: #ffd700;
    text-align: center;
    padding: 0.8rem 2.5rem;
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 50px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    animation: ${fadeIn} 1s ease-out;
    z-index: 2;

    span {
        margin: 0 0.5rem;
    }
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
                background-size: 200% 100%;
                animation: ${shimmer} 3s linear infinite;
                filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4));
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

const Home = () => {
    const [city, setCity] = useState("Kumanovë");
    const [isCity, setIsCity] = useState(false);
    const {address} = useLocation();
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

    if (isLoading || !data || !data[0]) return <Skeleton />;

    if (error) {
        return (
            <Layout timeColor={ramadanBackgrounds['Isha']}>
                <Paragraph>Error loading prayer times. Please refresh.</Paragraph>
            </Layout>
        );
    }

    const today = data;
    const prayerTime = nextPrayer(today[0].timings);
    const timecountdown = timeCountDown || calculateTimeDifference(today[0].timings);
    const currentPrayerColor = nextPrayerIconColor(today[0].timings, today[0].date);

    localStorage.setItem('prev', prayerTime);

    const handleCity = () => setIsCity(!isCity);
    const handleSelectCity = (selectedCity) => {
        setCity(selectedCity);
        setIsCity(false);
        localStorage.setItem("city", selectedCity);
    };
    const handleIsOpenDropdown = () => setIsCity(!isCity);

    return (
        <Layout timeColor={ramadanBackgrounds[currentPrayerColor]}>
            {/* CSS Decorations */}
            <RamadanBanner>
                <span>🌙</span>
                Ramazan Mubarek
                <span>✨</span>
            </RamadanBanner>

            <Crescent />

            <Lantern position={{top: '12%', right: '15%'}} delay="0s" />
            <Lantern position={{top: '15%', right: '8%'}} delay="0.5s" />
            <Lantern position={{top: '20%', right: '12%'}} delay="1s" />

            <IslamicArch />

            <Star position={{top: '18%', left: '12%'}} duration="3s" delay="0s" />
            <Star position={{top: '25%', left: '20%'}} duration="4s" delay="1s" />
            <Star position={{top: '35%', right: '25%'}} duration="3.5s" delay="0.5s" />
            <Star position={{top: '70%', left: '10%'}} duration="4.5s" delay="1.5s" />
            <Star position={{bottom: '20%', right: '18%'}} duration="3.8s" delay="0.8s" />

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
                                backgroundColor={ramadanBackgrounds[currentPrayerColor]}
                            />}
                        </FlexGroup>
                    </FlexGroup>
                </FlexGroup>
            </Location>

            <Icon bigIcon style={{animation: `${fadeIn} 0.8s ease-out 0.4s both`}}>
                {createElement(ICONS[currentPrayerColor])}
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
                <Times today={today}/>
            </FlexGroup>

            <Paragraph style={{fontSize: '1.5rem', animation: `${fadeIn} 0.8s ease-out 1s both`}}>
                Created by Drilon Saiti
            </Paragraph>
        </Layout>
    );
};

export default Home;