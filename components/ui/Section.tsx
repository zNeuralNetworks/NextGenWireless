import React, { ReactNode, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { useInView, motion } from 'framer-motion';
import Copy from 'lucide-react/dist/esm/icons/copy.js';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ id, title, subtitle, eyebrow, children, className = '' }) => {
  const { setActiveSection, copyToClipboard } = useStore();
  const ref = useRef(null);
  
  // Trigger when the element crosses the center of the viewport
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveSection(id);
    }
  }, [isInView, id, setActiveSection]);

  return (
    <section id={id} ref={ref} className={`min-h-[50vh] md:min-h-screen py-16 md:py-32 px-6 md:px-12 lg:px-16 flex flex-col justify-center ${className}`}>
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-12 md:mb-16">
            {eyebrow && (
              <span className="block text-arista-blue font-mono text-xs md:text-sm font-bold tracking-widest uppercase mb-3">
                {eyebrow}
              </span>
            )}
            <div 
              className="group inline-flex items-center gap-3 cursor-pointer"
              onClick={() => copyToClipboard(title)}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400 tracking-tight group-hover:to-arista-blue transition-all">
                {title}
              </h2>
              <Copy size={20} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-all hidden md:block" />
            </div>
            {subtitle && (
              <p 
                className="text-lg md:text-xl text-slate-300 max-w-2xl font-normal mt-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => copyToClipboard(subtitle)}
              >
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </motion.div>
      </div>
    </section>
  );
};
