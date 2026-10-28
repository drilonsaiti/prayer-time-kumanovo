import {useEffect, useRef} from 'react';
import styled, {keyframes} from 'styled-components';
import PrayerIcon from '../components/PrayerIcons.jsx';

const CITIES = ["Kumanovë", "Tetovë", "Strugë", "Shkup", "Gostivar", "Prilep", "Kërçovë", "Dibër", "Veles"];

const open = keyframes`
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: none; }
`;

const Panel = styled.div`
    position: absolute;
    top: calc(100% + 6px);
    right: 10px;
    z-index: 10;
    width: min(280px, calc(100% - 20px));
    max-height: 70dvh;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    background: var(--paper);
    color: var(--ink);
    border: 1.5px solid var(--ink);
    border-radius: 14px;
    box-shadow: 0 18px 32px -12px rgba(0, 0, 0, 0.55);
    animation: ${open} 0.16s ease-out;

    @media (prefers-reduced-motion: reduce) { animation: none; }
`;

const Title = styled.p`
    padding: 12px 18px 8px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--soft);
`;

const List = styled.ul`
    list-style: none;
`;

const Item = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 52px;
    padding: 0 18px;
    text-align: left;
    font: inherit;
    font-size: 19px;
    color: inherit;
    background: none;
    border: 0;
    border-top: 1px solid var(--rule);
    cursor: pointer;

    .pin { color: var(--soft); display: inline-flex; }
    .name { flex: 1; }
    .check { color: var(--red); display: inline-flex; }

    &:hover,
    &:focus-visible {
        background: var(--ink);
        color: var(--paper);
        outline: none;
    }
    &:hover .pin, &:focus-visible .pin, &:hover .check, &:focus-visible .check { color: var(--paper); }

    &[aria-selected="true"] { font-weight: 800; color: var(--red); }
    &[aria-selected="true"]:hover,
    &[aria-selected="true"]:focus-visible { color: var(--paper); }
`;

const Dropdown = ({onSelectCity, onOpenDropdown, current}) => {
    const ref = useRef(null);
    const opener = useRef(document.activeElement);

    useEffect(() => {
        const onPointerDown = (e) => {
            if (!ref.current || ref.current.contains(e.target)) return;
            // A press on the city button itself is handled by its own click (it toggles).
            // Closing here too would make the click re-open the list.
            if (e.target.closest?.('[aria-haspopup="listbox"]')) return;
            onOpenDropdown();
        };
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                onOpenDropdown();
                opener.current?.focus?.();
            }
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onOpenDropdown]);

    // Put the focus on the current city when the list opens (keyboard and screen readers).
    useEffect(() => {
        const selected = ref.current?.querySelector('[aria-selected="true"]');
        selected?.focus({preventScroll: true});
        selected?.scrollIntoView?.({block: 'nearest'}); // keep the current city in view
    }, []);

    const onListKeyDown = (e) => {
        const items = [...ref.current.querySelectorAll('[role="option"]')];
        const i = items.indexOf(document.activeElement);
        const move = {ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1}[e.key];
        if (move === undefined) return;
        e.preventDefault();
        items[(move + items.length) % items.length]?.focus();
    };

    return (
        <Panel ref={ref} onKeyDown={onListKeyDown}>
            <Title>Zgjidh qytetin</Title>
            <List role="listbox" aria-label="Zgjidh qytetin">
                {CITIES.map((name) => (
                    <li key={name} role="presentation">
                        <Item type="button" role="option" aria-selected={name === current}
                              onClick={() => onSelectCity(name)}>
                            <span className="pin"><PrayerIcon name="Pin" size={18}/></span>
                            <span className="name">{name}</span>
                            {name === current && <span className="check"><PrayerIcon name="Check" size={20}/></span>}
                        </Item>
                    </li>
                ))}
            </List>
        </Panel>
    );
};

export default Dropdown;
