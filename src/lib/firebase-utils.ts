import { db } from './firebase';
import { arrayUnion, getDoc } from 'firebase/firestore';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    DocumentData,
    QueryDocumentSnapshot,
    Timestamp
} from 'firebase/firestore';
import { JobApplication, JobEvent } from '@/types';

// Create a new job application
export const createJob = async (
    userId: string,
    jobData: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) => {
    try {
        const docRef = await addDoc(collection(db, 'jobs'), {
            ...jobData,
            userId,
            dateApplied: Timestamp.fromDate(jobData.dateApplied),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            events: []
        });

        return docRef.id;
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
};

// Update an existing job application
export const updateJob = async (
    jobId: string,
    updates: Partial<JobApplication>
) => {
    try {
        const jobRef = doc(db, 'jobs', jobId);
        await updateDoc(jobRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating job:', error);
        throw error;
    }
};

// Delete a job application
export const deleteJob = async (jobId: string) => {
    try {
        const jobRef = doc(db, 'jobs', jobId);
        await deleteDoc(jobRef);
    } catch (error) {
        console.error('Error deleting job:', error);
        throw error;
    }
};

// Add an event to a job application
export const addJobEvent = async (
    jobId: string,
    event: Omit<JobEvent, 'id'>
) => {
    try {
        const jobRef = doc(db, 'jobs', jobId);
        const eventId = Math.random().toString(36).substr(2, 9);
        const newEvent = {
            ...event,
            id: eventId
        };

        await updateDoc(jobRef, {
            events: arrayUnion(newEvent),
            updatedAt: serverTimestamp()
        });

        return eventId;
    } catch (error) {
        console.error('Error adding event:', error);
        throw error;
    }
};

// Delete an event from a job application
export const deleteJobEvent = async (
    jobId: string,
    eventId: string
) => {
    try {
        const jobRef = doc(db, 'jobs', jobId);
        const jobDoc = await getDoc(jobRef);
        const jobData = jobDoc.data() as DocumentData;
        const events = jobData?.events || [];
        const updatedEvents = events.filter((event: JobEvent) => event.id !== eventId);

        await updateDoc(jobRef, {
            events: updatedEvents,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};

// Helper function to convert Firestore data to JobApplication type
export const convertJobDoc = (doc: QueryDocumentSnapshot) => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        dateApplied: data.dateApplied.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        events: data.events?.map((event: any) => ({
            ...event,
            date: event.date.toDate()
        })) || []
    } as JobApplication;
};