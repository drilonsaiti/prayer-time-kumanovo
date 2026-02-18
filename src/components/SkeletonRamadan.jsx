import styled, {keyframes} from "styled-components";

const shimmer = keyframes`
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
`;

const pulse = keyframes`
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
`;

const twinkle = keyframes`
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.6; }
`;

// Ramadan-themed skeleton with gold accents
const SkeletonBlock = styled.div`
    background: linear-gradient(
        90deg,
        rgba(255, 215, 0, 0.04) 0px,
        rgba(255, 215, 0, 0.12) 40px,
        rgba(255, 215, 0, 0.04) 80px
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
    position: relative;
    overflow: hidden;
    
    /* Ramadan gradient background */
    background: linear-gradient(135deg, 
        #1a0b2e 0%,
        #2d1b4e 25%,
        #3d2463 50%,
        #2d1b4e 75%,
        #1a0b2e 100%
    );
    
    /* Islamic pattern overlay */
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
    
    > * {
        position: relative;
        z-index: 1;
    }
`;

// Decorative elements
const Crescent = styled.div`
    position: absolute;
    top: 8%;
    right: 10%;
    font-size: 4rem;
    color: rgba(255, 215, 0, 0.3);
    animation: ${pulse} 3s ease-in-out infinite;
    z-index: 0;
    
    &::before {
        content: '☪';
    }
`;

const Star = styled.span`
    position: absolute;
    color: rgba(255, 215, 0, 0.3);
    font-size: ${props => props.size || '1rem'};
    animation: ${twinkle} ${props => props.duration || '3s'} infinite;
    animation-delay: ${props => props.delay || '0s'};
    top: ${props => props.top};
    left: ${props => props.left};
    right: ${props => props.right};
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
    background: linear-gradient(135deg, 
        rgba(255, 215, 0, 0.06) 0%,
        rgba(255, 215, 0, 0.1) 100%
    );
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 215, 0, 0.15);
`;

const TimeCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 7rem;
    height: 12.5rem;
    border-radius: 8px;

    &:nth-of-type(odd) {
        background: linear-gradient(135deg, 
            rgba(255, 215, 0, 0.04) 0%,
            rgba(255, 215, 0, 0.08) 100%
        );
        border: 1px solid rgba(255, 215, 0, 0.1);
    }
`;

const SkeletonCircle = styled(SkeletonBlock)`
    border-radius: 50%;
    width: ${props => props.size || '3rem'};
    height: ${props => props.size || '3rem'};
    flex-shrink: 0;
`;

const RamadanBanner = styled.div`
    position: absolute;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.8rem 2rem;
    border-radius: 50px;
    background: linear-gradient(90deg, 
        rgba(45, 27, 78, 0.8) 0%,
        rgba(61, 36, 99, 0.9) 50%,
        rgba(45, 27, 78, 0.8) 100%
    );
    border: 2px solid rgba(255, 215, 0, 0.2);
    z-index: 2;
    animation: ${pulse} 2s infinite;
`;

const SkeletonSkeleton = () => {
    return (
        <SkeletonLayout>
            {/* Ramadan decorations */}
            <RamadanBanner>
                <SkeletonBlock width="12rem" height="1.4rem" radius="4px" />
            </RamadanBanner>
            <Crescent />

            {/* Scattered stars */}
            <Star size="1.5rem" top="12%" left="20%" duration="4s" delay="0.5s">✦</Star>
            <Star size="1rem" top="70%" left="8%" duration="5s" delay="1s">✦</Star>
            <Star size="1.2rem" top="85%" right="12%" duration="3.5s" delay="2s">✦</Star>
            <Star size="1.3rem" top="40%" right="8%" duration="3s" delay="1.8s">✦</Star>

            <LocationRow>
                <SkeletonCircle size="2.4rem" />
                <SkeletonBlock width="12rem" height="2.5rem" radius="6px" />
            </LocationRow>

            <IconRow>
                <SkeletonCircle size="8rem" />
            </IconRow>

            <PrayerInfoRow>
                <SkeletonBlock width="18rem" height="2.5rem" radius="6px" />
                <SkeletonBlock width="22rem" height="7rem" radius="10px" />
            </PrayerInfoRow>

            <TimesRow>
                <DateRow>
                    <SkeletonBlock width="9rem" height="1.4rem" radius="4px" />
                    <SkeletonBlock width="1px" height="2rem" style={{backgroundColor: 'rgba(255,215,0,0.2)'}} />
                    <SkeletonBlock width="9rem" height="1.4rem" radius="4px" />
                </DateRow>

                <TimesGrid>
                    {[...Array(5)].map((_, i) => (
                        <TimeCard key={i}>
                            <SkeletonBlock width="4rem" height="1.4rem" radius="4px" />
                            <SkeletonCircle size="2.4rem" />
                            <SkeletonBlock width="4rem" height="1.4rem" radius="4px" />
                        </TimeCard>
                    ))}
                </TimesGrid>
            </TimesRow>

            <SkeletonBlock width="14rem" height="1.5rem" radius="4px" />
        </SkeletonLayout>
    );
};

export default SkeletonSkeleton;