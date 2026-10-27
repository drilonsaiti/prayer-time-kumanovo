import {useCallback, useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import {usePrayersTime} from './usePrayersTime.js';
import {useLocation} from './useLocation.js';
import {getNextPrayer, getProgress, hasPassed, PRAYERS, skopjeDateLabel, skopjeDateParts} from '../utils/helpers.js';
import Dropdown from '../style/Dropdown.jsx';
import Skeleton from './Skeleton.jsx';
import PrayerIcon from './PrayerIcons.jsx';
import {useTheme} from './useTheme.js';
import {useServiceWorker} from './useServiceWorker.js';
import {hijriLabel, refreshHijriCache} from '../utils/hijri.js';

/* ───────────── Takvim leaf: one paper, one ink, one red ───────────── */
/* Colours come from the theme tokens in GlobalStyles (light / dark). */

const Page = styled.main`
    min-height: 100dvh;
    display: grid;
    place-items: center;
    padding: max(12px, env(safe-area-inset-top)) 10px max(16px, env(safe-area-inset-bottom));
    background: var(--wall);
    color: var(--ink);
    font-family: "Newsreader Variable", Georgia, serif;
    font-size: 16px;
    line-height: 1.3;
    text-shadow: none;

    @media (min-width: 481px) {
        padding: max(24px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom));
    }
`;

const Leaf = styled.article`
    position: relative;
    width: min(420px, 100%);
    background: var(--paper);
    border-radius: 3px 3px 6px 6px;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.08), 0 14px 28px -14px rgba(0, 0, 0, 0.45);
`;

const Head = styled.header`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    min-height: 56px;
    padding: 6px 10px 6px 20px;
    background: var(--ink);
    color: var(--paper);
    border-radius: 3px 3px 0 0;

    &::before,
    &::after {
        content: "";
        position: absolute;
        top: -7px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--wall);
    }
    &::before { left: 26%; }
    &::after { right: 26%; }
`;

const HeadNote = styled.span`
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    opacity: 0.85;
`;

/* A pill with a pin and a chevron, so it clearly reads as a button. */
const CityButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 12px 0 14px;
    background: transparent;
    border: 0;
    border-radius: 999px;
    box-shadow: inset 0 0 0 1.5px var(--paper);
    color: var(--paper);
    font: inherit;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;

    .chev { display: inline-flex; transition: transform 0.2s; }
    &[aria-expanded="true"] .chev { transform: rotate(180deg); }

    &:hover,
    &[aria-expanded="true"] { background: var(--paper); color: var(--ink); }
    &:focus-visible { outline: 2px solid var(--paper); outline-offset: 3px; }

    @media (prefers-reduced-motion: reduce) { &, .chev { transition: none; } }
`;

const Perf = styled.div`
    height: 8px;
    background: radial-gradient(circle at 4px 0, var(--wall) 2.5px, transparent 3px) 0 0 / 10px 8px repeat-x;
`;

const Hero = styled.section`
    padding: 14px 18px 4px;
`;

const NextLabel = styled.div`
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--soft);
`;

const NextName = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
    font-size: clamp(28px, 8.4vw, 34px);
    font-weight: 800;
    line-height: 1.1;
    color: var(--ink);

    svg { color: var(--red); flex: none; }
`;

const pulse = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
`;

const Timer = styled.div`
    margin-top: 10px;
    text-align: center;
    font-size: clamp(68px, 23vw, 104px);
    line-height: 1;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--red);
    font-variant-numeric: lining-nums tabular-nums;

    .colon {
        display: inline-block;
        padding: 0 0.04em;
        animation: ${pulse} 1s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) { .colon { animation: none; } }
`;

const Unit = styled.div`
    margin-top: 2px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--red);
`;

const Progress = styled.div`
    margin: 20px 4px 0;
`;

const Track = styled.div`
    position: relative;
    height: 4px;
    margin: 0 8px;
    border-radius: 2px;
    background: var(--rule);
`;

const Fill = styled.div`
    height: 100%;
    border-radius: 2px;
    background: var(--red);
    transition: width 1s linear;
`;

const Dot = styled.span`
    position: absolute;
    top: 50%;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--red);
    box-shadow: 0 0 0 5px var(--rule);
    transform: translate(-50%, -50%);
    transition: left 1s linear;
`;

const ProgressLabels = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    font-size: 14px;
    font-style: italic;
    color: var(--soft);
`;

const DateLines = styled.p`
    text-align: center;
    margin-top: 16px;
    font-size: 14px;
    font-style: italic;
    color: var(--soft);
`;

const Times = styled.ul`
    --badge: 42px;
    position: relative;
    list-style: none;
    margin: 14px 16px 0;
    border-top: 2px solid var(--ink);

    @media (max-width: 400px) { --badge: 38px; }

    /* thin timeline running through the centre of the icon circles */
    &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: calc(2px + var(--badge) / 2);
        width: 1px;
        background: var(--rule);
    }
`;

const Row = styled.li`
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: ${(p) => (p.$minor ? '46px' : '58px')};
    padding: ${(p) => (p.$minor ? '4px 2px' : '8px 2px')};
    border-bottom: 1px solid var(--rule);
    color: ${(p) => (p.$state === 'next' ? 'var(--red)' : p.$state === 'done' ? 'var(--soft)' : 'var(--ink)')};

    .badge {
        position: relative;
        flex: none;
        display: grid;
        place-items: center;
        width: var(--badge);
        height: var(--badge);
        border-radius: 50%;
        background: var(--paper);
        border: 1.5px solid ${(p) => (p.$state === 'next' ? 'var(--red)' : 'var(--rule)')};
        ${(p) => p.$state === 'next' && 'background: var(--red); color: var(--paper);'}
        ${(p) => p.$minor && 'transform: scale(0.82);'}
    }

    .name {
        flex: 1;
        min-width: 0;
        font-size: ${(p) => (p.$minor ? 'clamp(14px, 4.2vw, 16px)' : 'clamp(18px, 5.4vw, 21px)')};
        font-style: ${(p) => (p.$minor ? 'italic' : 'normal')};
        font-weight: ${(p) => (p.$state === 'next' ? 800 : p.$minor ? 400 : 600)};
        ${(p) => p.$minor && p.$state !== 'next' && 'color: var(--soft);'}
    }

    .time {
        font-size: ${(p) => (p.$minor ? 'clamp(16px, 4.8vw, 18px)' : 'clamp(22px, 6.6vw, 26px)')};
        font-weight: ${(p) => (p.$state === 'next' ? 800 : p.$minor ? 500 : 700)};
        font-variant-numeric: lining-nums tabular-nums;
    }
`;

const Foot = styled.footer`
    display: grid;
    justify-items: center;
    gap: 14px;
    padding: 18px 16px 18px;
    text-align: center;
    font-size: 14px;
    font-style: italic;
    color: var(--soft);

    .heart { color: var(--red); font-style: normal; }
    a {
        display: inline-block;
        padding: 4px 0;
        color: var(--ink);
        font-style: normal;
        font-weight: 600;
        border-bottom: 1px solid var(--red);
    }
    a:focus-visible { outline: 2px solid var(--red); outline-offset: 3px; }
`;

const ThemeSwitch = styled.div`
    display: inline-flex;
    border: 1.5px solid var(--ink);
    border-radius: 999px;
    overflow: hidden;

    button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        padding: 0 18px;
        background: none;
        border: 0;
        color: var(--ink);
        font: inherit;
        font-size: 15px;
        font-style: normal;
        font-weight: 600;
        cursor: pointer;
    }
    button[aria-pressed="true"] { background: var(--ink); color: var(--paper); }
    button:focus-visible { outline: 2px solid var(--red); outline-offset: -4px; }
`;

const UpdateBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 8px 6px 20px;
    background: var(--red);
    color: var(--paper);
    font-size: 15px;

    button {
        min-height: 44px;
        padding: 0 16px;
        background: var(--paper);
        color: var(--ink);
        border: 0;
        border-radius: 999px;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
    }
    button:focus-visible { outline: 2px solid var(--paper); outline-offset: 2px; }
`;

const Message = styled.p`
    padding: 28px 22px;
    text-align: center;
    font-size: 18px;
`;

const SrOnly = styled.div`
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
`;

/* ───────────── logic ───────────── */

const CITY_BY_ENGLISH_NAME = {
    "Kumanovo": "Kumanovë", "Skopje": "Shkup", "Tetovo": "Tetovë", "Struga": "Strugë",
    "Gostivar": "Gostivar", "Prilep": "Prilep", "Kičevo": "Kërçovë", "Debar": "Dibër",
    "Veles": "Veles", "Strumica": "Strumicë",
};
const SELECTABLE = ["Kumanovë", "Tetovë", "Strugë", "Shkup", "Gostivar", "Prilep", "Kërçovë", "Dibër", "Veles"];

const ROWS = [
    {key: 'Imsak', label: 'Imsaku', minor: true},
    {key: 'Fajr', label: 'Sabahu'},
    {key: 'Shuruq', label: 'Lindja e Diellit', minor: true},
    {key: 'Hyrja', label: 'Hyrja e drekës', minor: true},
    {key: 'Dhuhr', label: 'Dreka'},
    {key: 'Asr', label: 'Ikindia'},
    {key: 'Maghrib', label: 'Akshami'},
    {key: 'Isha', label: 'Jacia'},
];

function useNow(intervalMs = 1000) {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), intervalMs);
        return () => clearInterval(id);
    }, [intervalMs]);
    return now;
}

function formatCountdown(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const sec = total % 60;
    const two = (n) => String(n).padStart(2, '0');
    return h > 0
        ? {left: String(h), right: two(m), unit: 'orë · minuta'}
        : {left: two(m), right: two(sec), unit: 'minuta · sekonda'};
}

const Home = () => {
    const [city, setCity] = useState(() => {
        const saved = localStorage.getItem('city');
        return SELECTABLE.includes(saved) ? saved : 'Kumanovë';
    });
    const [isCityOpen, setIsCityOpen] = useState(false);
    const {address} = useLocation();
    const now = useNow(1000);
    const [theme, setTheme] = useTheme();
    const {updateReady, applyUpdate} = useServiceWorker();

    // Save the Hijri calendar on the device while online, so it also shows offline.
    useEffect(() => {
        const refresh = () => refreshHijriCache(skopjeDateParts());
        refresh();
        window.addEventListener('online', refresh);
        return () => window.removeEventListener('online', refresh);
    }, []);

    // A saved choice wins; otherwise follow the visitor's location when it is in North Macedonia.
    useEffect(() => {
        if (SELECTABLE.includes(localStorage.getItem('city'))) return;
        if (address?.country === 'North Macedonia' && CITY_BY_ENGLISH_NAME[address.city]) {
            setCity(CITY_BY_ENGLISH_NAME[address.city]);
        }
    }, [address?.city, address?.country]);

    const {data, isLoading, error} = usePrayersTime(city);

    const toggleCity = useCallback(() => setIsCityOpen((o) => !o), []);
    const closeCity = useCallback(() => setIsCityOpen(false), []);
    const selectCity = useCallback((name) => {
        setCity(name);
        setIsCityOpen(false);
        localStorage.setItem('city', name);
    }, []);

    if (isLoading) return <Skeleton/>;

    const entry = data?.[0];
    const header = (
        <>
            <Head>
                <HeadNote>Kohët e namazit</HeadNote>
                <CityButton type="button" onClick={toggleCity} aria-haspopup="listbox" aria-expanded={isCityOpen}
                            aria-label={`Qyteti: ${city}. Ndrysho qytetin`}>
                    <PrayerIcon name="Pin" size={18}/>
                    {city}
                    <span className="chev"><PrayerIcon name="Chevron" size={18}/></span>
                </CityButton>
                {/* inside Head, so the panel is positioned under the header, not under the whole card */}
                {isCityOpen && <Dropdown current={city} onSelectCity={selectCity} onOpenDropdown={closeCity}/>}
            </Head>
            <Perf aria-hidden="true"/>
            {updateReady && (
                <UpdateBar role="status">
                    <span>Version i ri i gatshëm</span>
                    <button type="button" onClick={applyUpdate}>Rifresko</button>
                </UpdateBar>
            )}
        </>
    );
    const footer = (
        <Foot>
            <ThemeSwitch role="group" aria-label="Pamja: ditë ose natë">
                <button type="button" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>
                    <PrayerIcon name="Hyrja" size={18}/>Ditë
                </button>
                <button type="button" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>
                    <PrayerIcon name="Imsak" size={18}/>Natë
                </button>
            </ThemeSwitch>
            <span>
                crafted with <span className="heart" aria-label="dashuri">♥</span> by{' '}
                <a href="https://drilonsaiti.github.io" target="_blank" rel="noopener noreferrer">Drilon Saiti</a>
            </span>
        </Foot>
    );
    if (error || !entry) {
        return (
            <Page>
                <Leaf>
                    {header}
                    <Message>Nuk u ngarkuan kohët e namazit. Provo përsëri pas pak.</Message>
                    {footer}
                </Leaf>
            </Page>
        );
    }

    const timings = entry.timings;
    const next = getNextPrayer(timings, now);
    const countdown = formatCountdown(next.at.getTime() - now.getTime());
    const progress = getProgress(timings, now);
    // The Hijri day changes at Maghrib, so after Akshami show tomorrow's date.
    const hijriLine = hijriLabel(skopjeDateParts(now, hasPassed(timings.Maghrib, now) ? 1 : 0));

    return (
        <Page>
            <Leaf>
                {header}
                <Hero>
                    <NextLabel>Namazi i radhës:</NextLabel>
                    <NextName><PrayerIcon name={next.key} size={30}/>{PRAYERS[next.key]}</NextName>
                    <Timer role="timer" aria-label={`${countdown.left} ${countdown.right} ${countdown.unit}`}>
                        {countdown.left}<span className="colon" aria-hidden="true">:</span>{countdown.right}
                    </Timer>
                    <Unit>{countdown.unit}</Unit>
                    <Progress role="progressbar" aria-label="Koha deri te namazi i radhës"
                              aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
                        <Track>
                            <Fill style={{width: `${progress * 100}%`}}/>
                            <Dot style={{left: `${progress * 100}%`}}/>
                        </Track>
                        <ProgressLabels><span>Tani</span><span>Namazi i radhës</span></ProgressLabels>
                    </Progress>
                    <DateLines>
                        {skopjeDateLabel(now)}
                        {hijriLine && <><br/>{hijriLine}</>}
                    </DateLines>
                </Hero>

                <Times>
                    {ROWS.filter((r) => timings[r.key]).map((r) => {
                        const time = timings[r.key];
                        const isNext = r.key === next.key;
                        const state = isNext ? 'next' : hasPassed(time, now) ? 'done' : 'todo';
                        return (
                            <Row key={r.key} $minor={r.minor} $state={state}
                                 aria-current={isNext ? 'true' : undefined}>
                                <span className="badge"><PrayerIcon name={r.key}/></span>
                                <span className="name">{r.label}</span>
                                <span className="time">{time}</span>
                            </Row>
                        );
                    })}
                </Times>

                {footer}
                <SrOnly aria-live="polite">{`${PRAYERS[next.key]} hyn në ${timings[next.key]}`}</SrOnly>
            </Leaf>
        </Page>
    );
};

export default Home;
