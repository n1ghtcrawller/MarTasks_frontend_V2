'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { 
  FaFolderOpen, 
  FaTasks, 
  FaCog, 
  FaUser,
  FaPlus
} from 'react-icons/fa';
import { withVibration, VIBRATION_PATTERNS } from '../utils/vibration';
import { hapticNavigation, withHapticFeedback } from '../utils/hapticFeedback';

export default function ProjectsLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const handleCreateProject = withHapticFeedback(
    withVibration(() => router.push('/projects/create'), VIBRATION_PATTERNS.NAVIGATION),
    'medium'
  );
  
  const navigationItems = [
    {
      name: 'Проекты',
      href: '/projects',
      icon: FaFolderOpen,
      isActive: pathname === '/projects'
    },
    {
      name: 'Мои задачи',
      href: '/projects/tasks',
      icon: FaTasks,
      isActive: pathname === '/projects/tasks'
    },
    {
      name: 'Настройки',
      href: '/projects/settings',
      icon: FaCog,
      isActive: pathname === '/projects/settings'
    },
    {
      name: 'Профиль',
      href: '/projects/profile',
      icon: FaUser,
      isActive: pathname === '/projects/profile'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Основной контент */}
      <main className="flex-1 pb-20">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      
      {/* Нижняя навигация */}
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2"
      >
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navigationItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  onClick={withHapticFeedback(() => {}, 'light')}
                  className={`
                    flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200
                    ${item.isActive 
                      ? 'text-[#7370fd] bg-[#7370fd]/10' 
                      : 'text-gray-600 hover:text-[#7370fd] hover:bg-[#7370fd]/5'
                    }
                  `}
                >
                  <IconComponent className="text-xl mb-1" />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              </motion.div>
            );
          })}          
        </div>
      </motion.nav>
    </div>
  );
}
