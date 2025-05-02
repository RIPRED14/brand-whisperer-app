
import React from 'react';
import Header from '@/components/Header';

interface SamplePageHeaderProps {
  title: string;
}

const SamplePageHeader: React.FC<SamplePageHeaderProps> = ({ title }) => {
  return <Header title={title} />;
};

export default SamplePageHeader;
