import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing here yet.", 
  actionLabel,
  onAction,
  icon = "Package"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-32 h-32 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 animate-pulse"></div>
        <ApperIcon name={icon} size={48} className="text-primary-600 relative z-10" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md text-lg">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="btn-primary inline-flex items-center space-x-3 text-lg px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" size={20} />
          <span>{actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;