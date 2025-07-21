import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3 font-display">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}. Don't worry, these things happen. Please try again.
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={18} />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;