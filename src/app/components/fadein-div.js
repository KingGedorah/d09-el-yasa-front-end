import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FadeInWrapper = styled.div`
    marginBottom: '100px';
    opacity: 0;
    transition: opacity 1s ease-in-out;
    
    &.fadeIn {
        opacity: 1;
    }
`;

const FadeIn = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <FadeInWrapper className={isVisible ? 'fadeIn' : ''}>
            {children}
        </FadeInWrapper>
    );
};

export default FadeIn;