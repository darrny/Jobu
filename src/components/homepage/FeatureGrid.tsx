import FeatureCard from "./FeatureCard";
import { Briefcase, Calendar, CheckCircle2, BarChart3 } from 'lucide-react';

const features = [
    {
        title: "Application Tracking",
        description: "Keep track of all your job applications in one organized dashboard.",
        Icon: Briefcase
    },
    {
        title: "Event Management",
        description: "Never miss an interview or assessment with our event tracking system.",
        Icon: Calendar
    },
    {
        title: "Status Updates",
        description: "Update and track the status of each application as you progress.",
        Icon: BarChart3
    },
    {
        title: "Analytics",
        description: "Get insights into your application success rate and activity.",
        Icon: CheckCircle2
    }
];

export default function FeatureGrid() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
            ))}
        </div>
    );
}