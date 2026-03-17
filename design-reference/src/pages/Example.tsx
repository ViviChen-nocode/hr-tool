import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Sparkles } from 'lucide-react';
import mascotImage from '@/assets/mascot.png';

const Example = () => {
  return (
    <PageLayout
      footerProps={{
        author: 'Vivi Chen 大師姐',
        authorLink: 'https://www.facebook.com/vivichen.sister',
        year: 2025,
        showHeart: true,
      }}
      mascotProps={{
        image: mascotImage,
        link: 'https://liff.line.me/1645278921-kWRPP32q/?accountId=026adbfw',
        hoverText: '聯繫大師姐',
        position: 'bottom-right',
        size: 'medium',
      }}
    >
      {/* Header */}
      <div className="text-center mb-6 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
          <Sparkles className="w-4 h-4" />
          設計系統模板
        </div>
        <h1 className="text-3xl font-bold gradient-text">
          歡迎使用設計系統模板
        </h1>
        <p className="text-muted-foreground">
          這是一個完整的設計系統模板，包含可重用的組件和樣式系統。
        </p>
      </div>

      {/* Main Card */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">組件說明</h2>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground mb-2">Footer 組件</h3>
            <p className="text-sm">
              可配置的作者資訊、連結和年份。支援顯示/隱藏愛心圖示。
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">FloatingMascot 組件</h3>
            <p className="text-sm">
              浮動角色組件，支援自訂圖片、連結、懸停文字、位置和大小。
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">PageLayout 組件</h3>
            <p className="text-sm">
              標準頁面佈局，整合了 Footer 和 FloatingMascot 組件。
            </p>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">使用範例</h2>
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">基本使用</h3>
            <pre className="text-xs overflow-x-auto">
              <code>{`import { PageLayout } from '@/components/PageLayout';
import mascotImage from '@/assets/mascot.png';

<PageLayout
  footerProps={{
    author: 'Your Name',
    authorLink: 'https://example.com',
    year: 2025,
  }}
  mascotProps={{
    image: mascotImage,
    link: 'https://example.com',
    hoverText: '聯繫我',
  }}
>
  {/* 你的內容 */}
</PageLayout>`}</code>
            </pre>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Example;

