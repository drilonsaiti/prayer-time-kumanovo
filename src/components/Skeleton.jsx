import styled, {keyframes} from "styled-components";

const shimmer = keyframes`
    0% {
        background-position: -400px 0;
    }
    100% {
        background-position: 400px 0;
    }
`;

const pulse = keyframes`
    0%, 100% {
        opacity: 0.4;
    }
    50% {
        opacity: 0.8;
    }
`;

const SkeletonBlock = styled.div`
    background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.06) 0px,
            rgba(255, 255, 255, 0.15) 40px,
            rgba(255, 255, 255, 0.06) 80px
    );
    background-size: 400px 100%;
    animation: ${shimmer} 1.6s infinite linear;
    border-radius: ${props => props.radius || '8px'};
    width: ${props => props.width || '100%'};
    height: ${props => props.height || '1rem'};
`;


const SkeletonLayout = styled.div`
    height: 100dvh;
    display: grid;
    grid-template-rows: 10rem repeat(3, 1fr) 4rem;
    align-items: center;
    justify-content: center;
    justify-items: center;
    background: linear-gradient(to bottom, #1a1a2e, #16213e);
`;

const LocationRow = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const IconRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ${pulse} 2s infinite ease-in-out;
`;

const PrayerInfoRow = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
`;

const TimesRow = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
`;

const DateRow = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`;

const TimesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, max-content);
    gap: 1rem;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 1rem;
    border-radius: 8px;
`;

const TimeCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 7rem;
    height: 12.5rem;

    &:nth-of-type(odd) {
        background-color: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
    }
`;

const SkeletonCircle = styled(SkeletonBlock)`
    border-radius: 50%;
    width: ${props => props.size || '3rem'};
    height: ${props => props.size || '3rem'};
    flex-shrink: 0;
`;

const SkeletonSkeleton = () => {
    return (
        <SkeletonLayout>

            <LocationRow>
                <SkeletonCircle size="2.4rem"/>
                <SkeletonBlock width="12rem" height="2.5rem" radius="6px"/>
            </LocationRow>

            <IconRow>
                <SkeletonCircle size="8rem"/>
            </IconRow>

            <PrayerInfoRow>
                <SkeletonBlock width="18rem" height="2.5rem" radius="6px"/>
                <SkeletonBlock width="22rem" height="7rem" radius="10px"/>
            </PrayerInfoRow>

            <TimesRow>
                <DateRow>
                    <SkeletonBlock width="9rem" height="1.4rem" radius="4px"/>
                    <SkeletonBlock width="1px" height="2rem" style={{backgroundColor: 'rgba(255,255,255,0.1)'}}/>
                    <SkeletonBlock width="9rem" height="1.4rem" radius="4px"/>
                </DateRow>

                <TimesGrid>
                    {[...Array(5)].map((_, i) => (
                        <TimeCard key={i}>
                            <SkeletonBlock width="4rem" height="1.4rem" radius="4px"/>
                            <SkeletonCircle size="2.4rem"/>
                            <SkeletonBlock width="4rem" height="1.4rem" radius="4px"/>
                        </TimeCard>
                    ))}
                </TimesGrid>
            </TimesRow>

            <SkeletonBlock width="14rem" height="1.5rem" radius="4px"/>

        </SkeletonLayout>
    );
};

export default SkeletonSkeleton;