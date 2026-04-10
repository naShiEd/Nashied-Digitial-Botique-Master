import React, { createContext, useContext, useState, useEffect } from 'react';
import initialContent from './data/cms-content.json';

// Types for CMS Content
export interface CMSContent {
  global: {
    companyName: string;
    logo: string;
    contact: {
      email: string;
      supportEmail?: string;
      phone: string;
      whatsapp: string;
      address: string;
      city: string;
      postal: string;
    };
    social: {
      facebook: string;
      linkedin: string;
      twitter: string;
    };
    footer: {
      text: string;
      tagline: string;
    };
    seo: {
      defaultTitle: string;
      defaultDesc: string;
    };
    compliance: Array<{ name: string; logo: string }>;
  };
  pages: Record<string, any>;
  collections: {
    services: any[];
    team: any[];
    faqs: any[];
    news: any[];
    insights: any[];
  };
}

interface CMSContextType {
  content: CMSContent;
  updateContent: (newContent: CMSContent) => void;
  isLoading: boolean;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start from the bundled JSON (guaranteed fresh on every deploy)
  const [content, setContent] = useState<CMSContent>(initialContent as CMSContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCMS = async () => {
      // 1. Try to fetch the live JSON from the server (cache-busted with timestamp)
      try {
        const response = await fetch(`/cms-content.json?cb=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          setContent(data);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Could not fetch live cms-content.json, checking for admin saves', err);
      }

      // 2. Only fall back to localStorage if the server fetch failed AND
      //    the saved version is newer than the bundled content.
      //    This prevents stale localStorage from overriding fresh deploy data.
      const savedContent = localStorage.getItem('cms_content');
      const savedVersion = localStorage.getItem('cms_version');
      const bundledVersion = (initialContent as any)._version ?? '0';

      if (savedContent && savedVersion && savedVersion > bundledVersion) {
        try {
          setContent(JSON.parse(savedContent));
          setIsLoading(false);
          return;
        } catch (e) {
          console.error('Failed to parse saved content', e);
          localStorage.removeItem('cms_content');
          localStorage.removeItem('cms_version');
        }
      }

      // 3. Fall back to bundled initial content (already set as default state)
      setIsLoading(false);
    };

    loadCMS();
  }, []);

  const updateContent = async (newContent: CMSContent) => {
    // Update local state immediately for UI responsiveness
    setContent(newContent);
    try {
      localStorage.setItem('cms_content', JSON.stringify(newContent));
      localStorage.setItem('cms_version', Date.now().toString());
    } catch (e) {
      console.warn("LocalStorage quota exceeded, local persistence skipped.", e);
    }
    
    // Attempt global persistence to the JSON file
    const response = await fetch('/php-backend/save.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContent)
    });

    if (!response.ok) {
      throw new Error("Server-side save failed");
    }
    
    const result = await response.json();
    if (result.error) {
      throw new Error(result.error);
    }

    console.log("Global persistence successful");
    return true;
  };

  return (
    <CMSContext.Provider value={{ content, updateContent, isLoading }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
