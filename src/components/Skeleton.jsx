import styled, {keyframes} from "styled-components";

const pulse = keyframes`
    0%, 100% { opacity: .45; }
    50% { opacity: .9; }
`;

const Page = styled.main`
    min-height: 100dvh;
    display: grid;
    place-items: center;
    background: var(--wall);
    padding: 10px;
`;

const Sheet = styled.div`
    width: min(380px, 100%);
    background: var(--paper);
    padding: 28px 22px;
    display: grid;
    gap: 14px;
    justify-items: center;
`;

const Bar = styled.div`
    width: ${(p) => p.$w || "100%"};
    height: ${(p) => p.$h || "18px"};
    background: var(--rule);
    animation: ${pulse} 1.6s ease-in-out infinite;
`;

const Skeleton = () => (
    <Page aria-busy="true" aria-label="Duke ngarkuar">
        <Sheet>
            <Bar $w="40%" $h="14px"/>
            <Bar $w="55%" $h="84px"/>
            <Bar $w="45%" $h="14px"/>
            {[0, 1, 2, 3, 4].map((i) => <Bar key={i}/>)}
        </Sheet>
    </Page>
);

export default Skeleton;
