'use client';

import React, { useEffect } from 'react';
import UnifiedLegalPage from '../privacy/page';

export default function TermsPage() {
  useEffect(() => {
    // If no specific hash is set, smoothly scroll to Terms of Service section
    if (typeof window !== 'undefined' && !window.location.hash) {
      setTimeout(() => {
        const termsHeader = document.getElementById('terms-of-service-header');
        if (termsHeader) {
          termsHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 350);
    }
  }, []);

  return <UnifiedLegalPage />;
}
