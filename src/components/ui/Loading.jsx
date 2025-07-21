import { motion } from "framer-motion";

const Loading = ({ type = "kanban" }) => {
  if (type === "kanban") {
    return (
      <div className="flex gap-6 p-6 h-full overflow-hidden">
        {[1, 2, 3].map((column) => (
          <div key={column} className="flex-1 space-y-4">
            {/* Column Header Skeleton */}
            <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg h-12 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-200, 200] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            </div>
            
            {/* Task Card Skeletons */}
            {[1, 2, 3, 4].map((card) => (
              <div key={card} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
                {/* Title */}
                <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded h-5 w-3/4 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: [-200, 200] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: card * 0.1 }}
                  />
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded h-4 w-full relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: [-200, 200] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: card * 0.15 }}
                    />
                  </div>
                  <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded h-4 w-2/3 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: [-200, 200] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: card * 0.2 }}
                    />
                  </div>
                </div>
                
                {/* Footer */}
                <div className="flex justify-between items-center pt-2">
                  <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full h-6 w-20 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: [-200, 200] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: card * 0.25 }}
                    />
                  </div>
                  <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full h-8 w-8 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: [-200, 200] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: card * 0.3 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (type === "projects") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3, 4, 5, 6].map((card) => (
          <div key={card} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
            {/* Project Title */}
            <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded h-6 w-3/4 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-200, 200] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: card * 0.1 }}
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded h-4 w-full relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-200, 200] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: card * 0.15 }}
                />
              </div>
              <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded h-4 w-4/5 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-200, 200] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: card * 0.2 }}
                />
              </div>
            </div>
            
            {/* Progress Ring */}
            <div className="flex items-center space-x-4 pt-2">
              <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full h-12 w-12 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-200, 200] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: card * 0.25 }}
                />
              </div>
              <div className="space-y-2 flex-1">
                <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded h-4 w-24 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: [-200, 200] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: card * 0.3 }}
                  />
                </div>
                <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded h-3 w-16 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: [-200, 200] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: card * 0.35 }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default Loading;