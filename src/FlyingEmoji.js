import React, { useState } from 'react';

function App() {
    const [animationClass, setAnimationClass] = useState('');

    const emojis = ['🎉', '🎊', '🎁', '🎂', '🎈', '🎇', '🎆', '🎄', '🎁', '🎂', '🎈', '🎇', '🎆', '🎄', '🎁', '🎂'];

    return (
        <div className="container">
            <button onClick={() => setAnimationClass(animationClass === '' ? 'emoji-animation' : '')}>Like</button>
            <div className={`emoji-container ${animationClass}`}>
                {emojis.map((emoji, index) => (
                    <div className={`emoji emoji-${index}`} key={index}>{emoji}</div>
                ))}
            </div>
        </div>
    );
}

export default App;
