import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import taskService from "@/services/api/taskService";

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const loadTasks = async () => {
    try {
      setError("");
      setLoading(true);
      const tasksData = await taskService.getAll();
      setTasks(tasksData);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTasks} />;
  }

  const tasksWithDueDates = tasks.filter(task => task.dueDate);

  if (tasksWithDueDates.length === 0) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-8">
          <h1 className="text-3xl font-bold font-display mb-2">Calendar</h1>
          <p className="text-primary-100 text-lg">View tasks by due date</p>
        </div>
        
        <div className="p-6">
          <Empty
            icon="Calendar"
            title="No scheduled tasks"
            description="Tasks with due dates will appear here on the calendar."
            actionLabel="View Projects"
            onAction={() => window.location.href = "/dashboard"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display mb-2">Calendar</h1>
            <p className="text-primary-100 text-lg">View tasks by due date</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold font-display">
                {tasksWithDueDates.length}
              </div>
              <div className="text-primary-100 text-sm">Scheduled Tasks</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="ChevronLeft" size={20} />
              </button>
              
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Today
              </button>
              
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="ChevronRight" size={20} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-4 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-4">
              {monthDays.map((day, index) => {
                const dayTasks = getTasksForDate(day);
                const isCurrentDay = isToday(day);

                return (
                  <motion.div
                    key={day.toISOString()}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className={`min-h-[120px] p-3 rounded-lg border transition-all duration-200 ${
                      isCurrentDay
                        ? "bg-primary-50 border-primary-200"
                        : "bg-white border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      isCurrentDay ? "text-primary-700" : "text-gray-900"
                    }`}>
                      {format(day, "d")}
                    </div>

                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.Id}
                          className={`text-xs p-2 rounded border ${getPriorityColor(task.priority)} truncate`}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                      
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-500 text-center py-1">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 font-display">
              Upcoming Tasks
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            {tasksWithDueDates
              .filter(task => new Date(task.dueDate) >= new Date())
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 5)
              .map((task) => (
                <div
                  key={task.Id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === "High" ? "bg-red-500" :
                      task.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
                    }`} />
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-500">{task.assignee}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {format(new Date(task.dueDate), "MMM dd")}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;