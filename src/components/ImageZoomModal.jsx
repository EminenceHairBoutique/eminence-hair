import { motion, AnimatePresence } from "framer-motion";

export default function ImageZoomModal({ src, open, onClose }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.img
          src={src}
          className="max-h-[90vh] max-w-[90vw] object-contain cursor-zoom-out"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
