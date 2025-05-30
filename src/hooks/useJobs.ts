import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { JobApplication } from '@/types';

export function useJobs() {
    const [jobs, setJobs] = useState<JobApplication[]>([]);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const jobsQuery = query(collection(db, 'jobs'), where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(jobsQuery, (snapshot) => {
            const jobsData = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    dateApplied: data.dateApplied instanceof Timestamp ? data.dateApplied.toDate() : new Date(data.dateApplied),
                    createdAt: data.createdAt?.toDate(),
                    updatedAt: data.updatedAt?.toDate(),
                    events: data.events?.map((event: any) => ({
                        ...event,
                        date: event.date instanceof Timestamp ? event.date.toDate() : new Date(event.date)
                    })) || []
                } as JobApplication;
            });

            setJobs(jobsData.sort((a, b) => b.dateApplied.getTime() - a.dateApplied.getTime()));
        });

        return () => unsubscribe();
    }, []);

    return { jobs };
}