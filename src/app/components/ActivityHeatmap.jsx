import { format, subDays, eachDayOfInterval, startOfWeek, addDays } from 'date-fns';
import Image from 'next/image';

const ActivityHeatmap = ({ activity }) => {
    const now = new Date();
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
        const dayActivity = activity.find(a =>
            format(new Date(a.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );

        if (!dayActivity) return 'none';
        const count = dayActivity.cards_studied;

        if (count === 0) return 'none';
        if (count < 10) return 'low';
        if (count < 25) return 'medium';
        return 'high';
    };

    return (
        <div className="w-full pb-6">
            <div className="border-b border-[#27272A] mb-2">
                <div className="flex items-center gap-4 px-6 py-6">
                    <div className="bg-[#09090B] rounded-lg p-2">
                        <Image
                            src="/Assets/calendar-icon.svg"
                            width={35}
                            height={35}
                            alt="AI"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl mb-[1%]">Study Activity</h2>
                        <p className="text-md text-[#A1A1AA]">Your monthly flashcard study activity</p>
                    </div>
                </div>
            </div>

            <div className='px-4 py-3'>
                <div className="flex flex-col items-center">
                    {/* Calendar grid */}
                    <div className='flex justify-center w-[400px]'>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <div className="w-8" /> {/* Empty space for month alignment */}
                              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                              <div key={`${day}-${index}`} className="w-10 text-center text-md text-[#A1A1AA]">
                                {day}
                              </div>
                            ))}
                            </div>

                            {/* Weeks */}
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex gap-2">
                                    <div className="w-8 text-md text-[#A1A1AA] flex items-center">
                                        {format(week[0], 'MMM')}
                                    </div>
                                    {week.map((day, dayIndex) => {
                                        const level = getActivityLevel(day);
                                        return (
                                            <div
                                                key={dayIndex}
                                                className="relative group"
                                            >
                                                <div
                                                    className={`
                                                        w-10 h-10 rounded-full flex items-center justify-center
                                                        ${level === 'none' ? 'bg-[#27272A]' : ''}
                                                        ${level === 'low' ? 'bg-[#A0E7E5]' : ''}
                                                        ${level === 'medium' ? 'bg-[#20B2AA]' : ''}
                                                        ${level === 'high' ? 'bg-[#014D4E]' : ''}
                                                        transition-colors duration-200
                                            `}
                                                >
                                                    <span className={`text-md ${level === 'none' ? 'text-[#A1A1AA]' :
                                                            level === 'low' ? 'text-[#09090B]' :
                                                            level === 'medium' ? 'text-white' :
                                                            'text-white'
                                                        }`}>
                                                        {format(day, 'd')}
                                                    </span>
                                                </div>

                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#18181B] text-white text-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {format(day, 'MMM d, yyyy')}: {' '}
                                                    {activity.find(a => format(new Date(a.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))?.cards_studied || 0} cards studied
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex items-center gap-4">
                        <div className="text-md text-[#A1A1AA]">Activity:</div>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#27272A]" />
                            <span className="text-md text-[#A1A1AA]">None</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#A0E7E5]" />
                            <span className="text-md text-[#A1A1AA]">&lt;10</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#20B2AA]" />
                            <span className="text-md text-[#A1A1AA]">&lt;25</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#014D4E]" />
                            <span className="text-md text-[#A1A1AA]">25+</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityHeatmap;