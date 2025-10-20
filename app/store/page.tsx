'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUser from '@/hooks/useUser';

// 🧩 引入模块化组件
import WelcomeHeader from '@/components/store/WelcomeHeader';
import CorePanel from '@/components/store/CorePanel';
import StoreGrid from '@/components/store/StoreGrid';
import SkillCard from '@/components/store/SkillCard';
import StoreFooter from '@/components/store/StoreFooter';
import styles from './Store.module.css';

export default function StoreHome() {
  const { user, loading } = useUser();
  const router = useRouter();

  // ✅ 登录状态验证逻辑保持不变
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/auth/login?next=/store');
      }
      if (user?.isSystemAccount) {
        router.replace('/admin');
      }
    }
  }, [user, loading, router]);

  // ✅ 验证中或未登录时显示简洁加载提示
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fb] text-gray-600 text-sm">
        Loading Store...
      </div>
    );
  }

  // ✅ 登录后展示主界面
  return (
    <div className={styles.wrap}>
      {/* 顶部欢迎栏（带用户名） */}
      <WelcomeHeader />

      {/* 核心模块区域 */}
      <CorePanel heading="Core Skills">
        <StoreGrid>
          <SkillCard
            href="/store/speaking"
            title="Speaking"
            caption="RA · RS · DI · SGD"
          />
          <SkillCard
            href="/store/writing"
            title="Writing"
            caption="SWT · WE"
          />
          <SkillCard
            href="/store/listening"
            title="Listening"
            caption="WFD · SST"
          />
          <SkillCard
            href="/store/reading"
            title="Reading"
            caption="FIB-RW · FIB-R"
          />
        </StoreGrid>
      </CorePanel>

      {/* 页脚 */}
      <StoreFooter />
    </div>
  );
}
