import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    title: string;
    description: string;
    Icon: LucideIcon;
}

export default function FeatureCard({ title, description, Icon }: FeatureCardProps) {
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{ title }</h3>
            <p className="text-gray-600">{ description }</p>
        </div>
    );
}