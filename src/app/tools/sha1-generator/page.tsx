'use client';
import ShaGenerator from '@/components/ShaGenerator';

const Sha1Page = () => (
    <ShaGenerator
        algorithm="SHA-1"
        title="SHA-1 Generator"
        description="Calculate a secure 160-bit SHA-1 hash for any text input"
        id="sha1-generator"
    />
);
export default Sha1Page;
