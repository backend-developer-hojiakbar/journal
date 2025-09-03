import React from 'react';
// Try different import methods
import { Fingerprint } from 'lucide-react';
// Or try: import * as Icons from 'lucide-react';

const TestFingerprint = () => {
  return (
    <div className="p-4">
      <h2>Testing Fingerprint Icon</h2>
      <Fingerprint size={24} />
      {/* If using Icons: <Icons.Fingerprint size={24} /> */}
    </div>
  );
};

export default TestFingerprint;