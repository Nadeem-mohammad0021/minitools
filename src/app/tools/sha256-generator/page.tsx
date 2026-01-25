'use client';
import ShaGenerator from '@/components/ShaGenerator';

const Sha256Page = () => (
    <ShaGenerator
        algorithm="SHA-256"
        title="SHA-256 Generator"
        description="Generate a highly secure 256-bit cryptographic hash for your data"
        id="sha256-generator"
    />
);
export default Sha256Page;
