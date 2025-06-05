"use client";
import { format, eachDayOfInterval, startOfWeek, addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const DashboardHeatmap = ({ data, onDateSelect }) => {
    const now = new Date();
    const [selectedDate, setSelectedDate] = useState(format(now, 'yyyy-MM-dd'));

    useEffect(() => {
        onDateSelect(selectedDate);
    }, []);

    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weeks = [];
    let currentWeek = [];

    days.forEach((day) => {
        if (currentWeek.length === 0 && currentWeek.length < 7) {
            const weekStart = startOfWeek(day);
            let paddingDay = weekStart;
            while (paddingDay < day) {
                currentWeek.push(paddingDay);
                paddingDay = addDays(paddingDay, 1);
            }
        }

        currentWeek.push(day);

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    const getActivityLevel = (date) => {
        const dayActivity = data.find(a =>
            format(new Date(a.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );

        if (!dayActivity) return 'none';
        const count = dayActivity.count || 0;

        if (count === 0) return 'none';
        if (count < 10) return 'low';
        if (count < 25) return 'medium';
        return 'high';
    };

    const handleDateClick = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        setSelectedDate(formattedDate);
        onDateSelect(formattedDate);
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="space-y-2">
                <div className="flex gap-2">
                    <div className="w-8" />
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <div key={`${day}-${index}`} className="w-10 text-center text-md text-[#A1A1AA]">
                            {day}
                        </div>
                    ))}
                </div>

                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex gap-2">
                        <div className="w-8 text-md text-[#A1A1AA] flex items-center">
                            {format(week[0], 'MMM')}
                        </div>
                        {week.map((day, dayIndex) => {
                            const level = getActivityLevel(day);
                            const isSelected = format(day, 'yyyy-MM-dd') === selectedDate;
                            const dayFormatted = format(day, 'd');

                            return (
                                <button
                                    key={dayIndex}
                                    onClick={() => handleDateClick(day)}
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center relative
                                        ${level === 'none' ? 'bg-[#27272A]' : ''}
                                        ${level === 'low' ? 'bg-[#2D1B69]' : ''}
                                        ${level === 'medium' ? 'bg-[#4B2CA0]' : ''}
                                        ${level === 'high' ? 'bg-[#6940D6]' : ''}
                                        transition-all duration-200
                                        ${isSelected ? 'after:absolute after:inset-0 after:rounded-full after:ring-2 after:ring-[#32E0C4]' : ''}
                                        hover:after:absolute hover:after:inset-0 hover:after:rounded-full hover:after:ring-2 hover:after:ring-[#32E0C4]
                                    `}
                                >
                                    <span className={`text-md ${level === 'none' ? 'text-[#A1A1AA]' : 'text-white'}`}>
                                        {dayFormatted}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend
            <div className="flex items-center gap-4 pt-2">
                <div className="text-sm text-[#A1A1AA]">Activity:</div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#27272A]" />
                    <span className="text-sm text-[#A1A1AA]">None</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#2D1B69]" />
                    <span className="text-sm text-[#A1A1AA]">&lt;10</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#4B2CA0]" />
                    <span className="text-sm text-[#A1A1AA]">&lt;25</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#6940D6]" />
                    <span className="text-sm text-[#A1A1AA]">25+</span>
                </div>
            </div> */}
        </div>
    );
};

export default DashboardHeatmap;