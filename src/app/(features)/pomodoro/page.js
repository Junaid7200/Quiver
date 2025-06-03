"use client"

import { useState, useRef, useEffect } from 'react'

export default function PomodoroPage() {
    // Timer mode constants
    const TIMER_MODES = {
        POMODORO: 'pomodoro',
        SHORT_BREAK: 'shortBreak',
        LONG_BREAK: 'longBreak'
    };

    // Timer duration constants (in seconds)
    const TIMER_DURATIONS = {
        [TIMER_MODES.POMODORO]: 60 * 60, // 60 minutes
        [TIMER_MODES.SHORT_BREAK]: 5 * 60, // 5 minutes
        [TIMER_MODES.LONG_BREAK]: 15 * 60 // 15 minutes
    };

    // States
    const [currentMode, setCurrentMode] = useState(TIMER_MODES.POMODORO);
    const [timeInSeconds, setTimeInSeconds] = useState(TIMER_DURATIONS[TIMER_MODES.POMODORO]);
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(100); // Start at 100% (full time)
    const [isDragging, setIsDragging] = useState(false);
    const [checkInCount, setCheckInCount] = useState(0); // Number of check-ins
    const [checkInTimes, setCheckInTimes] = useState([]); // Times for check-ins (remaining time)
    const [showCheckIn, setShowCheckIn] = useState(false); // Show check-in popup
    const [wasRunning, setWasRunning] = useState(false); // Track if timer was running before check-in
    const [accountabilityPhone, setAccountabilityPhone] = useState(''); // Accountability partner phone
    const [isPhoneSet, setIsPhoneSet] = useState(false); // Whether phone is set
    const [customMessage, setCustomMessage] = useState(''); // Custom accountability message
    const [showMessageEditor, setShowMessageEditor] = useState(false); // Show message editor popup
    const [checkInTimeout, setCheckInTimeout] = useState(null); // Timeout for check-in response
    const progressBarRef = useRef(null);
    const handleRef = useRef(null);


    // Default accountability message
    const getAccountabilityMessage = () => {
        return customMessage || `Hey! Your accountability partner seems to have lost focus during their pomodoro session. They haven't responded to a focus check-in. You might want to check on them! 🍅⏰`;
    };

    // Set accountability partner
    const setAccountabilityPartner = () => {
        if (validatePhoneNumber(accountabilityPhone)) {
            setIsPhoneSet(true);
            console.log(`Accountability partner set: ${accountabilityPhone}`);
        }
    };


        // Send SMS to accountability partner (simulation)
    const sendAccountabilitySMS = () => {
        // accountabilityPhone.startsWith('0') ? `+92${accountabilityPhone.slice(1)}` : accountabilityPhone;
        sendWhatsAppMessage();
        const message = getAccountabilityMessage();

        console.log(`SMS sent to ${accountabilityPhone}: ${message}`);
        // In real implementation, this would call an SMS API
        alert(`SMS sent to accountability partner: ${accountabilityPhone}\n\nMessage: ${message}`);
    };

        // Handle check-in timeout (20 seconds)
    const handleCheckInTimeout = () => {
        console.log('Check-in timeout - sending SMS to accountability partner');
        sendAccountabilitySMS();
        setShowCheckIn(false);
        setWasRunning(false);


            setTimeout(() => {
        if (wasRunning) {
            setIsRunning(true);
        }
    }, 500);
    };

// Handle check-in timeout - set 20 second timer when check-in appears
useEffect(() => {
    if (showCheckIn) {
        // Set a 20-second timeout
        const timeout = setTimeout(() => {
            handleCheckInTimeout();
        }, 20000); // 20 seconds
        
        setCheckInTimeout(timeout);
        
        // Clear timeout when component unmounts or showCheckIn changes
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    } else {
        // Clear any existing timeout when check-in is dismissed
        if (checkInTimeout) {
            clearTimeout(checkInTimeout);
            setCheckInTimeout(null);
        }
    }
}, [showCheckIn]);

    // Get current total time based on mode
    const getTotalTime = () => TIMER_DURATIONS[currentMode];
    
    // Format seconds to mm:ss
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate check-in times based on simple formula
    const calculateCheckInTimes = (totalTime, numberOfCheckIns) => {
        if (numberOfCheckIns === 0) return [];
        
        const interval = totalTime / (numberOfCheckIns + 1);
        const times = [];
        
        for (let i = 1; i <= numberOfCheckIns; i++) {
            // Calculate remaining time when check-in should occur
            const remainingTime = Math.floor(totalTime - (interval * i));
            times.push(remainingTime);
        }
        
        console.log(`Total time: ${totalTime}s, Check-ins: ${numberOfCheckIns}, Interval: ${interval}s`);
        console.log('Scheduled check-in times (remaining):', times.map(t => `${t}s (${formatTime(t)})`));
        
        return times;
    };




async function sendWhatsAppMessage() {
    if (!validatePhoneNumber(accountabilityPhone)) {
        alert('Please enter a valid phone number starting with 0 and 11 digits');
        return;
    }

    const message = getAccountabilityMessage();

    try {
        const response = await fetch('/api/sendWhatsApp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toNumber: accountabilityPhone, message }),
        });

        if (response.ok) {
            alert('Message sent successfully!');
        } else {
            const errorData = await response.json();
            alert('Failed to send message: ' + (errorData.error || errorData.message));
        }
    } catch (error) {
        alert('Error sending message: ' + error.message);
    }
}


    // Set up check-in times when check-in count changes or when starting a new session
    useEffect(() => {
        if (currentMode === TIMER_MODES.POMODORO) {
            const totalTime = getTotalTime();
            handleReset();
            const newCheckInTimes = calculateCheckInTimes(totalTime, checkInCount);
            setCheckInTimes(newCheckInTimes);
        } 
        else {
            setCheckInTimes([]);
        }
    }, [checkInCount, currentMode]);

    // Change timer mode
    const changeTimerMode = (mode) => {
        // Prevent changing mode while timer is running
        if (isRunning) return;  
        
        setIsRunning(false);
        setCurrentMode(mode);
        setTimeInSeconds(TIMER_DURATIONS[mode]);
        setProgress(100);
        // Check-in times will be reset by the useEffect above
    };

    // Handle check-in response
    const handleCheckInResponse = (stillFocusing) => {
            if (checkInTimeout) {
        clearTimeout(checkInTimeout);
        setCheckInTimeout(null);
    }
        setShowCheckIn(false);
        if (stillFocusing && wasRunning) {
            // Add a small delay before resuming to ensure UI has time to update
            setTimeout(() => {
                setIsRunning(true);
                setWasRunning(false);
            }, 300);
        } else {
            // Reset wasRunning state
            setWasRunning(false);
        }
    };

    // Timer countdown effect
    useEffect(() => {
        let interval;
        if (isRunning && timeInSeconds > 0) {
            interval = setInterval(() => {
                setTimeInSeconds(prev => {
                    const newTime = prev - 1;
                    
                    // Debug logging every 10 seconds
                    if (checkInTimes.length > 0 && newTime % 10 === 0) {
                        console.log(`Current remaining time: ${newTime}s, Check-in times:`, checkInTimes);
                    }
                    
                    // Check if current remaining time matches any of our scheduled check-ins
                    if (checkInTimes.includes(newTime)) {
                        console.log(`Check-in triggered at ${formatTime(newTime)} remaining`);
                        setWasRunning(true);
                        setIsRunning(false);
                        setShowCheckIn(true);
                    }
                    
                    setProgress((newTime / getTotalTime()) * 100);
                    return newTime;
                });
            }, 1000);
        } else if (timeInSeconds === 0) {
            setIsRunning(false);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeInSeconds, currentMode, checkInTimes]);

    // Handle progress bar click - only for Pomodoro mode
    const handleProgressBarClick = (e) => {
        // Prevent adjusting timer while it's running
        if (currentMode !== TIMER_MODES.POMODORO || isRunning) return;
        
        if (progressBarRef.current) {
            const rect = progressBarRef.current.getBoundingClientRect();
            const clickPosition = e.clientX - rect.left;
            const barWidth = rect.width;
            const newProgress = Math.min(Math.max((clickPosition / barWidth) * 100, 0), 100);
            
            // Update time based on progress
            const newTimeInSeconds = Math.round((newProgress / 100) * getTotalTime());
            setTimeInSeconds(newTimeInSeconds);
            setProgress(newProgress);
            
            // Recalculate check-in times based on new time
            if (checkInCount > 0) {
                const newCheckInTimes = calculateCheckInTimes(newTimeInSeconds, checkInCount);
                setCheckInTimes(newCheckInTimes);
            }
        }
    };

    // Handle mouse down on the progress handle - only for Pomodoro mode
    const handleMouseDown = (e) => {
        if (currentMode !== TIMER_MODES.POMODORO || isRunning) return;
        
        e.stopPropagation(); // Prevent click from propagating to the progress bar
        setIsDragging(true);
    };

    // Handle mouse move for dragging - only for Pomodoro mode
    const handleMouseMove = (e) => {
        if (currentMode !== TIMER_MODES.POMODORO || !isDragging || !progressBarRef.current) return;
        
        const rect = progressBarRef.current.getBoundingClientRect();
        const position = e.clientX - rect.left;
        const barWidth = rect.width;
        const newProgress = Math.min(Math.max((position / barWidth) * 100, 0), 100);
        
        // Update time based on progress
        const newTimeInSeconds = Math.round((newProgress / 100) * getTotalTime());
        setTimeInSeconds(newTimeInSeconds);
        setProgress(newProgress);
        
        // Recalculate check-in times based on new time
        if (checkInCount > 0) {
            const newCheckInTimes = calculateCheckInTimes(newTimeInSeconds, checkInCount);
            setCheckInTimes(newCheckInTimes);
        }
    };
// Validate phone number - exactly 13 characters starting with +92
const validatePhoneNumber = (phone) => {
    // Check if exactly 13 characters, starts with +92, and rest are digits
    const phoneRegex = /^\+92\d{10}$/;
    return phoneRegex.test(phone);
};


    // Handle mouse up to stop dragging
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Add event listeners for dragging
    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, currentMode]);

    // Don't pause timer when tab switching
    useEffect(() => {
        const handleVisibilityChange = () => {
            // Do nothing when tab is switched - timer keeps running in background
            // This ensures check-ins still happen at their scheduled times
            // regardless of whether user is looking at this tab or not
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isRunning]);

    // Handle play/pause toggle
    const togglePlayPause = () => {
        setIsRunning(prev => !prev);
    };

    // Handle reset
    const handleReset = () => {
        setIsRunning(false);
        const totalTime = getTotalTime();
        setTimeInSeconds(totalTime);
        setProgress(100);
        
        // Recalculate check-in times for the full duration
        if (checkInCount > 0 && currentMode === TIMER_MODES.POMODORO) {
            const newCheckInTimes = calculateCheckInTimes(totalTime, checkInCount);
            setCheckInTimes(newCheckInTimes);
        }
    };

    return (
        <div className="flex h-100vh ">
            <div className="m-10 pomodoro-timer w-[40%] border border-gray-500 rounded-2xl flex items-center flex-col px-6 py-12">
                <h2 className="font-semibold text-2xl">Pomodoro Timer</h2>
                <p className="text-gray-400 mb-[20px]">Work in focused intervals for maximum productivity</p>
                {isRunning && (
                    <div className="bg-[#FF6B9E]/20 text-[#FF6B9E] p-2 rounded-md mb-2 text-sm">
                        Timer is running. Some settings are locked to prevent cheating.
                    </div>
                )}

                <div className="w-full bg-[#27272A] rounded-2xl h-[7%] m-[2%] flex justify-between px-[2%]">
                    <button 
                        onClick={() => changeTimerMode(TIMER_MODES.POMODORO)}
                        className={`rounded-2xl p-[10px] m-[2px] ${currentMode === TIMER_MODES.POMODORO ? 'bg-black' : ''} ${isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/30'}`}
                        disabled={isRunning}
                    >
                        Pomodoro
                    </button>
                    <button 
                        onClick={() => changeTimerMode(TIMER_MODES.SHORT_BREAK)}
                        className={`rounded-2xl p-[10px] m-[2px] ${currentMode === TIMER_MODES.SHORT_BREAK ? 'bg-black' : ''} ${isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/30'}`}
                        disabled={isRunning}
                    >
                        Short Break
                    </button>
                    <button 
                        onClick={() => changeTimerMode(TIMER_MODES.LONG_BREAK)}
                        className={`rounded-2xl p-[10px] m-[2px] ${currentMode === TIMER_MODES.LONG_BREAK ? 'bg-black' : ''} ${isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/30'}`}
                        disabled={isRunning}
                    >
                        Long Break
                    </button>
                </div>

                <div className="gray-outline-div border-[10px] border-[#27272A] w-[300px] h-[300px] rounded-full relative">
                    <div className="pink-outline-div absolute inset-0 border-[4px] border-[#FF6B9E] rounded-full flex items-center justify-center">
                        <div className="timer-display text-6xl text-white">
                            <h2 className="text-[#FF6B9E]">{formatTime(timeInSeconds)}</h2>
                            
                        </div>
                    </div>
                </div>

                {/* Control buttons */}
                <div className="control-buttons flex justify-center gap-6 mt-6">
                    {/* Play/Pause button */}
                    <button 
                        onClick={togglePlayPause} 
                        className="play-pause-btn w-[50px] h-[50px] bg-[#111111] border border-[#333333] rounded-full flex items-center justify-center"
                    >
                        {isRunning ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="6" y="4" width="4" height="16" rx="1" fill="#FF6B9E"/>
                                <rect x="14" y="4" width="4" height="16" rx="1" fill="#FF6B9E"/>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5V19L19 12L8 5Z" fill="#FF6B9E"/>
                            </svg>
                        )}
                    </button>
                    
                    {/* Reset button */}
                    <button 
                        onClick={handleReset}
                        className="reset-btn w-[50px] h-[50px] bg-[#111111] border border-[#333333] rounded-full flex items-center justify-center"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="#FF6B9E"/>
                        </svg>
                    </button>
                </div>

                {/* Progress bar - Only functional in Pomodoro mode */}
                <div 
                    ref={progressBarRef}
                    onClick={handleProgressBarClick}
                    className={`progress-bar w-[300px] h-[8px] bg-[#27272A] rounded-full mt-6 relative ${currentMode === TIMER_MODES.POMODORO && !isRunning ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                    <div 
                        className="progress-complete bg-[#FF6B9E] h-full rounded-full" 
                        style={{ width: `${progress}%` }}
                    ></div>
                    {currentMode === TIMER_MODES.POMODORO && !isRunning && (
                        <div 
                            ref={handleRef}
                            onMouseDown={handleMouseDown}
                            className={`progress-handle absolute top-1/2 w-[20px] h-[20px] bg-[#9B6DFF] border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                            style={{ left: `${progress}%` }}
                        ></div>
                    )}
                </div>
            </div>



            {/* Accountability Partner Setup */}
            <div className="accountability-setup m-10 w-[25%] border border-gray-500 rounded-2xl flex flex-col items-center px-6 py-12">
                <h2 className="text-2xl font-semibold mb-2">Accountability Partner</h2>
                <p className="text-gray-400 mb-6 text-center">Set up someone to keep you accountable during focus sessions</p>
                
                {!isPhoneSet ? (
                    <div className="w-full">
                        <label className="block text-sm font-medium mb-2">WhatsApp Phone Number</label>
                        <input
                            type="tel"
                            value={accountabilityPhone}
                            onChange={(e) => {
                                let value = e.target.value;

                                // If user starts typing and doesn't have +92, add it
                                if (value.length > 0 && !value.startsWith('+92')) {
                                    value = '+92' + value.replace(/^\+92/, '');
                                }

                                // Only allow +, numbers, and limit to 13 characters
                                value = value.replace(/[^\+\d]/g, '').slice(0, 13);

                                // Ensure it always starts with +92 if there's any input
                                if (value.length > 0 && !value.startsWith('+92')) {
                                    value = '+92';
                                }
        setAccountabilityPhone(value);
                            }}
                            placeholder="+923120720020"
                            className="w-full p-3 bg-[#27272A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#FF6B9E] focus:outline-none"
                            maxLength="13"
                        />
                            {/* Validation message */}
                            {accountabilityPhone && !validatePhoneNumber(accountabilityPhone) && (
                                <p className="text-red-400 text-sm mt-1">
                                    Phone number must be exactly 13 digits starting with +92 (e.g., +9203120720020)
                                </p>
                            )}



                        <button
                            onClick={setAccountabilityPartner}
                            disabled={!accountabilityPhone.trim()}
                            className="w-full mt-4 p-3 bg-[#FF6B9E] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Set Accountability Partner
                        </button>
                    </div>
                ) : (
                    <div className="w-full text-center">
                        <div className="mb-4 p-4 bg-green-900/30 border border-green-600 rounded-lg">
                            <p className="text-green-400 font-medium">✓ Accountability Partner Set</p>
                            <p className="text-gray-300 text-sm mt-1">{accountabilityPhone}</p>
                        </div>
                        <button
                            onClick={() => {setIsPhoneSet(false); setAccountabilityPhone('');}}
                            className="w-full p-2 bg-[#333333] text-white rounded-lg hover:bg-opacity-90 text-sm"
                        >
                            Change Partner
                        </button>
                    </div>
                )}
                
                <div className="mt-8 w-full">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg">Accountability Message</h3>
                        <button
                            onClick={() => setShowMessageEditor(true)}
                            className="p-2 bg-[#27272A] text-[#FF6B9E] rounded-lg hover:bg-opacity-80 text-sm"
                        >
                            Edit
                        </button>
                    </div>
                    <div className="p-3 bg-[#27272A] rounded-lg text-sm text-gray-300">
                        {getAccountabilityMessage()}
                    </div>
                </div>
                
                <div className="accountability-info mt-8 p-4 bg-[#27272A] rounded-lg w-full">
                    <h3 className="text-lg mb-2">How it works:</h3>
                    <ul className="list-disc pl-5 text-gray-300 space-y-2 text-sm">
                        <li>If you don't respond to a check-in within 20 seconds</li>
                        <li>Your accountability partner will receive an SMS</li>
                        <li>This helps ensure you stay focused and accountable</li>
                        <li>You must set a partner before starting the timer</li>
                    </ul>
                </div>
            </div>




            
            {/* Check-in settings */}
            <div className="check-in-settings m-10 w-[30%] min-h-[70%] border border-gray-500 rounded-2xl flex flex-col items-center px-6 py-12">
                <h2 className="text-2xl font-semibold mb-2">Focus Check-ins</h2>
                <p className="text-gray-400 mb-6 text-center">Select how many times you want to be checked on during your focus session</p>
                
                <div className="check-in-selector flex flex-col items-center w-full">
                    <p className="text-lg mb-2">Number of Check-ins: {checkInCount}</p>
                    <input 
                        type="range" 
                        min="0" 
                        max="15" 
                        value={checkInCount} 
                        onChange={(e) => setCheckInCount(Number(e.target.value))}
                        className="w-3/4 h-2 bg-[#27272A] rounded-full appearance-none cursor-pointer"
                        disabled={currentMode !== TIMER_MODES.POMODORO || isRunning}
                    />
                    <div className="flex justify-between w-3/4 mt-2">
                        <span>0</span>
                        <span>3</span>
                        <span>6</span>
                        <span>9</span>
                        <span>12</span>
                        <span>15</span>
                    </div>
                </div>
                
                <div className="check-in-info mt-8 p-4 bg-[#27272A] rounded-lg w-full">
                    <h3 className="text-lg mb-2">How it works:</h3>
                    <ul className="list-disc pl-5 text-gray-300 space-y-2">
                        <li>Check-ins are evenly distributed throughout your focus session</li>
                        <li>When a check-in occurs, your timer will pause</li>
                        <li>Confirm you're still focusing to resume the timer</li>
                        <li>This helps maintain accountability during long sessions</li>
                    </ul>
                </div>
                
                {checkInCount > 0 && (
                    <div className="mt-6 text-center">
                        <p className="text-[#FF6B9E]">You will be checked {checkInCount} time{checkInCount > 1 ? 's' : ''} during your focus session</p>
                    </div>
                )}
            </div>

            {/* Check-in popup */}
            {showCheckIn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-[#27272A] p-8 rounded-2xl max-w-md w-full">
                        <div className="flex items-center justify-center mb-4">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF6B9E" strokeWidth="2"/>
                                <path d="M12 6V12L16 14" stroke="#FF6B9E" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <h3 className="text-2xl ml-2 text-[#FF6B9E]">Focus Check-in</h3>
                        </div>
                        <p className="text-xl mb-2">Are you still focusing?</p>
                        <p className="text-gray-400 mb-6">This is a scheduled check-in to help maintain your focus.</p>
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={() => handleCheckInResponse(true)}
                                className="px-6 py-2 bg-[#FF6B9E] text-white rounded-lg hover:bg-opacity-90"
                            >
                                Yes, still focusing
                            </button>
                            <button 
                                onClick={() => handleCheckInResponse(false)}
                                className="px-6 py-2 bg-[#333333] text-white rounded-lg hover:bg-opacity-90"
                            >
                                No, taking a break
                            </button>
                        </div>
                    </div>
                </div>
            )}



           {/* Message Editor Popup */}
            {showMessageEditor && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-[#27272A] p-8 rounded-2xl max-w-lg w-full">
                        <h3 className="text-2xl mb-4 text-[#FF6B9E]">Edit Accountability Message</h3>
                        <p className="text-gray-400 mb-4">Customize the message sent to your accountability partner when you don't respond to check-ins.</p>
                        <textarea
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            placeholder="Enter your custom message here..."
                            className="w-full h-32 p-3 bg-[#111111] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#FF6B9E] focus:outline-none resize-none"
                        />
                        <div className="flex justify-between gap-4 mt-4">
                            <button 
                                onClick={() => {setCustomMessage(''); setShowMessageEditor(false);}}
                                className="px-4 py-2 bg-[#333333] text-white rounded-lg hover:bg-opacity-90"
                            >
                                Use Default
                            </button>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setShowMessageEditor(false)}
                                    className="px-4 py-2 bg-[#333333] text-white rounded-lg hover:bg-opacity-90"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => setShowMessageEditor(false)}
                                    className="px-4 py-2 bg-[#FF6B9E] text-white rounded-lg hover:bg-opacity-90"
                                >
                                    Save Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            
        </div>
    )
}