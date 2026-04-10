import { createElement, useEffect, useRef, useState } from 'react';
import { usePrayersTime } from "./usePrayersTime.js";
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
import styled, { css, keyframes } from "styled-components";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Icon from "../style/Icon.jsx";
import Separator from "../style/Seperator.jsx";
import FlexGroup from "../style/FlexGroup.jsx";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";
import Dropdown from "../style/Dropdown.jsx";
import { useLocation } from "./useLocation.js";
import Skeleton from "./Skeleton.jsx";

/* ── Keyframes ─────────────────────────────────────────────── */

const floatY = keyframes`
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-12px); }
`;

const swing = keyframes`
    0%, 100% { transform: rotate(-6deg); }
    50%       { transform: rotate(6deg); }
`;

const twinkle = keyframes`
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.3); }
`;

const goldShimmer = keyframes`
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
`;

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
`;

/* ── Ramadan background palette (replaces backgroundGradient) ─ */

const ramadanGradient = {
    Fajr: 'linear-gradient(to bottom, #87CEEB, #4682B4)',
    Sunrise: 'linear-gradient(to bottom, #87CEEB, #4682B4)',
    Dhuhr: 'linear-gradient(to bottom, #90EE90, #228B22)',
    Asr: 'linear-gradient(to bottom, #FFD700, #DAA520)',
    Sunset: 'linear-gradient(to bottom, #FFA500, #FF6347)',
    Maghrib: 'linear-gradient(to bottom, #FFA500, #FF6347)',
    Isha: 'linear-gradient(to bottom, #00008B, #191970)',
};

/* ── Layout ─────────────────────────────────────────────────── */

const Layout = styled.div`
    height: 100dvh;
    display: grid;
    grid-template-rows: 10rem repeat(3, 1fr) 4rem;
    align-items: center;
    justify-content: center;
    justify-items: center;
    position: relative;
    overflow: hidden;

    ${({ bg }) => bg && css`background: ${bg};`}
    transition: background 1.2s ease;

    /* subtle diagonal gold trellis */
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
            repeating-linear-gradient(
                45deg,
                transparent,
                transparent 48px,
                rgba(255, 215, 0, 0.03) 48px,
                rgba(255, 215, 0, 0.03) 49px
            );
        pointer-events: none;
        z-index: 0;
    }

    > * { position: relative; z-index: 1; }
`;

/* ── Crescent moon (pure CSS) ───────────────────────────────── */

const Moon = styled.div`
    position: absolute;
    top: 6%;
    left: 6%;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    /* The "bite" trick: shadow on same background colour as the cutout */
    box-shadow: 14px -4px 0 2px #ffd700;
    filter: drop-shadow(0 0 18px rgba(255, 215, 0, 0.55));
    animation: ${floatY} 7s ease-in-out infinite;
    z-index: 0;
`;

/* ── Star (6-pointed, pure CSS) ─────────────────────────────── */

const StarWrap = styled.div`
    position: absolute;
    top:    ${({ $top })    => $top    || 'auto'};
    left:   ${({ $left })   => $left   || 'auto'};
    right:  ${({ $right })  => $right  || 'auto'};
    bottom: ${({ $bottom }) => $bottom || 'auto'};
    z-index: 0;
    animation: ${twinkle} ${({ $dur }) => $dur || '3s'} ease-in-out infinite;
    animation-delay: ${({ $delay }) => $delay || '0s'};
`;

const StarUp = styled.div`
    width: 0;
    height: 0;
    border-left:   6px solid transparent;
    border-right:  6px solid transparent;
    border-bottom: 10px solid #ffd700;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top: 3px;
        left: -6px;
        width: 0;
        height: 0;
        border-left:   6px solid transparent;
        border-right:  6px solid transparent;
        border-top:    10px solid #ffd700;
    }
`;

const Star = ({ top, left, right, bottom, dur, delay }) => (
    <StarWrap $top={top} $left={left} $right={right} $bottom={bottom} $dur={dur} $delay={delay}>
        <StarUp />
    </StarWrap>
);

/* ── Lantern (pure CSS) ─────────────────────────────────────── */

const LanternWrap = styled.div`
    position: absolute;
    top:   ${({ $top })   => $top   || '10%'};
    right: ${({ $right }) => $right || '10%'};
    left:  ${({ $left })  => $left  || 'auto'};
    z-index: 0;
    animation: ${swing} ${({ $speed }) => $speed || '3.5s'} ease-in-out infinite;
    animation-delay: ${({ $delay }) => $delay || '0s'};
    transform-origin: top center;
`;

const LanternString = styled.div`
    width: 2px;
    height: 18px;
    background: rgba(255, 215, 0, 0.6);
    margin: 0 auto;
`;

const LanternBody = styled.div`
    width: 28px;
    height: 44px;
    background: linear-gradient(to bottom, #c8972a, #f4c94f, #c8972a);
    border-radius: 4px 4px 10px 10px;
    position: relative;
    box-shadow: 0 0 22px rgba(255, 200, 0, 0.7);

    /* top cap */
    &::before {
        content: '';
        position: absolute;
        top: -7px;
        left: -3px;
        width: 34px;
        height: 8px;
        background: #a07820;
        border-radius: 4px;
    }

    /* inner glow */
    &::after {
        content: '';
        position: absolute;
        inset: 6px;
        background: rgba(255, 240, 150, 0.45);
        border-radius: 4px 4px 8px 8px;
    }
`;

const LanternBottom = styled.div`
    width: 4px;
    height: 10px;
    background: #a07820;
    margin: 0 auto;
    border-radius: 0 0 4px 4px;
`;

const Lantern = ({ top, right, left, speed, delay }) => (
    <LanternWrap $top={top} $right={right} $left={left} $speed={speed} $delay={delay}>
        <LanternString />
        <LanternBody />
        <LanternBottom />
    </LanternWrap>
);

/* ── Islamic arch (bottom decoration) ──────────────────────── */

const Arch = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 220px;
    height: 130px;
    border: 2px solid rgba(255, 215, 0, 0.18);
    border-bottom: none;
    border-radius: 110px 110px 0 0;
    pointer-events: none;
    z-index: 0;
`;

/* ── Ramadan badge ──────────────────────────────────────────── */

const Badge = styled.div`
    position: absolute;
    top: 1.6rem;
    left: 45%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 1.3rem;
    letter-spacing: 0.08em;
    color: #ffd700;
    padding: 0.6rem 2rem;
    border: 1px solid rgba(255, 215, 0, 0.35);
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(8px);
    animation: ${fadeUp} 0.9s ease-out both;
    z-index: 2;
`;

/* ── Typography ─────────────────────────────────────────────── */

const Location = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    animation: ${fadeUp} 0.8s ease-out 0.1s both;
    padding-top: 4rem
`;

const Paragraph = styled.p`
    font-size: 2.5rem;

    ${({ countDown }) => countDown && css`
        font-size: 8rem;
        background: linear-gradient(90deg, #b8860b, #ffd700, #ffe97a, #ffd700, #b8860b);
        background-size: 300% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: ${goldShimmer} 4s linear infinite;
    `}
`;

/* ── City map (same as Home.jsx) ────────────────────────────── */

const cities = {
    "Kumanovo": "Kumanovë",
    "Skopje":   "Shkup",
    "Tetovo":   "Tetovë",
    "Struga":   "Strugë",
    "Gostivar": "Gostivar",
    "Prilep":   "Prilep",
    "Kičevo":   "Kërçovë",
    "Debar":    "Dibër",
    "Veles":    "Veles",
    "Strumica": "Strumicë",
};

/* ── Component ──────────────────────────────────────────────── */

const HomeRamadan = () => {
    const [city, setCity] = useState("Kumanovë");
    const [isCity, setIsCity] = useState(false);
    const { address, isLoading: isLoadingLocation } = useLocation();
    const dropdownRef = useRef(null);
    const [timeCountDown, setTimeCountDown] = useState("");

    useEffect(() => {
        const storageCity = localStorage.getItem("city");
        if (address?.country === "North Macedonia") {
            if (!storageCity) {
                setCity(cities[address?.city]);
                localStorage.setItem("city", cities[address?.city]);
            } else if (storageCity !== address?.city) {
                setCity(cities[address?.city]);
            } else {
                setCity(cities[storageCity]);
            }
        } else {
            setCity("Kumanovë");
        }
    }, [address?.city, address?.country]);

    const { data, isLoading, error } = usePrayersTime(city);

    useEffect(() => {
        if (!data || !data[0]) return;

        const updateCountdown = () => {
            const newCountdown = calculateTimeDifference(data[0].timings);
            setTimeCountDown(newCountdown);

            const now = new Date();
            const prayerTime = nextPrayer(data[0].timings);
            const prevPrayer = localStorage.getItem('prev');

            if (
                newCountdown.includes("s") ||
                (now.getHours() === 0 && now.getMinutes() <= 1) ||
                prevPrayer !== prayerTime
            ) {
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
            <Layout bg={ramadanGradient['Isha']}>
                <Paragraph>Error loading prayer times. Please refresh.</Paragraph>
            </Layout>
        );
    }

    const today = data;
    const prayerTime = nextPrayer(today[0].timings);
    const timecountdown = timeCountDown || calculateTimeDifference(today[0].timings);
    const currentPrayer = nextPrayerIconColor(today[0].timings, today[0].date);
    const bg = ramadanGradient[currentPrayer] ?? ramadanGradient['Isha'];

    localStorage.setItem('prev', prayerTime);

    const handleCity = () => setIsCity(prev => !prev);
    const handleSelectCity = (selectedCity) => {
        setCity(selectedCity);
        setIsCity(false);
        localStorage.setItem("city", selectedCity);
    };
    const handleIsOpenDropdown = () => setIsCity(prev => !prev);

    return (
        <Layout bg={bg}>

            <Moon />

            <Arch />

            {/* ── Main content ─────────────────────────────────── */}
            <Location>
                <FlexGroup type="row">
                    <FlexGroup type="row">
                        <Icon><HiOutlineLocationMarker /></Icon>
                        <FlexGroup style={{zIndex: 1000}}>
                            <FlexGroup type="row" onClick={handleCity} style={{ cursor: 'pointer' }}>
                                <Paragraph>{city}</Paragraph>
                                {isCity ? <HiChevronUp /> : <HiChevronDown />}
                            </FlexGroup>
                            {isCity && (
                                <Dropdown
                                    onSelectCity={handleSelectCity}
                                    onOpenDropdown={handleIsOpenDropdown}
                                    backgroundColor={bg}
                                />
                            )}
                        </FlexGroup>
                    </FlexGroup>
                </FlexGroup>
            </Location>

            <Icon bigIcon>
                {createElement(ICONS[currentPrayer])}
            </Icon>

            <FlexGroup>
                <Paragraph style={{ alignSelf: 'center' }}>
                    {PRAYERS[prayerTime]} {nextPrayerTime(today[0].timings)}
                </Paragraph>
                <Paragraph style={{ alignSelf: 'center' }} >
                    {timecountdown}
                </Paragraph>
            </FlexGroup>

            <FlexGroup minHeight>
                <FlexGroup type="row" style={{ alignSelf: 'center' }}>
                    <p>{gregorianDate(today[0].date.gregorian)}</p>
                    {today[0].date.hijri && (
                        <>
                            <Separator />
                            <p>{hijriDate(today[0].date.hijri)}</p>
                        </>
                    )}
                </FlexGroup>
                <Times today={today} />
            </FlexGroup>

            <Paragraph style={{ fontSize: '1.5rem' }}>
                Created by <a href="https://drilonsaiti.github.io" target="_blank" rel="noopener noreferrer">Drilon Saiti</a>
            </Paragraph>
        </Layout>
    );
};

export default HomeRamadan;